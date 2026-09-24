"use client";

import React, { useMemo } from "react";
import { compareDejargonization } from "@/lib/readability";
import { BookOpenCheck, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

interface ReadabilityMeterProps {
  originalText: string;
  simplifiedClausesText: string;
}

export default function ReadabilityMeter({
  originalText,
  simplifiedClausesText,
}: ReadabilityMeterProps) {
  const comparison = useMemo(() => {
    return compareDejargonization(originalText, simplifiedClausesText);
  }, [originalText, simplifiedClausesText]);

  const { original, simplified, clarityImprovementPercent, gradeReduction } = comparison;

  return (
    <div
      role="region"
      aria-label="De-Jargonization and Plain English Accessibility Meter"
      className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-800/40 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Plain English De-Jargonization Meter</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                +{clarityImprovementPercent}% Clarity Gain
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Measures readability via Flesch-Kincaid Grade Level formulas.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-blue-300 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/60 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Reduced by {gradeReduction} Academic Grades</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Legalese */}
        <div className="bg-gray-950/70 border border-rose-900/40 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">Original Agreement (Legalese)</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
              Grade {original.gradeLevel}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Reading Ease: {original.readingEase}/100</span>
              <span className="text-rose-400">{original.difficultyLabel}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, original.readingEase)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            Dense syntax requires legal training or attorney review to comprehend.
          </p>
        </div>

        {/* LexiGuard Plain English */}
        <div className="bg-gray-950/70 border border-emerald-900/40 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">LexiGuard Translation (Plain English)</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              Grade {simplified.gradeLevel}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Reading Ease: {simplified.readingEase}/100</span>
              <span className="text-emerald-400">{simplified.difficultyLabel}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, simplified.readingEase)}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-500">
            Accessible to anyone at standard high school / 8th-grade reading level.
          </p>
        </div>
      </div>
    </div>
  );
}
