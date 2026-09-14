/**
 * Client-Side PII Shield & Privacy Redaction Utility
 * Detects sensitive personal and financial identifiers locally before text is submitted to any LLM.
 * Allows re-hydration of original values on the client side when viewing results.
 */

import { RedactionRecord, RedactionType, SanitizationResult } from "./types";

/**
 * Common regex patterns for PII detection in legal documents
 */
const PATTERNS: Array<{
  type: RedactionType;
  prefix: string;
  regex: RegExp;
}> = [
  {
    type: "email",
    prefix: "EMAIL",
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  },
  {
    type: "id",
    prefix: "GOVT_ID",
    regex: /\b(?:\d{3}-\d{2}-\d{4}|\d{2}-\d{7})\b/g, // SSN or EIN format
  },
  {
    type: "phone",
    prefix: "PHONE",
    regex: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  },
  {
    type: "amount",
    prefix: "AMOUNT",
    regex: /(?:\$|USD\s*|€|£|INR\s*|₹\s*)\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:per\s+(?:month|year|hour|day|project)|(?:\/month|\/year|\/hr|\/day)))?/gi,
  },
  {
    type: "address",
    prefix: "ADDRESS",
    regex: /\b\d{1,5}\s+[A-Za-z0-9\s.,]{3,30}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Suite|Ste|Floor|Fl)\b[A-Za-z0-9\s,.-]{0,40}\b\d{5}(?:-\d{4})?\b/gi,
  },
];

/**
 * Party detection pattern:
 * Matches "between [Party A] ... and [Party B]" or "known as [Party Name]"
 */
const PARTY_PATTERNS = [
  /between\s+([A-Z][A-Za-z0-9\s,.'&-]+?)(?:\s*,?\s*(?:hereinafter|referred to as|\("Client"|\("Company"|\("Landlord"|\("Employer"))/gi,
  /and\s+([A-Z][A-Za-z0-9\s,.'&-]+?)(?:\s*,?\s*(?:hereinafter|referred to as|\("Contractor"|\("Consultant"|\("Tenant"|\("Employee"))/gi,
];

/**
 * Anonymizes legal document text on the client side prior to sending to LLMs
 */
export function sanitizeContractText(rawText: string): SanitizationResult {
  if (!rawText || typeof rawText !== "string") {
    return { sanitizedText: "", redactions: [] };
  }

  let sanitized = rawText;
  const redactions: RedactionRecord[] = [];
  const tokenCounters: Record<string, number> = {};

  const getNextToken = (prefix: string): string => {
    tokenCounters[prefix] = (tokenCounters[prefix] || 0) + 1;
    return `[${prefix}_${tokenCounters[prefix]}]`;
  };

  // 1. Detect and mask specific party definitions if present
  let partyIndex = 1;
  for (const pattern of PARTY_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match, partyName) => {
      const trimmed = partyName.trim();
      if (trimmed.length > 2 && !trimmed.toLowerCase().startsWith("the party")) {
        const token = `[PARTY_${partyIndex === 1 ? "A" : "B"}]`;
        redactions.push({
          id: `redaction-party-${partyIndex}`,
          token,
          original: trimmed,
          type: "name",
        });
        partyIndex++;
        return match.replace(partyName, token);
      }
      return match;
    });
  }

  // 2. Detect and mask emails, phones, amounts, IDs, and addresses
  for (const { type, prefix, regex } of PATTERNS) {
    sanitized = sanitized.replace(regex, (match) => {
      // Check if already redacted
      if (match.startsWith("[") && match.endsWith("]")) {
        return match;
      }
      const existing = redactions.find((r) => r.original === match);
      if (existing) {
        return existing.token;
      }
      const token = getNextToken(prefix);
      redactions.push({
        id: `redaction-${type}-${redactions.length + 1}`,
        token,
        original: match,
        type,
      });
      return token;
    });
  }

  return {
    sanitizedText: sanitized,
    redactions,
  };
}

/**
 * Rehydrates sanitized text back with original identifiers on the client side
 */
export function rehydrateContractText(
  sanitizedText: string,
  redactions: RedactionRecord[]
): string {
  if (!sanitizedText || !redactions || redactions.length === 0) {
    return sanitizedText;
  }

  let rehydrated = sanitizedText;
  for (const item of redactions) {
    rehydrated = rehydrated.replaceAll(item.token, item.original);
  }
  return rehydrated;
}
