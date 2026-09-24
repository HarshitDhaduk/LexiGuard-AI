import { describe, it, expect } from "vitest";
import { LEGAL_AID_DIRECTORY, STATUTORY_PROTECTIONS } from "../src/lib/legal-aid";

describe("Legal Aid & Access to Justice Knowledgebase", () => {
  describe("LEGAL_AID_DIRECTORY", () => {
    it("contains pro bono resources across all target demographics", () => {
      expect(LEGAL_AID_DIRECTORY.length).toBeGreaterThanOrEqual(5);

      const categories = LEGAL_AID_DIRECTORY.map((r) => r.category);
      expect(categories).toContain("Federal Legal Aid");
      expect(categories).toContain("Tenant Rights");
      expect(categories).toContain("Freelancer Rights");
      expect(categories).toContain("Pro Bono Clinic");
      expect(categories).toContain("Small Business");
    });

    it("ensures each resource has valid external portal links and descriptions", () => {
      LEGAL_AID_DIRECTORY.forEach((res) => {
        expect(res.id).toBeTruthy();
        expect(res.name).toBeTruthy();
        expect(res.description.length).toBeGreaterThan(30);
        expect(res.eligibility.length).toBeGreaterThan(15);
        expect(res.url).toMatch(/^https:\/\//);
        expect(res.badge).toBeTruthy();
        expect(res.regions.length).toBeGreaterThan(0);
      });
    });

    it("includes the federal Legal Services Corporation (LSC) provider", () => {
      const lsc = LEGAL_AID_DIRECTORY.find((r) => r.id === "lsc-nationwide");
      expect(lsc).toBeDefined();
      expect(lsc?.url).toContain("lsc.gov");
    });

    it("includes ABA Free Legal Answers clinic", () => {
      const aba = LEGAL_AID_DIRECTORY.find((r) => r.id === "aba-free-legal-answers");
      expect(aba).toBeDefined();
      expect(aba?.url).toContain("abafreelegalanswers.org");
    });
  });

  describe("STATUTORY_PROTECTIONS", () => {
    it("includes verified statutory consumer and worker protection acts", () => {
      expect(STATUTORY_PROTECTIONS.length).toBeGreaterThanOrEqual(4);

      const names = STATUTORY_PROTECTIONS.map((s) => s.statuteName);
      expect(names.some((n) => n.includes("Freelance Isn't Free"))).toBe(true);
      expect(names.some((n) => n.includes("California Freelance"))).toBe(true);
      expect(names.some((n) => n.includes("Landlord and Tenant"))).toBe(true);
    });

    it("maps statutory protections to valid clause categories with actionable guidance", () => {
      STATUTORY_PROTECTIONS.forEach((statute) => {
        expect(statute.id).toBeTruthy();
        expect(statute.jurisdiction).toBeTruthy();
        expect(statute.summary.length).toBeGreaterThan(30);
        expect(statute.howItProtectsYou.length).toBeGreaterThan(30);
      });
    });
  });
});
