"use client";

import React, { useState } from "react";
import { AnalyzedClause, CounterClauseProposal } from "@/lib/types";
import {
  FileEdit,
  Mail,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Scale,
} from "lucide-react";

interface NegotiationStudioProps {
  availableClauses: AnalyzedClause[];
  selectedClauseForEdit?: AnalyzedClause | null;
}

export default function NegotiationStudio({
  availableClauses,
  selectedClauseForEdit,
}: NegotiationStudioProps) {
  const [selectedClauseId, setSelectedClauseId] = useState<string>(
    selectedClauseForEdit?.id || availableClauses[0]?.id || ""
  );
  const [stance, setStance] = useState<"Balanced" | "Protective">("Balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState<CounterClauseProposal | null>(null);
  const [copiedClause, setCopiedClause] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const activeClause = availableClauses.find((c) => c.id === selectedClauseId);

  const handleGenerate = async () => {
    if (!activeClause) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clauseTitle: activeClause.title,
          originalSnippet: activeClause.originalText,
          stance,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setProposal(json.data);
      }
    } catch (err) {
      console.error("Negotiation counter-proposal error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClause = () => {
    if (!proposal?.proposedClause) return;
    navigator.clipboard.writeText(proposal.proposedClause);
    setCopiedClause(true);
    setTimeout(() => setCopiedClause(false), 2000);
  };

  const handleCopyEmail = () => {
    if (!proposal?.diplomaticEmailDraft) return;
    navigator.clipboard.writeText(proposal.diplomaticEmailDraft);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-2">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <FileEdit className="w-5 h-5 text-purple-400" />
              <span>Negotiation Studio &amp; Counter-Clause Drafter</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Transform one-sided, high-risk clauses into equitable market-standard language with tailored diplomatic emails.
            </p>
          </div>
        </div>

        {/* Clause Selector & Stance Picker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Clause Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Select High-Risk Clause to Counter:
            </label>
            <select
              value={selectedClauseId}
              onChange={(e) => {
                setSelectedClauseId(e.target.value);
                setProposal(null);
              }}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {availableClauses.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.riskLevel.toUpperCase()}] {c.clauseNumber}: {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Stance Toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Negotiation Stance:
            </label>
            <div className="flex rounded-lg border border-gray-800 bg-gray-950 p-1">
              <button
                type="button"
                onClick={() => setStance("Balanced")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  stance === "Balanced"
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Balanced
              </button>
              <button
                type="button"
                onClick={() => setStance("Protective")}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  stance === "Protective"
                    ? "bg-purple-600 text-white shadow"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Firm / Protective
              </button>
            </div>
          </div>
        </div>

        {/* Active Clause Inspection Card */}
        {activeClause && (
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">
                Current Original Snippet:
              </span>
              <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded">
                Risk: {activeClause.riskScore}/100
              </span>
            </div>
            <blockquote className="text-xs font-mono text-gray-400 italic border-l-2 border-rose-700/80 pl-2 py-0.5">
              &ldquo;{activeClause.originalText}&rdquo;
            </blockquote>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !activeClause}
            className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
              isLoading || !activeClause
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Drafting Legal Counter-Proposal...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Draft Balanced Counter-Clause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Proposal Output */}
      {proposal && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Section 1: Ready-to-use Legal Replacement Clause */}
          <div className="bg-gray-950 border border-emerald-900/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Proposed Replacement Clause ({proposal.stance} Stance)
                </h3>
              </div>
              <button
                onClick={handleCopyClause}
                className="px-2.5 py-1 text-xs bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900 rounded-md flex items-center space-x-1.5 transition-colors"
              >
                {copiedClause ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Clause</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-emerald-200/90 leading-relaxed">
              {proposal.proposedClause}
            </div>

            <div className="text-xs text-gray-300 flex items-start space-x-2 pt-1">
              <Scale className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-gray-200">Legal Rationale:</strong>{" "}
                {proposal.legalRationale}
              </div>
            </div>
          </div>

          {/* Section 2: Diplomatic Negotiation Email Pitch */}
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-purple-400">
                <Mail className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Diplomatic Counter-Offer Email Draft
                </h3>
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-2.5 py-1 text-xs bg-purple-950/60 border border-purple-800/80 text-purple-300 hover:bg-purple-900 rounded-md flex items-center space-x-1.5 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-purple-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-gray-900/80 border border-gray-800 rounded-lg p-3.5 text-xs text-gray-200 font-sans whitespace-pre-wrap leading-relaxed">
              {proposal.diplomaticEmailDraft}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
