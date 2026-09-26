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
import { saveContractToVault, StoredContractRecord } from "@/components/ContractHistoryVault";
import { PersonaId } from "@/lib/persona";

export interface UseContractAuditReturn {
  rawText: string;
  setRawText: (val: string) => void;
  selectedPresetId: string | null;
  setSelectedPresetId: (val: string | null) => void;
  selectedPersona: PersonaId;
  setSelectedPersona: (val: PersonaId) => void;
  customDocumentTitle: string;
  setCustomDocumentTitle: (val: string) => void;
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
  handleFileExtracted: (text: string, filename: string) => void;
  handleLoadFromVault: (record: StoredContractRecord) => void;
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
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>("freelancer");
  const [customDocumentTitle, setCustomDocumentTitle] = useState("");
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
      const cacheKey = clientCache.generateKey("audit_v2", selectedPersona, payloadText.trim());
      const cached = clientCache.get<ContractAnalysisResult>(cacheKey);
      if (cached) {
        setAnalysis(cached);
        setActiveTab("audit");
        setIsLoading(false);
        saveContractToVault(
          customDocumentTitle || cached.documentTitle,
          payloadText,
          cached
        );
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
          body: JSON.stringify({ text: payloadText, persona: selectedPersona }),
        });
        const json = await res.json();
        if (json.success && json.data) {
          // Store in client-side dual-tier cache & local contract vault
          clientCache.set(cacheKey, json.data);
          saveContractToVault(
            customDocumentTitle || json.data.documentTitle,
            payloadText,
            json.data
          );
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
    [onAnnounce, customDocumentTitle, selectedPersona]
  );

  const handleSelectPresetAndAudit = useCallback(
    (presetId: string) => {
      const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setSelectedPresetId(preset.id);
        setCustomDocumentTitle(preset.name);
        setRawText(preset.rawText);

        if (preset.category === "Residential Lease") {
          setSelectedPersona("tenant");
        } else if (preset.category === "SaaS Terms") {
          setSelectedPersona("consumer");
        } else {
          setSelectedPersona("freelancer");
        }

        const res = sanitizeContractText(preset.rawText);
        handleAnalyze(res.sanitizedText, res);
      }
    },
    [handleAnalyze]
  );

  const handleFileExtracted = useCallback(
    (text: string, filename: string) => {
      setRawText(text);
      setCustomDocumentTitle(filename);
      setSelectedPresetId(null);
      if (onAnnounce) {
        onAnnounce(`Extracted document ${filename}. Ready for privacy shielding.`);
      }
    },
    [onAnnounce]
  );

  const handleLoadFromVault = useCallback(
    (record: StoredContractRecord) => {
      setRawText(record.rawText);
      setCustomDocumentTitle(record.title);
      setSelectedPresetId(null);
      setAnalysis(record.analysis);
      setActiveTab("audit");
      if (onAnnounce) {
        onAnnounce(`Loaded ${record.title} from your saved contract vault.`);
      }
      setTimeout(() => {
        document
          .getElementById("analysis-workbench")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    [onAnnounce]
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
    selectedPersona,
    setSelectedPersona,
    customDocumentTitle,
    setCustomDocumentTitle,
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
    handleFileExtracted,
    handleLoadFromVault,
    handleScrollToInput,
    handleSelectClauseForNegotiation,
    handleResetToLanding,
  };
}
