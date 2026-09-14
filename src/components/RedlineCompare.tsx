"use client";

import React, { useState } from "react";
import { RedlineDiffResult } from "@/lib/types";
import { CONTRACT_PRESETS } from "@/lib/presets";
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export default function RedlineCompare() {
  const freelancePreset = CONTRACT_PRESETS[0];

  const [docA, setDocA] = useState(freelancePreset.comparableText || "");
  const [docB, setDocB] = useState(freelancePreset.rawText || "");
  const [isLoading, setIsLoading] = useState(false);
  const [diffResult, setDiffResult] = useState<RedlineDiffResult | null>(null);

  const handleLoadPreset = () => {
    setDocA(freelancePreset.comparableText || "");
    setDocB(freelancePreset.rawText || "");
    setDiffResult(null);
  };

  const handleClear = () => {
    setDocA("");
    setDocB("");
    setDiffResult(null);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docA.trim() || !docB.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docA, docB }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setDiffResult(json.data);
      }
    } catch (err) {
      console.error("Comparison failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              <span>Bilateral Redline &amp; Power Shift Analyzer</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Compare two versions of an agreement (e.g. standard vs counterparty redline) to detect clause drift and shifts in legal leverage.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleLoadPreset}
              className="px-2.5 py-1 text-xs bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 hover:bg-indigo-900/60 rounded-md transition-colors"
            >
              Load Standard vs Predatory Sample
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
              title="Clear"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleCompare} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doc A */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                <span>Version A: Standard / Equitable Baseline</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {docA.length} chars
                </span>
              </label>
              <textarea
                value={docA}
                onChange={(e) => setDocA(e.target.value)}
                placeholder="Paste original contract or your standard baseline terms..."
                rows={9}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Doc B */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                <span>Version B: Counterparty Proposed Redline</span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {docB.length} chars
                </span>
              </label>
              <textarea
                value={docB}
                onChange={(e) => setDocB(e.target.value)}
                placeholder="Paste client or vendor proposed draft with modified terms..."
                rows={9}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-xs font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !docA.trim() || !docB.trim()}
              className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
                isLoading || !docA.trim() || !docB.trim()
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Computing Semantic Redline with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Compare &amp; Score Power Shift</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Results */}
      {diffResult && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
          {/* Power Shift Gauge & Summary */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">
                    Power Balance Shift Analysis
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl">
                  {diffResult.powerShiftSummary}
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-gray-900 border border-gray-800 p-3 rounded-lg flex-shrink-0">
                <div className="text-center">
                  <div className="text-xl font-bold font-mono text-indigo-400">
                    {diffResult.overallSimilarityPercentage}%
                  </div>
                  <div className="text-[10px] uppercase text-gray-400">Similarity</div>
                </div>
                <div className="h-8 w-px bg-gray-800" />
                <div className="text-center">
                  <div
                    className={`text-xl font-bold font-mono ${
                      diffResult.powerShiftScore > 20
                        ? "text-rose-400"
                        : diffResult.powerShiftScore < -20
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {diffResult.powerShiftScore > 0 ? `+${diffResult.powerShiftScore}%` : `${diffResult.powerShiftScore}%`}
                  </div>
                  <div className="text-[10px] uppercase text-gray-400">Leverage Shift</div>
                </div>
              </div>
            </div>

            {/* Key Changes Bullet List */}
            {diffResult.summaryOfKeyChanges && diffResult.summaryOfKeyChanges.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block mb-2">
                  Key Legal Deviations:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {diffResult.summaryOfKeyChanges.map((change, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Clause-by-Clause Variance Cards */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Clause-by-Clause Variances ({diffResult.differences.length})
            </h4>

            <div className="space-y-3">
              {diffResult.differences.map((diff, i) => (
                <div
                  key={i}
                  className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">
                        {diff.clauseTitle}
                      </span>
                      <span className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-1.5 py-0.5 rounded">
                        {diff.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          diff.changeType === "Added"
                            ? "bg-blue-950 text-blue-300 border-blue-800"
                            : diff.changeType === "Removed"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-amber-950 text-amber-300 border-amber-800"
                        }`}
                      >
                        {diff.changeType}
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          diff.shiftDirection === "Favors Counterparty"
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : diff.shiftDirection === "Favors You"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-gray-800 text-gray-300 border-gray-700"
                        }`}
                      >
                        {diff.shiftDirection}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300">
                    <strong className="text-gray-400">Impact:</strong> {diff.impactSummary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-gray-900 p-2.5 rounded border border-gray-800 text-gray-400">
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">
                        Doc A (Baseline):
                      </span>
                      {diff.docAContent || "— (Clause absent in baseline)"}
                    </div>
                    <div className="bg-gray-900 p-2.5 rounded border border-gray-800 text-indigo-300">
                      <span className="text-[10px] text-indigo-400 uppercase block mb-1">
                        Doc B (Proposed):
                      </span>
                      {diff.docBContent || "— (Clause omitted in proposed draft)"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
