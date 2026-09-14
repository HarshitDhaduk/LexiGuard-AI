"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import DocumentInput from "@/components/DocumentInput";
import RiskHeatmap from "@/components/RiskHeatmap";
import GroundedChat from "@/components/GroundedChat";
import RedlineCompare from "@/components/RedlineCompare";
import NegotiationStudio from "@/components/NegotiationStudio";
import LawyerDossier from "@/components/LawyerDossier";
import { CONTRACT_PRESETS } from "@/lib/presets";
import {
  ContractAnalysisResult,
  AnalyzedClause,
  SanitizationResult,
} from "@/lib/types";
import {
  ShieldAlert,
  FileSearch,
  Sparkles,
  Award,
  ArrowRight,
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

  const handleSelectClauseForNegotiation = (clause: AnalyzedClause) => {
    setSelectedClauseForNegotiation(clause);
    setActiveTab("negotiate");
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
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero Section */}
        <section aria-label="Platform Overview" className="bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-purple-950/30 border border-gray-800/80 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PromptWars Exclusive Edition • Legal Access Track</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Level the Playing Field Against Incomprehensible Contracts
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2.5 leading-relaxed">
              Legal documents are designed to be asymmetrical. <strong>LexiGuard AI</strong> empowers freelancers, tenants, and small business owners to deconstruct legalese, uncover hidden risks and omitted clauses, simulate real-world outcomes, and generate balanced counter-proposals in seconds.
            </p>
          </div>
        </section>

        {/* Ingestion & PII Redaction Input Area */}
        <DocumentInput
          rawText={rawText}
          setRawText={setRawText}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
        />

        {/* Tab Content Display Area */}
        <section className="space-y-6">
          {activeTab === "audit" && (
            <>
              {analysis ? (
                <RiskHeatmap
                  analysis={analysis}
                  onSelectForNegotiation={handleSelectClauseForNegotiation}
                />
              ) : (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-12 text-center space-y-3">
                  <FileSearch className="w-12 h-12 text-gray-600 mx-auto" />
                  <h3 className="text-base font-bold text-gray-300">
                    No Document Audited Yet
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Click <strong>&ldquo;Audit &amp; Deconstruct Contract&rdquo;</strong> above to initiate Gemini 2.5 Flash clause decomposition, 3D risk rating, and omission scanning.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "qa" && (
            <GroundedChat contractText={rawText} />
          )}

          {activeTab === "compare" && (
            <RedlineCompare />
          )}

          {activeTab === "negotiate" && (
            <NegotiationStudio
              availableClauses={analysis?.clauses || []}
              selectedClauseForEdit={selectedClauseForNegotiation}
            />
          )}

          {activeTab === "dossier" && analysis && (
            <LawyerDossier analysis={analysis} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-800/80 bg-gray-950/80 py-6 text-xs text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            LexiGuard AI • Built with <strong>Google Gemini 2.5 Flash</strong> for the PromptWars: Virtual (Exclusive Edition).
          </p>
          <p className="text-[11px] text-gray-600">
            Strict repository size guard &lt; 10 MB • Single `main` branch • Client-Side PII privacy shield • Educational legal navigation.
          </p>
        </div>
      </footer>
    </div>
  );
}
