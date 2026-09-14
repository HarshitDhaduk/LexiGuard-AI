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
              onClick={() => onSelectPresetAndAudit("freelance-predatory-msa")}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-2 shadow-lg shadow-blue-600/25 transition-all"
            >
              <span>Explore 1-Click Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onScrollToInput}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-gray-800/80 hover:bg-gray-700/90 text-gray-200 border border-gray-700 flex items-center space-x-2 transition-all"
            >
              <span>Paste Custom Contract</span>
            </button>
          </div>

          {/* Security & Non-Advisory Reassurance Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Client-Side PII Shield (Zero Unmasked Data to LLMs)</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center space-x-1.5 text-amber-400">
              <CheckCircle className="w-4 h-4" />
              <span>Strict Educational &amp; Navigational Boundary</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3-Step Guided Journey */}
      <section aria-label="3-Step Guided Workflow" className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">
            How It Works
          </h2>
          <h3 className="text-xl font-bold text-white">
            Your 3-Step Legal Navigation Workflow
          </h3>
          <p className="text-xs text-gray-400">
            Intuitive, safe, and transparent from ingestion to negotiation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 space-y-3 relative hover:border-blue-800/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400 font-bold text-sm">
              01
            </div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Ingest &amp; Anonymize</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Paste your agreement or pick a real-world sample. Our <strong>Client-Side Privacy Vault</strong> automatically masks names, compensation, and contact info in your browser before analysis.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 space-y-3 relative hover:border-blue-800/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
              02
            </div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Risk Audit &amp; Omission Radar</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Gemini 2.5 Flash</strong> breaks down clauses, rates risks (0–100), translates legalese into 8th-grade English, and uncovers <strong>crucial protective clauses the drafter omitted</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 space-y-3 relative hover:border-blue-800/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 font-bold text-sm">
              03
            </div>
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileEdit className="w-4 h-4 text-purple-400" />
              <span>Simulate &amp; Negotiate</span>
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ask grounded &ldquo;What-If&rdquo; questions with section citations. Draft market-standard replacement clauses with polite email pitches, and export a 1-page Lawyer Briefing Dossier.
            </p>
          </div>
        </div>
      </section>

      {/* Select Persona / Test Samples */}
      <section aria-label="Interactive Demo Persona Cards" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              Choose Your Vertical or Contract Type
            </h3>
            <p className="text-xs text-gray-400">
              Click any persona card below to instantly load and audit a real-world contract fixture:
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-full self-start sm:self-auto">
            1-Click Live Demonstration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Freelancer */}
          <div
            onClick={() => onSelectPresetAndAudit("freelance-predatory-msa")}
            className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-rose-700/80 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-rose-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-rose-950/60 text-rose-400 border border-rose-800/60 rounded-xl group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                Risk: 78/100 (High)
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                Freelancer / Independent Contractor
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Predatory Client Master Services Agreement (MSA)
              </p>
            </div>

            <ul className="text-xs text-gray-400 space-y-1 pt-1 border-t border-gray-800/80">
              <li className="flex items-center space-x-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Uncapped unilateral indemnity</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Universal IP lockup of personal tools</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>Net-90 payment with 0% late interest</span>
              </li>
            </ul>

            <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Test This Contract</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Tenant */}
          <div
            onClick={() => onSelectPresetAndAudit("residential-lease-harsh")}
            className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-amber-700/80 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-amber-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-950/60 text-amber-400 border border-amber-800/60 rounded-xl group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Risk: 74/100 (High)
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Tenant / Apartment Renter
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Aggressive Residential Lease Agreement
              </p>
            </div>

            <ul className="text-xs text-gray-400 space-y-1 pt-1 border-t border-gray-800/80">
              <li className="flex items-center space-x-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Zero-advance-notice landlord entry</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Automatic security deposit forfeiture</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Shifts repair costs under $1k to tenant</span>
              </li>
            </ul>

            <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Test This Lease</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: SaaS Terms */}
          <div
            onClick={() => onSelectPresetAndAudit("saas-terms-invasive")}
            className="group cursor-pointer bg-gray-900 border border-gray-800 hover:border-yellow-700/80 rounded-2xl p-5 space-y-3 transition-all hover:shadow-xl hover:shadow-yellow-950/20"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-yellow-950/60 text-yellow-400 border border-yellow-800/60 rounded-xl group-hover:scale-105 transition-transform">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
                Risk: 64/100 (Med)
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-yellow-300 transition-colors">
                Digital Consumer / Small Business
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Invasive AI Suite Terms of Service
              </p>
            </div>

            <ul className="text-xs text-gray-400 space-y-1 pt-1 border-t border-gray-800/80">
              <li className="flex items-center space-x-1.5">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Perpetual AI model training on user IP</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Unilateral price increases (3-day notice)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-yellow-400 font-bold">•</span>
                <span>Class action waiver &amp; fee shifting</span>
              </li>
            </ul>

            <div className="pt-2 text-xs font-semibold text-blue-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
              <span>Test These Terms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
