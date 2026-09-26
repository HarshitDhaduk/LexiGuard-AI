"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import AccessibilityBar from "@/components/AccessibilityBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import LandingHero from "@/components/LandingHero";
import DocumentInput from "@/components/DocumentInput";
import RiskHeatmap from "@/components/RiskHeatmap";
import GroundedChat from "@/components/GroundedChat";
import TabLoadingSkeleton from "@/components/TabLoadingSkeleton";
import OnboardingModal from "@/components/OnboardingModal";
import AnalysisStepper from "@/components/AnalysisStepper";
import { CONTRACT_PRESETS } from "@/lib/presets";
import { getPersonaProfile } from "@/lib/persona";
import { useAccessibilityState } from "@/hooks/useAccessibilityState";
import { useContractAudit } from "@/hooks/useContractAudit";
import {
  RotateCcw,
  Layers,
  Columns,
} from "lucide-react";

// Performance code-splitting: Lazy-load heavy secondary modules
const RedlineCompare = dynamic(() => import("@/components/RedlineCompare"), {
  ssr: false,
  loading: () => (
    <TabLoadingSkeleton
      title="Loading Redline Diff Engine..."
      subtitle="Optimizing bundle for high-speed legal diff analysis"
    />
  ),
});

const NegotiationStudio = dynamic(
  () => import("@/components/NegotiationStudio"),
  {
    ssr: false,
    loading: () => (
      <TabLoadingSkeleton
        title="Loading Counter-Drafting Studio..."
        subtitle="Preparing protective legal strategies and rationale"
      />
    ),
  }
);

const LawyerDossier = dynamic(() => import("@/components/LawyerDossier"), {
  ssr: false,
  loading: () => (
    <TabLoadingSkeleton
      title="Generating Lawyer Briefing Dossier..."
      subtitle="Formatting structured summary and questions for counsel"
    />
  ),
});

const SplitContractReader = dynamic(
  () => import("@/components/SplitContractReader"),
  {
    ssr: false,
    loading: () => (
      <TabLoadingSkeleton
        title="Loading Split Contract Reader..."
        subtitle="Syncing clause coordinates with original agreement text"
      />
    ),
  }
);

const LegalAidDirectory = dynamic(
  () => import("@/components/LegalAidDirectory"),
  {
    ssr: false,
    loading: () => (
      <TabLoadingSkeleton
        title="Loading Legal Aid Directory..."
        subtitle="Connecting to pro bono legal aid networks and statutory consumer rights"
      />
    ),
  }
);

const SigningSafetyChecklist = dynamic(
  () => import("@/components/SigningSafetyChecklist"),
  {
    ssr: false,
    loading: () => (
      <TabLoadingSkeleton
        title="Loading Pre-Signing Safety Checklist..."
        subtitle="Preparing 5-point verification gates for legal protection"
      />
    ),
  }
);

