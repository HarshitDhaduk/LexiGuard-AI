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

  it("redacts physical addresses with street names and zip codes", () => {
    const input = "Located at 500 Enterprise Way, Suite 800, Austin, TX 78701 in Delaware.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("500 Enterprise Way");
    expect(result.sanitizedText).toMatch(/\[ADDRESS_\d+\]/);
  });

  it("redacts valid credit card numbers verified via Luhn algorithm", () => {
    // Valid sample test card matching Luhn check (4532-0150-1234-5671)
    const input = "Autopay billing card: 4532-0150-1234-5671 on file.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("4532-0150-1234-5671");
    expect(result.sanitizedText).toMatch(/\[CREDIT_CARD_\d+\]/);
  });

  it("leaves non-card numeric sequences unchanged if Luhn check fails", () => {
    const input = "Reference order number 1234-5678-9012-3456 is not a valid credit card.";
    const result = sanitizeContractText(input);

    // Should not mask as credit card because Luhn check fails
    expect(result.sanitizedText).not.toMatch(/\[CREDIT_CARD_\d+\]/);
  });

  it("redacts European and international IBAN account identifiers", () => {
    const input = "Wire payments to IBAN: DE89370400440532013000 at Deutsche Bank.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("DE89370400440532013000");
    expect(result.sanitizedText).toMatch(/\[IBAN_\d+\]/);
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

  it("handles multiple entities in a single contract paragraph", () => {
    const input =
      "Party A at john.doe@corp.io agrees to pay $12,500.00 to jane.smith@freelance.org by calling (212) 555-0143.";
    const result = sanitizeContractText(input);

    expect(result.sanitizedText).not.toContain("john.doe@corp.io");
    expect(result.sanitizedText).not.toContain("jane.smith@freelance.org");
    expect(result.sanitizedText).not.toContain("$12,500.00");
    expect(result.sanitizedText).not.toContain("(212) 555-0143");
    expect(result.redactions.length).toBe(4);

    const rehydrated = rehydrateContractText(result.sanitizedText, result.redactions);
    expect(rehydrated).toBe(input);
  });

  it("preserves standard legal terminology and clause headings intact", () => {
    const legalText =
      "SECTION 14: GOVERNING LAW AND JURISDICTION. This Agreement shall be governed by Delaware law.";
    const result = sanitizeContractText(legalText);

    expect(result.sanitizedText).toContain("SECTION 14: GOVERNING LAW AND JURISDICTION");
    expect(result.sanitizedText).toContain("Delaware");
  });

  it("redacts person names when preceded by role titles like Consultant John Doe", () => {
    const sampleText =
      "Consultant John Doe (john.doe@example.com, (555) 234-5678) agrees to provide services. Fees are $150 per hour Net 60.";
    const result = sanitizeContractText(sampleText);

    expect(result.sanitizedText).not.toContain("John Doe");
    expect(result.sanitizedText).not.toContain("john.doe@example.com");
    expect(result.sanitizedText).not.toContain("(555) 234-5678");
    expect(result.sanitizedText).not.toContain("$150 per hour");
    expect(result.sanitizedText).toMatch(/\[NAME_\d+\]/);
    expect(result.redactions.some((r) => r.type === "name" && r.original === "John Doe")).toBe(true);

    const rehydrated = rehydrateContractText(result.sanitizedText, result.redactions);
    expect(rehydrated).toBe(sampleText);
  });
});
