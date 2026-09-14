import { describe, it, expect } from "vitest";
import { sanitizeContractText, rehydrateContractText } from "../src/lib/pii";

describe("Client-Side PII Shield (sanitizeContractText)", () => {
  it("redacts email addresses into anonymous tokens", () => {
    const input = "Please send notices to alice.johnson@clientcorp.com immediately.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("alice.johnson@clientcorp.com");
    expect(result.sanitizedText).toMatch(/\[EMAIL_\d+\]/);
    expect(result.redactions.length).toBeGreaterThan(0);
    expect(result.redactions[0].type).toBe("email");
    expect(result.redactions[0].original).toBe("alice.johnson@clientcorp.com");
  });

  it("redacts monetary amounts and compensation figures", () => {
    const input = "Contractor will be paid $8,500.00 per month or $75.00/hr.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("$8,500.00");
    expect(result.sanitizedText).toMatch(/\[AMOUNT_\d+\]/);
    expect(result.redactions.some((r) => r.type === "amount")).toBe(true);
  });

  it("redacts phone numbers in standard US formats", () => {
    const input = "Direct inquiries to (512) 555-0198 during business hours.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("(512) 555-0198");
    expect(result.sanitizedText).toMatch(/\[PHONE_\d+\]/);
  });

  it("rehydrates sanitized text back to original values correctly", () => {
    const original = "Contact john@example.com for payment of $5,000.00.";
    const { sanitizedText, redactions } = sanitizeContractText(original);

    expect(sanitizedText).not.toBe(original);
    const restored = rehydrateContractText(sanitizedText, redactions);
    expect(restored).toBe(original);
  });

  it("handles empty or invalid inputs gracefully", () => {
    const emptyResult = sanitizeContractText("");
    expect(emptyResult.sanitizedText).toBe("");
    expect(emptyResult.redactions).toEqual([]);

    // @ts-expect-error testing invalid type
    const nullResult = sanitizeContractText(null);
    expect(nullResult.sanitizedText).toBe("");
  });
});