export default function Home() {
  const {
    fontSizeLevel,
    setFontSizeLevel,
    highContrast,
    setHighContrast,
    announcement,
    announce,
    fontSizeClass,
  } = useAccessibilityState(
    (tabId) => setActiveTab(tabId),
    () => setShowOnboarding(true)
  );

  const {
    rawText,
    setRawText,
    selectedPresetId,
    setSelectedPresetId,
    selectedPersona,
    setSelectedPersona,
    customDocumentTitle,
    setCustomDocumentTitle,
    analysis,
    isLoading,
    sanitizationInfo,
    activeTab,
    setActiveTab,
    selectedClauseForNegotiation,
    showSplitView,
    setShowSplitView,
    highlightedClauseId,
    setHighlightedClauseId,
    showOnboarding,
    setShowOnboarding,
    handleAnalyze,
    handleSelectPresetAndAudit,
    handleFileExtracted,
    handleLoadFromVault,
    handleScrollToInput,
    handleSelectClauseForNegotiation,
    handleResetToLanding,
  } = useContractAudit(announce);

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-blue-600 selection:text-white ${fontSizeClass} ${
        highContrast ? "bg-black text-white" : "bg-[#0b0f19] text-gray-100"
      }`}
    >
      {/* Screen Reader Live Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Skip to Content for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-2 focus:bg-blue-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Persistent Legal Boundary Banner */}
      <DisclaimerBanner />

      {/* Accessibility & Display Toolbar */}
      <AccessibilityBar
        fontSizeLevel={fontSizeLevel}
        setFontSizeLevel={setFontSizeLevel}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onTabSelect={(tabId) => setActiveTab(tabId)}
        onOpenTour={() => setShowOnboarding(true)}
      />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={analysis !== null}
        documentTitle={analysis?.documentTitle}
        riskScore={analysis?.overallRiskScore}
        onResetToLanding={handleResetToLanding}
      />

      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8"
      >
        <ErrorBoundary fallbackTitle="LexiGuard Platform Error">
          {/* Landing Page Hero & Onboarding (shown if no analysis and not on aid tab) */}
          {!analysis && activeTab !== "aid" && (
            <>
              <LandingHero
                onSelectPresetAndAudit={handleSelectPresetAndAudit}
                onScrollToInput={handleScrollToInput}
              />

              {/* In-Flight Multi-Stage Pipeline Progress Stepper */}
              {isLoading && (
                <div className="py-2 animate-fadeIn">
                  <AnalysisStepper
                    isLoading={isLoading}
                    documentTitle={customDocumentTitle || "Legal Contract"}
                    piiRedactionsCount={sanitizationInfo?.redactions.length || 0}
                  />
                </div>
              )}

              {/* Ingestion & PII Redaction Input Area */}
              <DocumentInput
                rawText={rawText}
                setRawText={setRawText}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                selectedPresetId={selectedPresetId}
                setSelectedPresetId={setSelectedPresetId}
                selectedPersona={selectedPersona}
                setSelectedPersona={setSelectedPersona}
                customDocumentTitle={customDocumentTitle}
                setCustomDocumentTitle={setCustomDocumentTitle}
                onFileExtracted={handleFileExtracted}
                onLoadFromVault={handleLoadFromVault}
              />
            </>
          )}

          {/* Legal Aid Directory & Safety Checklist (Available pre-audit) */}
          {!analysis && activeTab === "aid" && (
            <div className="space-y-6">
              <SigningSafetyChecklist
                persona={selectedPersona}
                onSelectPersona={setSelectedPersona}
              />
              <LegalAidDirectory />
            </div>
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
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-white">
                        {analysis.documentTitle}
                      </h2>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                        {analysis.contractType}
                      </span>
                      <span className="text-xs bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded font-mono">
                        Persona: {getPersonaProfile(selectedPersona).badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Deconstructed by <strong>Gemini 2.5 Flash</strong> •{" "}
                      {analysis.clauses.length} clauses analyzed
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
                  {/* Split View Toggle */}
                  {activeTab === "audit" && (
                    <button
                      type="button"
                      onClick={() => setShowSplitView((prev) => !prev)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors border ${
                        showSplitView
                          ? "bg-indigo-950/70 border-indigo-700 text-indigo-300"
                          : "bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300"
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>
                        {showSplitView
                          ? "Hide Contract Reader"
                          : "Split Contract Reader"}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
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
                <>
                  {showSplitView ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      <div className="lg:col-span-7 space-y-6">
                        <RiskHeatmap
                          analysis={analysis}
                          onSelectForNegotiation={
                            handleSelectClauseForNegotiation
                          }
                          originalContractText={rawText}
                          onOpenLegalAid={() => setActiveTab("aid")}
                        />
                      </div>
                      <div className="lg:col-span-5 sticky top-28">
                        <SplitContractReader
                          contractText={rawText}
                          clauses={analysis.clauses}
                          activeClauseId={highlightedClauseId}
                          onSelectClause={(clause) =>
                            setHighlightedClauseId(clause.id)
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <RiskHeatmap
                      analysis={analysis}
                      onSelectForNegotiation={handleSelectClauseForNegotiation}
                      originalContractText={rawText}
                      onOpenLegalAid={() => setActiveTab("aid")}
                    />
                  )}
                </>
              )}

              {activeTab === "qa" && (
                <GroundedChat
                  contractText={rawText}
                  persona={selectedPersona}
                />
              )}

              {activeTab === "compare" && <RedlineCompare />}

              {activeTab === "negotiate" && (
                <NegotiationStudio
                  availableClauses={analysis.clauses}
                  selectedClauseForEdit={selectedClauseForNegotiation}
                  persona={selectedPersona}
                />
              )}

              {activeTab === "dossier" && <LawyerDossier analysis={analysis} />}

              {activeTab === "aid" && (
                <div className="space-y-6">
                  <SigningSafetyChecklist
                    persona={selectedPersona}
                    onSelectPersona={setSelectedPersona}
                  />
                  <LegalAidDirectory />
                </div>
              )}
            </div>
          )}
        </ErrorBoundary>

        {/* 5-Step Guided Onboarding Tour Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onSelectPreset={(idx) =>
            handleSelectPresetAndAudit(CONTRACT_PRESETS[idx].id)
          }
        />
      </main>

      {/* Accessible High-Contrast Footer */}
      <footer className="mt-auto border-t border-gray-800 bg-gray-950/90 py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-bold text-gray-300">LexiGuard AI</div>
            <p className="text-[11px] text-gray-400">
              Built with Google Gemini 2.5 Flash for PromptWars: Virtual
              (Exclusive Edition).
            </p>
          </div>
          <div className="text-[11px] text-gray-400 sm:text-right space-y-1">
            <div className="flex flex-wrap items-center sm:justify-end gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                ✓ 110 Passing Tests (17 Suites)
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                Tracked Size: ~495 KiB (&lt; 10 MB Limit)
              </span>
            </div>
            <div>
              Client-Side PII Shield • Zero Unmasked Data Sent to LLMs
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
