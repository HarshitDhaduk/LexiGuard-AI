import { describe, it, expect } from "vitest";
import { analyzeContractWithGemini, compareContractsWithGemini, generateCounterClauseWithGemini } from "../src/lib/gemini";

describe("Gemini Orchestration & Heuristic Fallback", () => {
  it("generates a complete analysis result for freelance contracts", async () => {
    const sample = "This Master Services Agreement is entered into by Client and Contractor for software consulting.";
    const result = await analyzeContractWithGemini(sample);

    expect(result).toBeDefined();
    expect(result.overallRiskScore).toBeGreaterThanOrEqual(0);
    expect(result.overallRiskScore).toBeLessThanOrEqual(100);
    expect(result.clauses.length).toBeGreaterThan(0);
    expect(result.missingClauses.length).toBeGreaterThan(0);
    expect(result.deadlines.length).toBeGreaterThan(0);
    expect(result.lawyerQuestions.length).toBeGreaterThanOrEqual(3);

    // Verify clause schema
    const firstClause = result.clauses[0];
    expect(firstClause.title).toBeTruthy();
    expect(firstClause.plainEnglish).toBeTruthy();
    expect(firstClause.theTrap).toBeTruthy();
    expect(firstClause.riskLevel).toBeTruthy();
  });

  it("generates a bilateral comparison result", async () => {
    const docA = "Original terms: mutual indemnity capped at $10,000.";
    const docB = "Modified terms: unilateral uncapped indemnity.";
    const result = await compareContractsWithGemini(docA, docB);

    expect(result).toBeDefined();
    expect(result.overallSimilarityPercentage).toBeGreaterThan(0);
    expect(result.powerShiftScore).toBeDefined();
    expect(result.differences.length).toBeGreaterThan(0);
  });

  it("generates a structured counter-clause proposal", async () => {
    const title = "Unilateral Indemnity";
    const snippet = "Contractor indemnifies Client without limitation.";
    const proposal = await generateCounterClauseWithGemini(title, snippet, "Balanced");

    expect(proposal).toBeDefined();
    expect(proposal.proposedClause).toBeTruthy();
    expect(proposal.legalRationale).toBeTruthy();
    expect(proposal.diplomaticEmailDraft).toContain("Best regards");
  });
});
