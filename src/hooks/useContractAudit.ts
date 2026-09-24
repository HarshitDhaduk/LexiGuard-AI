"use client";

import { useState, useCallback } from "react";
import { CONTRACT_PRESETS } from "@/lib/presets";
import { sanitizeContractText } from "@/lib/pii";
import { clientCache } from "@/lib/client-cache";
import {
  ContractAnalysisResult,
  AnalyzedClause,
  SanitizationResult,
} from "@/lib/types";

export interface UseContractAuditReturn {
  rawText: string;
  setRawText: (val: string) => void;
  selectedPresetId: string | null;
  setSelectedPresetId: (val: string | null) => void;
  analysis: ContractAnalysisResult | null;
  setAnalysis: (val: ContractAnalysisResult | null) => void;
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedClauseForNegotiation: AnalyzedClause | null;
  setSelectedClauseForNegotiation: (clause: AnalyzedClause | null) => void;
  sanitizationInfo: SanitizationResult | null;
  showSplitView: boolean;
  setShowSplitView: (val: boolean | ((prev: boolean) => boolean)) => void;
  highlightedClauseId: string | null;
  setHighlightedClauseId: (id: string | null) => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  handleAnalyze: (
    payloadText: string,
    sanitizationResult: SanitizationResult
  ) => Promise<void>;
  handleSelectPresetAndAudit: (presetId: string) => void;
  handleScrollToInput: () => void;
  handleSelectClauseForNegotiation: (clause: AnalyzedClause) => void;
  handleResetToLanding: () => void;
}

export function useContractAudit(
  onAnnounce?: (msg: string) => void
): UseContractAuditReturn {
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
  const [showSplitView, setShowSplitView] = useState(true);
  const [highlightedClauseId, setHighlightedClauseId] = useState<string | null>(
    null
  );
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleAnalyze = useCallback(
    async (payloadText: string, sanitizationResult: SanitizationResult) => {
      setIsLoading(true);
      setSanitizationInfo(sanitizationResult);
      if (onAnnounce) {
        onAnnounce("Analyzing contract clauses with Gemini 2.5 Flash...");
      }

      // Check client-side dual cache first for 0ms retrieval
      const cacheKey = clientCache.generateKey("audit", payloadText.trim());
      const cached = clientCache.get<ContractAnalysisResult>(cacheKey);
      if (cached) {
        setAnalysis(cached);
        setActiveTab("audit");
        setIsLoading(false);
        if (onAnnounce) {
          onAnnounce(`Instant analysis retrieved from cache for ${cached.documentTitle}`);
        }
        setTimeout(() => {
          document
            .getElementById("analysis-workbench")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: payloadText }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          // Store in client-side dual-tier cache
          clientCache.set(cacheKey, json.data);
          setAnalysis(json.data);
          setActiveTab("audit");
          if (onAnnounce) {
            onAnnounce(`Audit complete. Found ${json.data.clauses.length} clauses.`);
          }
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
    },
    [onAnnounce]
  );

  const handleSelectPresetAndAudit = useCallback(
    (presetId: string) => {
      const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setSelectedPresetId(preset.id);
        setRawText(preset.rawText);
        const res = sanitizeContractText(preset.rawText);
        handleAnalyze(res.sanitizedText, res);
      }
    },
    [handleAnalyze]
  );

  const handleScrollToInput = useCallback(() => {
    document
      .getElementById("document-input-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSelectClauseForNegotiation = useCallback(
    (clause: AnalyzedClause) => {
      setSelectedClauseForNegotiation(clause);
      setActiveTab("negotiate");
      if (onAnnounce) {
        onAnnounce(`Selected clause ${clause.title} for counter-draft negotiation.`);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onAnnounce]
  );

  const handleResetToLanding = useCallback(() => {
    setAnalysis(null);
    setActiveTab("audit");
    if (onAnnounce) {
      onAnnounce("Returned to home view.");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onAnnounce]);

  return {
    rawText,
    setRawText,
    selectedPresetId,
    setSelectedPresetId,
    analysis,
    setAnalysis,
    isLoading,
    activeTab,
    setActiveTab,
    selectedClauseForNegotiation,
    setSelectedClauseForNegotiation,
    sanitizationInfo,
    showSplitView,
    setShowSplitView,
    highlightedClauseId,
    setHighlightedClauseId,
    showOnboarding,
    setShowOnboarding,
    handleAnalyze,
    handleSelectPresetAndAudit,
    handleScrollToInput,
    handleSelectClauseForNegotiation,
    handleResetToLanding,
  };
}
