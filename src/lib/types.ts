/**
 * Core Domain Interfaces for LexiGuard AI
 * Strictly typed definitions for Contract Analysis, Risk Heatmaps,
 * Grounded Q&A, Redline Diffs, PII Redaction, and Negotiation Studio.
 */

export type RiskLevel = "Critical" | "High" | "Medium" | "Low" | "Safe";

export type ClauseCategory =
  | "Indemnification"
  | "Limitation of Liability"
  | "Termination & Cancellation"
  | "Intellectual Property & Work Product"
  | "Payment, Invoicing & Penalties"
  | "Non-Compete & Restrictive Covenants"
  | "Confidentiality & Data Protection"
  | "Dispute Resolution & Governing Law"
  | "Warranties & Disclaimers"
  | "General & Miscellaneous";

export interface AnalyzedClause {
  id: string;
  clauseNumber: string;
  title: string;
  category: ClauseCategory;
  originalText: string;
  plainEnglish: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 (safest) to 100 (most predatory/critical)
  theTrap: string; // Plain explanation of how this favors the drafter or harms the user
  standardBenchmark: string; // What an equitable, standard commercial clause looks like
}

export interface MissingClause {
  id: string;
  clauseName: string;
  category: ClauseCategory;
  importance: "Critical" | "High" | "Medium";
  whyNeeded: string; // Why omitting this clause leaves the user legally unprotected
  recommendedAddition: string; // Ready-to-use sample text for the user to request
}

export interface DeadlineObligation {
  id: string;
  title: string;
  timeframe: string;
  responsibleParty: string;
  consequenceOfBreach: string;
  status: "Pending" | "Completed" | "Flagged";
}

export interface ContractAnalysisResult {
  documentTitle: string;
  contractType: string;
  overallRiskScore: number; // 0 to 100
  overallRiskRating: RiskLevel;
  executiveSummary: string;
  keyParties: string[];
  clauses: AnalyzedClause[];
  missingClauses: MissingClause[];
  deadlines: DeadlineObligation[];
  lawyerQuestions: string[]; // 5 sharp questions to prepare for licensed counsel
  analyzedAt: string;
  telemetry?: {
    cached: boolean;
    executionTimeMs: number;
    tokensSaved?: number;
  };
}

export interface ClauseDiffItem {
  clauseTitle: string;
  category: ClauseCategory;
  changeType: "Added" | "Removed" | "Modified" | "Unchanged";
  docAContent: string;
  docBContent: string;
  impactSummary: string;
  shiftDirection: "Favors You" | "Favors Counterparty" | "Neutral";
}

export interface RedlineDiffResult {
  docAName: string;
  docBName: string;
  overallSimilarityPercentage: number;
  powerShiftScore: number; // -100 (heavily favors Doc A drafter) to +100 (heavily favors Doc B counterparty)
  powerShiftSummary: string;
  summaryOfKeyChanges: string[];
  differences: ClauseDiffItem[];
}

export interface CounterClauseProposal {
  clauseId: string;
  clauseTitle: string;
  originalSnippet: string;
  stance: "Balanced" | "Protective";
  proposedClause: string;
  legalRationale: string;
  diplomaticEmailDraft: string;
}

export interface CitationReference {
  clauseId?: string;
  clauseTitle: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: CitationReference[];
  timestamp: number;
}

export type RedactionType =
  | "name"
  | "email"
  | "phone"
  | "amount"
  | "address"
  | "id"
  | "other";

export interface RedactionRecord {
  id: string;
  token: string;
  original: string;
  type: RedactionType;
}

export interface SanitizationResult {
  sanitizedText: string;
  redactions: RedactionRecord[];
}
