"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import LandingHero from "@/components/LandingHero";
import DocumentInput from "@/components/DocumentInput";
import RiskHeatmap from "@/components/RiskHeatmap";
import GroundedChat from "@/components/GroundedChat";
import RedlineCompare from "@/components/RedlineCompare";
import NegotiationStudio from "@/components/NegotiationStudio";
import LawyerDossier from "@/components/LawyerDossier";
import { CONTRACT_PRESETS } from "@/lib/presets";
import { sanitizeContractText } from "@/lib/pii";
import {
  ContractAnalysisResult,
  AnalyzedClause,
  SanitizationResult,
} from "@/lib/types";
import {
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [rawText, setRawText] = useState(CONTRACT_PRESETS[0].rawText);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(
    CONTRACT_PRESETS[0].id
  );
  const [analysis, setAnalysis] = useState<ContractAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("audit");
  const [selectedClauseForNegotiation, setSelectedClauseForNegotiation] =
    useState<AnalyzedClause | null>(null);
  const [sanitizationInfo, setSanitizationInfo] =
    useState<SanitizationResult | null>(null);

  const handleAnalyze = async (
    payloadText: string,
    sanitizationResult: SanitizationResult
  ) => {
    setIsLoading(true);
    setSanitizationInfo(sanitizationResult);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: payloadText }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysis(json.data);
        setActiveTab("audit");
        // Scroll smoothly to the results workbench
        setTimeout(() => {
          document
            .getElementById("analysis-workbench")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        alert(json.error || "Analysis failed. Please check your text.");
      }
    } catch (err) {
      console.error("Analysis request error:", err);
      alert("Network error connecting to analysis endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPresetAndAudit = (presetId: string) => {
    const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setRawText(preset.rawText);
      const res = sanitizeContractText(preset.rawText);
      handleAnalyze(res.sanitizedText, res);
    }
  };

  const handleScrollToInput = () => {
    document
      .getElementById("document-input-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectClauseForNegotiation = (clause: AnalyzedClause) => {
    setSelectedClauseForNegotiation(clause);
    setActiveTab("negotiate");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetToLanding = () => {
    setAnalysis(null);
    setActiveTab("audit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-blue-600 selection:text-white">
      {/* Persistent Legal Boundary Banner */}
      <DisclaimerBanner />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={analysis !== null}
        documentTitle={analysis?.documentTitle}
        riskScore={analysis?.overallRiskScore}
        onResetToLanding={handleResetToLanding}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Landing Page Hero & Onboarding (shown if no analysis or user wants to review) */}
        {!analysis && (
          <>
            <LandingHero
              onSelectPresetAndAudit={handleSelectPresetAndAudit}
              onScrollToInput={handleScrollToInput}
            />

            {/* Ingestion & PII Redaction Input Area */}
            <DocumentInput
              rawText={rawText}
              setRawText={setRawText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              selectedPresetId={selectedPresetId}
              setSelectedPresetId={setSelectedPresetId}
            />
          </>
        )}

        {/* Active Analysis Workbench View */}
        {analysis && (
          <div id="analysis-workbench" className="space-y-6">
            {/* Workbench Header Status Bar */}
            <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">
                      {analysis.documentTitle}
                    </h2>
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                      {analysis.contractType}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Deconstructed by <strong>Gemini 2.5 Flash</strong> • {analysis.clauses.length} clauses analyzed
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <button
                  onClick={handleResetToLanding}
                  className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center space-x-1.5 transition-colors border border-gray-700"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Audit Another Contract</span>
                </button>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === "audit" && (
              <RiskHeatmap
                analysis={analysis}
                onSelectForNegotiation={handleSelectClauseForNegotiation}
              />
            )}

            {activeTab === "qa" && (
              <GroundedChat contractText={rawText} />
            )}

            {activeTab === "compare" && (
              <RedlineCompare />
            )}

            {activeTab === "negotiate" && (
              <NegotiationStudio
                availableClauses={analysis.clauses}
                selectedClauseForEdit={selectedClauseForNegotiation}
              />
            )}

            {activeTab === "dossier" && (
              <LawyerDossier analysis={analysis} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800/80 bg-gray-950/90 py-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-gray-400">LexiGuard AI</div>
            <p className="text-[11px] text-gray-600">
              Built with Google Gemini 2.5 Flash for PromptWars: Virtual (Exclusive Edition).
            </p>
          </div>
          <div className="text-[11px] text-gray-500 sm:text-right space-y-0.5">
            <div>Strict repository size guard &lt; 10 MB • Single `main` branch</div>
            <div>Client-Side PII privacy shield • Educational legal navigation</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
