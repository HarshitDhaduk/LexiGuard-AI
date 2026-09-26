"use client";

import React from "react";
import {
  Sparkles,
  Shield,
  Search,
  MessageSquareQuote,
  FileEdit,
  ArrowRight,
  Briefcase,
  Home,
  Cloud,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { CONTRACT_PRESETS } from "@/lib/presets";

interface LandingHeroProps {
  onSelectPresetAndAudit: (presetId: string) => void;
  onScrollToInput: () => void;
}

export default function LandingHero({
  onSelectPresetAndAudit,
  onScrollToInput,
}: LandingHeroProps) {
  return (
    <div className="space-y-10 py-2">
      {/* Main Hero Banner */}
      <section aria-label="Platform Hero" className="relative overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-b from-blue-950/40 via-gray-900 to-gray-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI for Legal Assistance &amp; Access • PromptWars Exclusive Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Stop Signing Contracts You Don&apos;t Understand.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Over 85% of people sign binding legal agreements with hidden risks, uncapped liabilities, and predatory terms. <strong>LexiGuard AI</strong> deconstructs complex legalese into 8th-grade plain English, flags what the drafter intentionally omitted, simulates real-world &ldquo;What-If&rdquo; scenarios, and drafts balanced counter-clauses in seconds.
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToInput}
              className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-2.5 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Upload Your Contract (PDF / DOCX / Text)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectPresetAndAudit("freelance-predatory-msa")}
              className="px-5 py-3.5 rounded-xl text-xs sm:text-sm font-semibold bg-gray-800/90 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center space-x-2 transition-all hover:border-gray-600"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try 1-Click Interactive Demo</span>
            </button>
          </div>

          {/* Security & File Reassurance Badges */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 text-cyan-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>In-Browser PII Masking (Zero Unmasked Data to LLMs)</span>
            </span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="flex items-center space-x-1.5 text-blue-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Supports PDF, Word DOCX &amp; TXT</span>
            </span>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Educational &amp; Negotiation Guide</span>
            </span>
          </div>
        </div>
      </section>

      {/* 4 Architectural Capabilities */}
      <section aria-label="Core Capabilities" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2 hover:border-blue-700/60 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
            <FileEdit className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Universal File Ingestion</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Drag-and-drop your actual PDF, DOCX, or Markdown contracts. High-speed parser extracts raw text with zero bloat.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2 hover:border-cyan-700/60 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Client-Side Privacy Vault</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Names, compensation rates, emails, and phone numbers are automatically redacted locally in your browser before dispatch.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2 hover:border-indigo-700/60 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
            <Search className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Risk &amp; Omission Radar</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Gemini 2.5 Flash scores risk (0–100), clarifies legalese to 8th-grade English, and uncovers unwritten traps.
          </p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 space-y-2 hover:border-purple-700/60 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Negotiation Studio</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Generate balanced counter-clauses with respectful email pitches, and export a 1-page Lawyer Briefing Dossier.
          </p>
        </div>
      </section>

      {/* Quick Demo Contract Launchers */}
      <section aria-label="Demo Samples" className="bg-gray-900/50 border border-gray-800/80 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">No contract on hand?</span>
            <h3 className="text-sm font-bold text-white">Explore real-world predatory contract samples:</h3>
          </div>
          <span className="text-[11px] text-gray-400">1-click automated audit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSelectPresetAndAudit("freelance-predatory-msa")}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-rose-700/80 text-left transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300">Freelance MSA</div>
                <div className="text-[10px] text-gray-400">Uncapped liability, Net-90</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Risk 78
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPresetAndAudit("residential-lease-harsh")}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-amber-700/80 text-left transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Residential Lease</div>
                <div className="text-[10px] text-gray-400">No notice entry, deposit trap</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Risk 74
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPresetAndAudit("saas-terms-invasive")}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-950 border border-gray-800 hover:border-yellow-700/80 text-left transition-all group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-yellow-950/60 border border-yellow-800/60 text-yellow-400">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-yellow-300">SaaS Terms of Service</div>
                <div className="text-[10px] text-gray-400">Perpetual IP training rights</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
              Risk 64
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
