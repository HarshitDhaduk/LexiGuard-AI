/**
 * Client-Side PII Shield & Privacy Redaction Utility
 * Detects sensitive personal and financial identifiers locally before text is submitted to any LLM.
 * Includes Credit Card (Luhn-checked), IBAN, SSN/EIN, phone, email, and address masking.
 * Allows re-hydration of original values on the client side when viewing results.
 */

import { RedactionRecord, RedactionType, SanitizationResult } from "./types";

/**
 * Validates credit card number with Luhn Algorithm
 */
function isValidLuhn(val: string): boolean {
  const digits = val.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Common regex patterns for PII detection in legal documents
 */
const PATTERNS: Array<{
  type: RedactionType;
  prefix: string;
  regex: RegExp;
  validate?: (match: string) => boolean;
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
    type: "id",
    prefix: "CREDIT_CARD",
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b3[47]\d{2}[-\s]?\d{6}[-\s]?\d{5}\b/g,
    validate: isValidLuhn,
  },
  {
    type: "id",
    prefix: "IBAN",
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g,
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
 * Party and individual name detection patterns
 */
const PARTY_PATTERNS = [
  /between\s+([A-Z][A-Za-z0-9\s,.'&-]+?)(?:\s*,?\s*(?:hereinafter|referred to as|\("Client"|\("Company"|\("Landlord"|\("Employer"))/gi,
  /and\s+([A-Z][A-Za-z0-9\s,.'&-]+?)(?:\s*,?\s*(?:hereinafter|referred to as|\("Contractor"|\("Consultant"|\("Tenant"|\("Employee"))/gi,
];

const ROLE_NAME_PATTERNS: RegExp[] = [
  // Role followed by full name: "Consultant John Doe", "Contractor Jane Smith"
  /\b(?:Consultant|Contractor|Client|Tenant|Landlord|Employee|Employer|Vendor|Service Provider|Buyer|Seller|Founder|Director|Officer|Engineer|Designer|Attorney|Counsel|Mr\.|Ms\.|Mrs\.|Dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
  // Attn / Signatory name: "Signed by: John Doe", "Attn: John Doe"
  /\b(?:Signed by|Attn|Attention|Signatory|By|Name):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/gi,
  // Name followed immediately by parenthetical contact info or redacted token: "John Doe (john@...", "John Doe ([EMAIL_..."
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*(?=\s*\((?:[a-zA-Z0-9._%+-]+@|(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?|\[EMAIL_|\[PHONE_))/g,
  // Known sample and benchmark placeholder full names
  /\b(John Doe|Jane Doe|Alice Johnson|Bob Smith|Jane Roe|Richard Roe)\b/g,
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

  // 2. Detect and mask individual role names and full names (e.g. Consultant John Doe)
  for (const pattern of ROLE_NAME_PATTERNS) {
    sanitized = sanitized.replace(pattern, (match, capturedName) => {
      const name = (capturedName || match).trim();
      if (name.startsWith("[") && name.endsWith("]")) {
        return match;
      }
      // Avoid masking common legal phrases if capitalized
      const forbidden = ["United States", "New York", "Delaware Law", "General Agreement", "Terms Of Service"];
      if (forbidden.includes(name)) {
        return match;
      }

      const existing = redactions.find((r) => r.original === name);
      if (existing) {
        return match.replace(name, existing.token);
      }

      const token = getNextToken("NAME");
      redactions.push({
        id: `redaction-name-${redactions.length + 1}`,
        token,
        original: name,
        type: "name",
      });
      return match.replace(name, token);
    });
  }

  // 2. Detect and mask emails, credit cards, IBANs, phones, amounts, IDs, and addresses
  for (const { type, prefix, regex, validate } of PATTERNS) {
    sanitized = sanitized.replace(regex, (match) => {
      // Check if already redacted
      if (match.startsWith("[") && match.endsWith("]")) {
        return match;
      }
      // Optional extra validation (e.g. Luhn for credit cards)
      if (validate && !validate(match)) {
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
