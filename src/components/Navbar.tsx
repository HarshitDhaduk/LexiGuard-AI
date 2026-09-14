"use client";

import React from "react";
import { Scale, ShieldCheck, Cpu, HardDrive } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasAnalysis: boolean;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  hasAnalysis,
}: NavbarProps) {
  const tabs = [
    { id: "audit", label: "Clause Radar & Heatmap", requiresData: false },
    { id: "qa", label: "Grounded Q&A & Scenarios", requiresData: true },
    { id: "compare", label: "Redline Diff & Power Shift", requiresData: false },
    { id: "negotiate", label: "Negotiation Studio", requiresData: false },
    { id: "dossier", label: "Lawyer Briefing & Checklist", requiresData: true },
  ];

  return (
    <header className="bg-gray-900/90 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 border border-blue-500/30 p-2 rounded-lg flex items-center justify-center text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  LexiGuard AI
                </h1>
                <span className="text-[10px] uppercase font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                  Exclusive Edition
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Democratizing Legal Intelligence, Risk Auditing & Fair Terms
              </p>
            </div>
          </div>

          {/* Badges: Model, Security, Repo Size */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cpu className="w-3.5 h-3.5" />
              <span className="font-mono font-medium">Gemini 2.5 Flash</span>
            </div>

            <div className="flex items-center space-x-1 bg-cyan-950/50 border border-cyan-800/60 text-cyan-300 px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>PII Shield Active</span>
            </div>

            <div className="flex items-center space-x-1 bg-gray-800/60 border border-gray-700/60 text-gray-300 px-2 py-1 rounded-md text-[11px] font-mono">
              <HardDrive className="w-3 h-3 text-gray-400" />
              <span>&lt; 10 MB Git Guard</span>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <nav
          aria-label="Workspace Modules"
          className="flex space-x-1 mt-3.5 overflow-x-auto pb-1 border-t border-gray-800/80 pt-2"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.requiresData && !hasAnalysis;

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : isDisabled
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                {tab.label}
                {isDisabled && (
                  <span className="ml-1.5 text-[10px] text-gray-500 font-normal">
                    (Requires Audit)
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
