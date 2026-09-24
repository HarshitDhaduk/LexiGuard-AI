import { describe, it, expect } from "vitest";
import {
  countSyllables,
  calculateReadability,
  compareDejargonization,
} from "../src/lib/readability";

describe("Plain English Readability & De-Jargonization Algorithm", () => {
  it("accurately counts syllables in common legal words", () => {
    expect(countSyllables("indemnify")).toBe(4);
    expect(countSyllables("agreement")).toBe(3);
    expect(countSyllables("law")).toBe(1);
    expect(countSyllables("consequential")).toBe(4);
    expect(countSyllables("liability")).toBe(4);
  });

  it("calculates high difficulty for dense legal clauses", () => {
    const legalText =
      "Contractor agrees to defend, indemnify, and hold harmless Client, its parent companies, affiliates, officers, directors, and agents against any and all claims, damages, liabilities, losses, costs, and legal expenses arising directly or indirectly from Contractor services, regardless of whether caused by negligence.";
    const metrics = calculateReadability(legalText);

    expect(metrics.gradeLevel).toBeGreaterThanOrEqual(14);
    expect(metrics.readingEase).toBeLessThan(45);
    expect(metrics.difficultyLabel).toContain("Legalese");
  });

  it("calculates high readability for LexiGuard plain English translation", () => {
    const plainText =
      "You have to pay for all client losses and lawyer bills if anyone sues them. This applies even if it was not your fault. There is no limit to what you might have to pay.";
    const metrics = calculateReadability(plainText);

    expect(metrics.gradeLevel).toBeLessThanOrEqual(8);
    expect(metrics.readingEase).toBeGreaterThan(60);
    expect(metrics.difficultyLabel).toContain("Plain English");
  });

  it("computes comparative clarity improvement delta", () => {
    const original =
      "In no event shall Client be liable to Contractor for any indirect, incidental, special, or consequential damages. Client maximum cumulative liability for any breach under this Agreement shall not exceed the sum of one hundred dollars.";
    const simplified =
      "The client caps their maximum liability to only $100. If they break the contract or harm your business, you cannot recover your lost income.";

    const comp = compareDejargonization(original, simplified);

    expect(comp.gradeReduction).toBeGreaterThan(3);
    expect(comp.clarityImprovementPercent).toBeGreaterThan(20);
    expect(comp.summaryText).toContain("Reduced reading difficulty");
  });

  it("gracefully handles empty or edge case inputs", () => {
    const emptyMetrics = calculateReadability("");
    expect(emptyMetrics.wordCount).toBe(0);
    expect(emptyMetrics.gradeLevel).toBe(0);
  });
});
