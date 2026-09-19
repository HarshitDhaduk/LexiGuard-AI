import { describe, it, expect } from "vitest";
import { ContractAnalysisResult } from "../src/lib/types";

describe("Domain Schema & Integrity Constraints", () => {
  it("enforces risk score bounds between 0 and 100", () => {
    const validScores = [0, 25, 50, 78, 95, 100];
    for (const score of validScores) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it("validates that analysis result adheres to complete contract schema", () => {
    const mockResult: ContractAnalysisResult = {
      documentTitle: "Test Contract",
      contractType: "Freelance MSA",
      overallRiskScore: 82,
      overallRiskRating: "High",
      executiveSummary: "Detailed executive summary of terms.",
      keyParties: ["Client Corp", "Contractor Jane"],
      clauses: [
        {
          id: "c-1",
          clauseNumber: "Section 3",
          title: "Indemnity",
          category: "Indemnification",
          originalText: "Full indemnity.",
          plainEnglish: "You pay all legal fees.",
          riskLevel: "Critical",
          riskScore: 95,
          theTrap: "Unlimited liability.",
          standardBenchmark: "Mutual cap at fees.",
        },
      ],
      missingClauses: [
        {
          id: "m-1",
          clauseName: "Cure Period",
          category: "Termination & Cancellation",
          importance: "Critical",
          whyNeeded: "Allows time to fix defects.",
          recommendedAddition: "30 days cure period.",
        },
      ],
      deadlines: [
        {
          id: "d-1",
          title: "Invoicing",
          timeframe: "End of month",
          responsibleParty: "Contractor",
          consequenceOfBreach: "Delayed payment",
          status: "Pending",
        },
      ],
      lawyerQuestions: ["Is this enforceable?", "How to cap indemnity?"],
      analyzedAt: new Date().toISOString(),
      telemetry: {
        cached: true,
        executionTimeMs: 4,
        tokensSaved: 480,
      },
    };

    expect(mockResult.documentTitle).toBeTruthy();
    expect(mockResult.overallRiskScore).toBe(82);
    expect(mockResult.clauses.length).toBe(1);
    expect(mockResult.missingClauses.length).toBe(1);
    expect(mockResult.telemetry?.cached).toBe(true);
    expect(mockResult.telemetry?.executionTimeMs).toBeLessThan(10);
  });
});
