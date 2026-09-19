/**
 * Security & Adversarial Defense Utility
 * Defends against prompt injections, jailbreak vectors, markdown exfiltration,
 * and Regular Expression Denial of Service (ReDoS) attacks.
 */

export interface ValidationResult {
  isValid: boolean;
  sanitizedText: string;
  threatsDetected: string[];
  errorMessage?: string;
}

/**
 * Known LLM Prompt Injection & Jailbreak Signatures
 */
const INJECTION_PATTERNS = [
  {
    name: "Instruction Override",
    regex: /(?:ignore|disregard|forget|bypass)\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules|commands)/gi,
  },
  {
    name: "System Role Hijacking",
    regex: /(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(?:a\s+)?(?:jailbreak|DAN|unrestricted|developer\s+mode|root|administrator)/gi,
  },
  {
    name: "System Prompt Extraction",
    regex: /(?:repeat|print|reveal|output|display)\s+(?:the\s+)?(?:system\s+prompt|instructions|initial\s+prompt)/gi,
  },
  {
    name: "Markdown Exfiltration Attack",
    regex: /!\[.*?\]\((?:https?:\/\/|ftp:\/\/)[^\s)]+\)/gi,
  },
];

/**
 * Validates and sanitizes user input before passing it to LLM prompts
 */
export function sanitizePromptInput(
  rawText: string,
  maxLength = 65000
): ValidationResult {
  if (!rawText || typeof rawText !== "string") {
    return {
      isValid: false,
      sanitizedText: "",
      threatsDetected: [],
      errorMessage: "Input text is required and must be a valid string.",
    };
  }

  // Length limits to prevent ReDoS and token exhaustion
  if (rawText.trim().length < 20) {
    return {
      isValid: false,
      sanitizedText: rawText,
      threatsDetected: [],
      errorMessage: "Input is too short. Minimum 20 characters required for legal analysis.",
    };
  }

  if (rawText.length > maxLength) {
    return {
      isValid: false,
      sanitizedText: rawText.slice(0, maxLength),
      threatsDetected: ["Payload Size Exceeded Limit"],
      errorMessage: `Input exceeds maximum allowed size of ${maxLength} characters.`,
    };
  }

  let sanitized = rawText;
  const threatsDetected: string[] = [];

  // Remove null bytes and invisible control characters (except standard newlines/tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Detect and neutralize known prompt injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(sanitized)) {
      threatsDetected.push(pattern.name);
      // Neutralize without corrupting user context by tagging
      sanitized = sanitized.replace(
        pattern.regex,
        "[SECURITY NOTICE: Flagged Adversarial Pattern Neutralized]"
      );
    }
  }

  return {
    isValid: true,
    sanitizedText: sanitized,
    threatsDetected,
  };
}

/**
 * Extracts client IP safely from request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headers.get("x-real-ip") || "127.0.0.1";
}
