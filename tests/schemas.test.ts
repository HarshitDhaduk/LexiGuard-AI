import { describe, it, expect } from "vitest";
import {
  AnalyzeRequestSchema,
  ChatRequestSchema,
  CompareRequestSchema,
  NegotiateRequestSchema,
  formatZodError,
} from "../src/lib/schemas";

describe("Runtime Zod Validation Schemas", () => {
  describe("AnalyzeRequestSchema", () => {
    it("accepts valid legal contract text", () => {
      const valid = {
        text: "This Master Services Agreement ('Agreement') is made between Party A and Party B for software consulting.",
      };
      const result = AnalyzeRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.text).toBe(valid.text);
      }
    });

    it("rejects input text shorter than 20 characters", () => {
      const result = AnalyzeRequestSchema.safeParse({ text: "Short text" });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = formatZodError(result.error);
        expect(msg).toContain("too short");
      }
    });

    it("rejects input exceeding 65,000 characters limit", () => {
      const massiveText = "a".repeat(65001);
      const result = AnalyzeRequestSchema.safeParse({ text: massiveText });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = formatZodError(result.error);
        expect(msg).toContain("exceeds");
      }
    });

    it("rejects non-string or missing text field", () => {
      const res1 = AnalyzeRequestSchema.safeParse({});
      expect(res1.success).toBe(false);

      const res2 = AnalyzeRequestSchema.safeParse({ text: 12345 });
      expect(res2.success).toBe(false);
    });
  });

  describe("ChatRequestSchema", () => {
    it("accepts valid contract context and question query", () => {
      const valid = {
        contractText: "Section 5: Payment terms are strictly Net 30 days upon invoice receipt.",
        query: "When is the client required to pay?",
      };
      const result = ChatRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query).toBe(valid.query);
        expect(result.data.stream).toBe(false); // default
      }
    });

    it("rejects missing or empty contractText", () => {
      const result = ChatRequestSchema.safeParse({
        query: "What is the penalty?",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const msg = formatZodError(result.error);
        expect(msg).toContain("contract context");
      }
    });

    it("rejects empty query string", () => {
      const result = ChatRequestSchema.safeParse({
        contractText: "Section 5: Payment terms are strictly Net 30 days upon invoice receipt.",
        query: "",
      });
      expect(result.success).toBe(false);
    });

    it("preserves conversation history objects", () => {
      const valid = {
        contractText: "Section 5: Payment terms are strictly Net 30 days upon invoice receipt.",
        query: "What if they pay late?",
        history: [
          { role: "user", content: "What are the payment terms?" },
          { role: "model", content: "Payment is Net 30 days." },
        ],
      };
      const result = ChatRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.history).toHaveLength(2);
      }
    });
  });

  describe("CompareRequestSchema", () => {
    it("accepts two valid documents for comparison", () => {
      const valid = {
        docA: "Version 1.0 of the non-disclosure agreement between the parties.",
        docB: "Version 2.0 with updated mutual confidentiality clauses added.",
      };
      const result = CompareRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects when docA is missing", () => {
      const result = CompareRequestSchema.safeParse({
        docB: "Version 2.0 of the agreement.",
      });
      expect(result.success).toBe(false);
    });

    it("rejects when docB is missing", () => {
      const result = CompareRequestSchema.safeParse({
        docA: "Version 1.0 of the agreement.",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("NegotiateRequestSchema", () => {
    it("accepts valid negotiation request and defaults stance to Balanced", () => {
      const valid = {
        clauseTitle: "Limitation of Liability",
        originalSnippet: "In no event shall the vendor's total liability exceed $500.",
      };
      const result = NegotiateRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stance).toBe("Balanced");
      }
    });

    it("accepts Protective stance", () => {
      const valid = {
        clauseTitle: "Indemnification",
        originalSnippet: "Consultant indemnifies Client for all third-party IP claims.",
        stance: "Protective" as const,
      };
      const result = NegotiateRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stance).toBe("Protective");
      }
    });

    it("rejects invalid stance option", () => {
      const invalid = {
        clauseTitle: "Indemnification",
        originalSnippet: "Consultant indemnifies Client for all third-party IP claims.",
        stance: "Aggressive",
      };
      const result = NegotiateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("formatZodError helper", () => {
    it("formats multiple issues into a clean concatenated sentence", () => {
      const badData = { clauseTitle: "X", originalSnippet: "Y" };
      const parsed = NegotiateRequestSchema.safeParse(badData);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const formatted = formatZodError(parsed.error);
        expect(typeof formatted).toBe("string");
        expect(formatted.length).toBeGreaterThan(0);
      }
    });
  });
});
