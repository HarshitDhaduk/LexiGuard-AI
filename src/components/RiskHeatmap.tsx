"use client";

import React, { useState } from "react";
import {
  ContractAnalysisResult,
  RiskLevel,
  AnalyzedClause,
} from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Layers,
  FileWarning,
  Sparkles,
} from "lucide-react";
import TelemetryPill from "./TelemetryPill";

interface RiskHeatmapProps {
  analysis: ContractAnalysisResult;
  onSelectForNegotiation: (clause: AnalyzedClause) => void;
}

export default function RiskHeatmap({
  analysis,
  onSelectForNegotiation,
}: RiskHeatmapProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(
    analysis.clauses[0]?.id || null
  );

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "Critical":
        return {
          bg: "bg-rose-950/40",
          border: "border-rose-800/80",
          badge: "bg-rose-900/60 text-rose-300 border-rose-700/60",
          text: "text-rose-400",
          ring: "ring-rose-500/20",
        };
      case "High":
        return {
          bg: "bg-amber-950/40",
          border: "border-amber-800/80",
          badge: "bg-amber-900/60 text-amber-300 border-amber-700/60",
          text: "text-amber-400",
          ring: "ring-amber-500/20",
        };
      case "Medium":
        return {
          bg: "bg-yellow-950/30",
          border: "border-yellow-800/70",
          badge: "bg-yellow-900/50 text-yellow-300 border-yellow-700/50",
          text: "text-yellow-400",
          ring: "ring-yellow-500/20",
        };
      default:
        return {
          bg: "bg-emerald-950/30",
          border: "border-emerald-800/70",
          badge: "bg-emerald-900/50 text-emerald-300 border-emerald-700/50",
          text: "text-emerald-400",
          ring: "ring-emerald-500/20",
        };
    }
  };

  const filteredClauses = analysis.clauses.filter((clause) => {
    if (selectedFilter === "ALL") return true;
    return clause.riskLevel.toUpperCase() === selectedFilter;
  });

  const criticalCount = analysis.clauses.filter(
    (c) => c.riskLevel === "Critical"
  ).length;
  const highCount = analysis.clauses.filter((c) => c.riskLevel === "High").length;
  const mediumCount = analysis.clauses.filter(
    (c) => c.riskLevel === "Medium"
  ).length;
  const safeCount = analysis.clauses.filter((c) => c.riskLevel === "Safe").length;

  return (
    <div className="space-y-6">
      {/* Top Executive Overview & Score Banner */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Score & Gauge */}
          <div className="flex items-center space-x-5">
            <div className="relative flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-gray-950 border border-gray-800 shadow-inner">
              <div className="text-center">
                <div
                  className={`text-3xl font-black font-mono ${
                    analysis.overallRiskScore >= 75
                      ? "text-rose-500"
                      : analysis.overallRiskScore >= 55
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {analysis.overallRiskScore}
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Risk Score
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {analysis.documentTitle || "Contract Analysis"}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    analysis.overallRiskRating === "Critical"
                      ? "bg-rose-950 text-rose-300 border-rose-800"
                      : analysis.overallRiskRating === "High"
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-emerald-950 text-emerald-300 border-emerald-800"
                  }`}
                >
                  {analysis.overallRiskRating} Risk Level
                </span>
                {analysis.telemetry && (
                  <TelemetryPill
                    cached={analysis.telemetry.cached}
                    executionTimeMs={analysis.telemetry.executionTimeMs}
                    tokensSaved={analysis.telemetry.tokensSaved}
                  />
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Classified as <strong>{analysis.contractType}</strong> • Identified parties:{" "}
                <span className="text-gray-300 font-mono">
                  {analysis.keyParties.join(", ")}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed max-w-3xl">
                {analysis.executiveSummary}
              </p>
            </div>
          </div>

          {/* Severity Quick Tally */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2 flex-shrink-0">
            <div className="bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-lg text-center">
              <div className="text-rose-400 font-bold text-lg font-mono">
                {criticalCount}
              </div>
              <div className="text-[10px] uppercase text-rose-300/80 font-medium">
                Critical
              </div>
            </div>
            <div className="bg-amber-950/40 border border-amber-900/50 p-2.5 rounded-lg text-center">
              <div className="text-amber-400 font-bold text-lg font-mono">
                {highCount}
              </div>
              <div className="text-[10px] uppercase text-amber-300/80 font-medium">
                High Risk
              </div>
            </div>
            <div className="bg-yellow-950/40 border border-yellow-900/50 p-2.5 rounded-lg text-center">
              <div className="text-yellow-400 font-bold text-lg font-mono">
                {mediumCount}
              </div>
              <div className="text-[10px] uppercase text-yellow-300/80 font-medium">
                Medium
              </div>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-900/50 p-2.5 rounded-lg text-center">
              <div className="text-emerald-400 font-bold text-lg font-mono">
                {safeCount}
              </div>
              <div className="text-[10px] uppercase text-emerald-300/80 font-medium">
                Safe
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Clauses Omission Radar (Differentiator Feature) */}
      {analysis.missingClauses && analysis.missingClauses.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/40 to-orange-950/30 border border-amber-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2.5 text-amber-400 mb-2">
            <FileWarning className="w-5 h-5 flex-shrink-0" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Omission Radar: Vital Missing Protections Detected ({analysis.missingClauses.length})
            </h3>
          </div>
          <p className="text-xs text-amber-200/90 mb-3">
            Predatory agreements harm you not just through what they write, but through <strong>crucial protective terms deliberately omitted</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.missingClauses.map((missing) => (
              <div
                key={missing.id}
                className="bg-gray-950/80 border border-amber-900/60 rounded-lg p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    {missing.clauseName}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-900/60 text-amber-300 border border-amber-700/60">
                    {missing.importance} Priority
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                  <strong className="text-gray-400">Why You Need It:</strong> {missing.whyNeeded}
                </p>
                <div className="mt-2.5 p-2 bg-gray-900 rounded border border-gray-800 text-[11px] font-mono text-emerald-300/90">
                  <span className="text-gray-500 select-none block mb-0.5">Recommended Addition to Request:</span>
                  &ldquo;{missing.recommendedAddition}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Clause Breakdown */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Deconstructed Clauses ({filteredClauses.length})
            </h3>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500 mr-1" />
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "SAFE"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-2.5 py-1 rounded-md font-medium text-xs border transition-colors ${
                  selectedFilter === filter
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Clause Cards */}
        <div className="space-y-3">
          {filteredClauses.map((clause) => {
            const colors = getRiskColor(clause.riskLevel);
            const isExpanded = expandedClauseId === clause.id;

            return (
              <div
                key={clause.id}
                className={`border rounded-xl transition-all duration-200 ${colors.border} ${colors.bg} ${
                  isExpanded ? "ring-1 " + colors.ring : ""
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() =>
                    setExpandedClauseId(isExpanded ? null : clause.id)
                  }
                  className="p-4 cursor-pointer flex items-start sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div className={`mt-0.5 sm:mt-0 ${colors.text}`}>
                      {clause.riskLevel === "Critical" ? (
                        <AlertOctagon className="w-5 h-5" />
                      ) : clause.riskLevel === "High" ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : clause.riskLevel === "Medium" ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-gray-400">
                          {clause.clauseNumber}
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {clause.title}
                        </h4>
                        <span className="text-[10px] bg-gray-900/80 text-gray-400 border border-gray-800 px-2 py-0.5 rounded">
                          {clause.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-shrink-0">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${colors.badge}`}
                    >
                      {clause.riskLevel} ({clause.riskScore}/100)
                    </span>
                    <button
                      type="button"
                      aria-label="Toggle clause breakdown"
                      className="text-gray-400 hover:text-white p-1 rounded"
                    >
                      {isExpanded ? "−" : "+"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-gray-800/80 space-y-3">
                    {/* Plain English Translation */}
                    <div className="bg-gray-950/80 border border-gray-800/90 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Plain English (8th-Grade Translation)</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                        {clause.plainEnglish}
                      </p>
                    </div>

                    {/* The Trap (Why this favors counterparty) */}
                    <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                        ⚠️ The Legal Trap &amp; Impact
                      </div>
                      <p className="text-xs text-rose-200/90 leading-relaxed">
                        {clause.theTrap}
                      </p>
                    </div>

                    {/* Standard Fair Benchmark */}
                    <div className="bg-gray-900/70 border border-gray-800 rounded-lg p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        ✓ Standard Commercial Benchmark
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {clause.standardBenchmark}
                      </p>
                    </div>

                    {/* Original Contract Quote */}
                    <div className="bg-gray-950 p-2.5 rounded border border-gray-800/60">
                      <span className="text-[10px] uppercase font-mono text-gray-500 block mb-1">
                        Original Document Excerpt:
                      </span>
                      <blockquote className="text-xs font-mono text-gray-400 italic border-l-2 border-gray-700 pl-2">
                        &ldquo;{clause.originalText}&rdquo;
                      </blockquote>
                    </div>

                    {/* Direct Action to Negotiation Studio */}
                    {clause.riskLevel !== "Safe" && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => onSelectForNegotiation(clause)}
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
                        >
                          <span>Draft Counter-Clause in Negotiation Studio</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
