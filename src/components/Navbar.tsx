"use client";

import React from "react";
import {
  Scale,
  ShieldCheck,
  Cpu,
  RotateCcw,
  Layers,
  MessageSquareQuote,
  GitCompare,
  FileEdit,
  Briefcase,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasAnalysis: boolean;
  documentTitle?: string;
  riskScore?: number;
  onResetToLanding: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  hasAnalysis,
  documentTitle,
  riskScore,
  onResetToLanding,
}: NavbarProps) {
  const tabs = [
    {
      id: "audit",
      step: "01",
      label: "Clause Audit & Heatmap",
      icon: Layers,
      requiresData: false,
    },
    {
      id: "qa",
      step: "02",
      label: "Grounded Q&A",
      icon: MessageSquareQuote,
      requiresData: true,
    },
    {
      id: "compare",
      step: "03",
      label: "Redline Diff",
      icon: GitCompare,
      requiresData: false,
    },
    {
      id: "negotiate",
      step: "04",
      label: "Negotiation Studio",
      icon: FileEdit,
      requiresData: false,
    },
    {
      id: "dossier",
      step: "05",
      label: "Lawyer Briefing",
      icon: Briefcase,
      requiresData: true,
    },
    {
      id: "aid",
      step: "06",
      label: "Legal Aid & Checklist",
      icon: Scale,
      requiresData: false,
    },
  ];

  return (
    <header className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between">
            <div
              onClick={onResetToLanding}
              className="flex items-center space-x-3 cursor-pointer group"
              title="Return to Home / Overview"
            >
              <div className="bg-blue-600/20 border border-blue-500/40 p-2 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                    LexiGuard AI
                  </h1>
                  <span className="text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    Legal Copilot
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 hidden sm:block">
                  Intelligent Contract Deconstruction &amp; Negotiation
                </p>
              </div>
            </div>

            {/* Mobile Reset Action */}
            {hasAnalysis && (
              <button
                onClick={onResetToLanding}
                className="md:hidden text-xs text-gray-400 hover:text-white flex items-center space-x-1 p-1.5 rounded bg-gray-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Contract</span>
              </button>
            )}
          </div>

          {/* Active Contract Status & Model Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {hasAnalysis && (
              <div className="hidden sm:flex items-center space-x-2 bg-gray-800/80 border border-gray-700/80 px-3 py-1 rounded-lg">
                <span className="text-[11px] text-gray-400">Auditing:</span>
                <span className="font-semibold text-white truncate max-w-[140px]">
                  {documentTitle || "Active Contract"}
                </span>
                {riskScore !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      riskScore >= 75
                        ? "bg-rose-950 text-rose-300 border border-rose-800"
                        : riskScore >= 50
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {riskScore}/100 Risk
                  </span>
                )}
                <button
                  onClick={onResetToLanding}
                  className="text-[11px] text-blue-400 hover:text-blue-300 ml-1 underline"
                >
                  Change
                </button>
              </div>
            )}

            <div className="flex items-center space-x-1.5 bg-blue-950/60 border border-blue-800/60 text-blue-300 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <Cpu className="w-3.5 h-3.5" />
              <span className="font-mono font-medium">Gemini 2.5 Flash</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1 bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>PII Masked</span>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs with Step Numbers */}
        <nav
          aria-label="Workspace Modules"
          className="flex space-x-1 sm:space-x-1.5 mt-3 overflow-x-auto pb-1 border-t border-gray-800/80 pt-2 text-xs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.requiresData && !hasAnalysis;

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : isDisabled
                    ? "text-gray-600 cursor-not-allowed bg-transparent"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/70"
                }`}
              >
                <span
                  className={`text-[10px] font-mono font-bold px-1 rounded ${
                    isActive
                      ? "bg-blue-800/80 text-blue-200"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {tab.step}
                </span>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
