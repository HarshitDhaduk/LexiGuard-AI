"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Highlighter,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AnalyzedClause } from "@/lib/types";

interface SplitContractReaderProps {
  contractText: string;
  clauses: AnalyzedClause[];
  activeClauseId?: string | null;
  onSelectClause: (clause: AnalyzedClause) => void;
}

export default function SplitContractReader({
  contractText,
  clauses,
  activeClauseId,
  onSelectClause,
}: SplitContractReaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const paragraphs = contractText.split(/\n\n+/).filter((p) => p.trim().length > 0);

  // Match paragraphs to clauses
  const getClauseForParagraph = (pText: string): AnalyzedClause | undefined => {
    return clauses.find((c) => {
      const snippet = c.originalText.slice(0, 40).toLowerCase();
      return pText.toLowerCase().includes(snippet);
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-400">
            <Highlighter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Interactive Contract Reader</span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-1.5 py-0.2 rounded font-mono">
                Synchronized
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Click any paragraph to reveal its risk severity and plain-English translation.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <label htmlFor="contract-search-input" className="sr-only">Search in agreement</label>
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            id="contract-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in agreement..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Paragraph Stream */}
      <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2 font-mono text-xs leading-relaxed">
        {paragraphs.map((pText, i) => {
          const matchedClause = getClauseForParagraph(pText);
          const isSelected = activeClauseId && matchedClause?.id === activeClauseId;
          const isSearchMatch =
            searchQuery.trim().length > 1 &&
            pText.toLowerCase().includes(searchQuery.toLowerCase());

          return (
            <div
              key={i}
              onClick={() => matchedClause && onSelectClause(matchedClause)}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? "bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30"
                  : matchedClause?.riskLevel === "Critical"
                  ? "bg-rose-950/20 border-rose-900/50 hover:bg-rose-950/30 cursor-pointer"
                  : matchedClause?.riskLevel === "High"
                  ? "bg-amber-950/20 border-amber-900/50 hover:bg-amber-950/30 cursor-pointer"
                  : "bg-gray-950/70 border-gray-800/80 hover:border-gray-700"
              } ${isSearchMatch ? "ring-1 ring-yellow-400/60" : ""}`}
            >
              {/* Clause Header Pill if Matched */}
              {matchedClause && (
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800/60 font-sans">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        matchedClause.riskLevel === "Critical"
                          ? "bg-rose-950 text-rose-300 border-rose-800"
                          : matchedClause.riskLevel === "High"
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {matchedClause.riskLevel} ({matchedClause.riskScore}/100)
                    </span>
                    <span className="text-xs font-bold text-gray-200">
                      {matchedClause.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-400 underline">
                    View Explanation →
                  </span>
                </div>
              )}

              <p className="text-gray-300 whitespace-pre-wrap">{pText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
