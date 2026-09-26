"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Cpu,
  FileWarning,
  BarChart3,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface AnalysisStepperProps {
  isLoading: boolean;
  documentTitle?: string;
  piiRedactionsCount?: number;
}

interface Step {
  id: number;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Client-Side Privacy Shield",
    detail: "Masking names, compensation rates, and contact info in your browser",
    icon: ShieldCheck,
  },
  {
    id: 2,
    label: "Gemini 2.5 Flash Deconstruction",
    detail: "Classifying clauses into liability, indemnity, and termination domains",
    icon: Cpu,
  },
  {
    id: 3,
    label: "Omission Radar Scan",
    detail: "Checking for vital missing protections (cure windows, audit limits)",
    icon: FileWarning,
  },
  {
    id: 4,
    label: "Readability & Risk Scoring",
    detail: "Computing Flesch-Kincaid clarity gains and 0–100 severity metrics",
    icon: BarChart3,
  },
];

export default function AnalysisStepper({
  isLoading,
  documentTitle = "Legal Contract",
  piiRedactionsCount = 0,
}: AnalysisStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(1);
      return;
    }

    // Progress smoothly through the stages while waiting for the LLM response
    const t1 = setTimeout(() => setCurrentStep(2), 700);
    const t2 = setTimeout(() => setCurrentStep(3), 2200);
    const t3 = setTimeout(() => setCurrentStep(4), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-gray-900/95 border border-blue-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto my-6 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Multi-Stage Intelligence Pipeline</span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Auditing &ldquo;{documentTitle}&rdquo;
        </h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Gemini 2.5 Flash is actively deconstructing legal terms while maintaining strict zero-leakage privacy.
        </p>
      </div>

      {/* 4-Stage Stepper Cards */}
      <div className="space-y-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center space-x-3.5 ${
                isActive
                  ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                  : isDone
                  ? "bg-emerald-950/20 border-emerald-800/40 text-gray-300"
                  : "bg-gray-950/50 border-gray-800/60 text-gray-500 opacity-60"
              }`}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : isDone
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-gray-900 text-gray-500"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isActive
                        ? "text-blue-200"
                        : isDone
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <span className="text-[10px] font-mono">
                    {isDone ? (
                      <span className="text-emerald-400">Completed ✓</span>
                    ) : isActive ? (
                      <span className="text-blue-400">Analyzing...</span>
                    ) : (
                      <span className="text-gray-500">Queued</span>
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {step.id === 1 && piiRedactionsCount > 0
                    ? `Sanitized ${piiRedactionsCount} PII entities locally`
                    : step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-[11px] text-gray-400 font-mono">
        Average analysis time: 2.5s • Strict Non-Advisory Guardrails
      </div>
    </div>
  );
}
