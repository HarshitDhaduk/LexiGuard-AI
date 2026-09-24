"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Scale,
  GitCompare,
  MessageSquareQuote,
  FilePen,
  Briefcase,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset?: (presetIndex: number) => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onSelectPreset,
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to LexiGuard AI",
      subtitle: "Your intelligent legal assistant and contract navigation copilot.",
      icon: <Scale className="w-8 h-8 text-blue-400" />,
      content:
        "LexiGuard AI bridges the legal access gap for freelancers, tenants, and small business owners. Before signing any contract, LexiGuard de-jargonizes the text, flags predatory clauses, tests 'What-If' scenarios, and generates fair counter-clauses.",
      highlight: "Strictly educational & informational assistance — not a replacement for a licensed lawyer.",
    },
    {
      title: "Step 1: Client-Side Privacy Vault",
      subtitle: "Zero unmasked PII ever leaves your browser.",
      icon: <ShieldCheck className="w-8 h-8 text-cyan-400" />,
      content:
        "Our in-browser Privacy Vault automatically masks personal identifiers (emails, phone numbers, addresses, monetary values, and Luhn-validated credit cards) before sending data to Gemini. Original names are rehydrated on your screen for readability.",
      highlight: "Protected with Luhn-checked CC, IBAN, and SSN masking.",
    },
    {
      title: "Step 2: Risk Heatmap & Omission Radar",
      subtitle: "See predatory terms and intentionally missing protections.",
      icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
      content:
        "Gemini 2.5 Flash breaks agreements into discrete clauses, rates risk on a 0–100 scale, exposes 'The Trap' hidden in ambiguous phrasing, and reveals crucial terms the drafter omitted (e.g. no cure period, no client late fee).",
      highlight: "Translates legal jargon to an 8th-grade reading level.",
    },
    {
      title: "Step 3: Grounded What-If Simulator",
      subtitle: "Ask questions with verifiable clause citations.",
      icon: <MessageSquareQuote className="w-8 h-8 text-purple-400" />,
      content:
        "Ask real-world questions like 'What if the client delays payment past Net 90?' or 'Can my landlord enter without 24 hours notice?' The AI streams answers in real time, strictly citing verifiable sections of your contract.",
      highlight: "Real-time SSE token streaming with section citations.",
    },
    {
      title: "Step 4: Negotiation Studio & Lawyer Dossier",
      subtitle: "Empower yourself to push back with balanced wording.",
      icon: <FilePen className="w-8 h-8 text-emerald-400" />,
      content:
        "Select any harsh clause and generate a balanced, market-standard counter-clause with a ready-to-copy polite negotiation email. Export a 1-page Lawyer Briefing Dossier to save hundreds of dollars in legal billables.",
      highlight: "1-Click copy of counter-proposals and negotiation emails.",
    },
  ];

  const current = steps[step];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-gray-900 border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Tour"
          className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center space-x-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-blue-500" : "w-2 bg-gray-800"
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-gray-500 ml-2">
            Step {step + 1} of {steps.length}
          </span>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800">
              {current.icon}
            </div>
            <div>
              <h2 id="onboarding-modal-title" className="text-lg sm:text-xl font-bold text-white">
                {current.title}
              </h2>
              <p className="text-xs text-blue-400 mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{current.content}</p>

          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-center space-x-2.5 text-xs text-blue-300">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{current.highlight}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`px-3 py-2 text-xs rounded-xl flex items-center space-x-1.5 font-medium transition-all ${
              step === 0
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onSelectPreset) onSelectPreset(0);
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <span>Get Started Now</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
