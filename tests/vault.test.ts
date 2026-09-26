import { describe, it, expect, beforeEach, vi } from "vitest";
import { saveContractToVault, StoredContractRecord } from "../src/components/ContractHistoryVault";
import { ContractAnalysisResult } from "../src/lib/types";

const mockAnalysis: ContractAnalysisResult = {
  documentTitle: "Freelance Service Agreement",
  contractType: "Independent Contractor Agreement",
  overallRiskScore: 78,
  overallRiskRating: "HIGH",
  summary: "Agreement contains high-risk unilateral indemnity and non-compete clauses.",
  clauses: [
    {
      id: "clause-1",
      title: "Indemnification",
      originalText: "Contractor agrees to indemnify client against all damages.",
      plainEnglish: "You pay for all legal costs if the client gets sued.",
      riskLevel: "CRITICAL",
      riskScore: 90,
      riskExplanation: "Uncapped unilateral indemnity.",
      recommendation: "Cap indemnity at fees paid.",
      category: "Liability",
      fleschKincaidBefore: 18.2,
      fleschKincaidAfter: 8.1,
    },
  ],
  omissions: [
    {
      id: "omission-1",
      topic: "Cure Period",
      explanation: "No notice or cure window provided before immediate termination.",
      suggestedClause: "Either party may terminate upon 14 days written notice.",
      importance: "HIGH",
    },
  ],
  keyDates: [],
  governingLaw: "California",
  parties: ["Client Corp", "Freelancer"],
};

describe("Contract History Vault (Local Storage Persistence)", () => {
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    localStorageMock = {};
    const storageMock = {
      getItem: (key: string) => localStorageMock[key] || null,
      setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
      },
      removeItem: (key: string) => {
        delete localStorageMock[key];
      },
      clear: () => {
        localStorageMock = {};
      },
    };
    vi.stubGlobal("localStorage", storageMock);
    vi.stubGlobal("window", {
      localStorage: storageMock,
    });
  });

  it("saves a new contract to the vault in localStorage", () => {
    const rawText = "This is a contract text for testing.";
    saveContractToVault("Client Agreement", rawText, mockAnalysis);

    const stored = JSON.parse(localStorageMock["lexiguard_contract_vault"] || "[]");
    expect(stored.length).toBe(1);
    expect(stored[0].title).toBe("Client Agreement");
    expect(stored[0].riskScore).toBe(78);
    expect(stored[0].riskRating).toBe("HIGH");
    expect(stored[0].rawText).toBe(rawText);
  });

  it("updates existing record when title matches (deduplication)", () => {
    saveContractToVault("Service Agreement", "Text version 1", mockAnalysis);
    expect(JSON.parse(localStorageMock["lexiguard_contract_vault"]).length).toBe(1);

    const updatedAnalysis: ContractAnalysisResult = {
      ...mockAnalysis,
      overallRiskScore: 50,
      overallRiskRating: "MEDIUM",
    };

    saveContractToVault("Service Agreement", "Text version 2 with edits", updatedAnalysis);
    const stored = JSON.parse(localStorageMock["lexiguard_contract_vault"]);
    expect(stored.length).toBe(1);
    expect(stored[0].riskScore).toBe(50);
    expect(stored[0].rawText).toBe("Text version 2 with edits");
  });

  it("caps vault storage at 10 items", () => {
    for (let i = 1; i <= 15; i++) {
      saveContractToVault(`Contract ${i}`, `Text ${i} with extra unique content padding`, mockAnalysis);
    }

    const stored: StoredContractRecord[] = JSON.parse(
      localStorageMock["lexiguard_contract_vault"] || "[]"
    );
    expect(stored.length).toBe(10);
    // Most recent contract should be at index 0
    expect(stored[0].title).toBe("Contract 15");
  });
});
