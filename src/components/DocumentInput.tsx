"use client";

import React, { useState } from "react";
import {
  FileText,
  Shield,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Eye,
  AlertCircle,
  Briefcase,
  Home,
  Cloud,
  ArrowRight,
  UploadCloud,
  FileCode,
  ClipboardPaste,
  Check,
} from "lucide-react";
import { CONTRACT_PRESETS } from "@/lib/presets";
import { sanitizeContractText } from "@/lib/pii";
import { SanitizationResult } from "@/lib/types";
import FileDropzone from "./FileDropzone";
import ContractHistoryVault, { StoredContractRecord } from "./ContractHistoryVault";
import PersonaSelector from "./PersonaSelector";
import { PersonaId, PERSONA_PROFILES } from "@/lib/persona";

interface DocumentInputProps {
  rawText: string;
  setRawText: (text: string) => void;
  onAnalyze: (sanitizedText: string, sanitizationResult: SanitizationResult) => void;
  isLoading: boolean;
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
  selectedPersona?: PersonaId;
  setSelectedPersona?: (persona: PersonaId) => void;
  customDocumentTitle?: string;
  setCustomDocumentTitle?: (title: string) => void;
  onFileExtracted?: (text: string, filename: string) => void;
  onLoadFromVault?: (record: StoredContractRecord) => void;
}

export default function DocumentInput({
  rawText,
  setRawText,
  onAnalyze,
  isLoading,
  selectedPresetId,
  setSelectedPresetId,
  selectedPersona = "freelancer",
  setSelectedPersona,
  customDocumentTitle = "",
  setCustomDocumentTitle,
  onFileExtracted,
  onLoadFromVault,
}: DocumentInputProps) {
  // Default to user's own upload mode
  const [activeInputMode, setActiveInputMode] = useState<"upload" | "paste" | "preset">(
    "upload"
  );
  const [enablePiiShield, setEnablePiiShield] = useState(true);
  const [showSanitizedPreview, setShowSanitizedPreview] = useState(false);
  const [hasPastedFromClipboard, setHasPastedFromClipboard] = useState(false);

  // Compute live sanitization preview
  const sanitizationResult = React.useMemo(() => {
    return sanitizeContractText(rawText);
  }, [rawText]);

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = rawText.length;

  const handleSelectPreset = (presetId: string) => {
    const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setRawText(preset.rawText);
      if (setCustomDocumentTitle) setCustomDocumentTitle(preset.name);
    }
  };

  const handleClear = () => {
    setSelectedPresetId(null);
    setRawText("");
    if (setCustomDocumentTitle) setCustomDocumentTitle("");
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRawText(text);
          setSelectedPresetId(null);
          setHasPastedFromClipboard(true);
          setTimeout(() => setHasPastedFromClipboard(false), 2000);
        }
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleDropzoneTextExtracted = (text: string, filename: string) => {
    setRawText(text);
    setSelectedPresetId(null);
    if (setCustomDocumentTitle) {
      // Strip extension for clean title
      const cleanTitle = filename.replace(/\.[^/.]+$/, "");
      setCustomDocumentTitle(cleanTitle);
    }
    if (onFileExtracted) {
      onFileExtracted(text, filename);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rawText.trim() || rawText.trim().length < 20) return;

    const payloadText = enablePiiShield
      ? sanitizationResult.sanitizedText
      : rawText;

    onAnalyze(payloadText, sanitizationResult);
  };

  const handleInstantPresetAudit = (presetId: string) => {
    const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      if (setCustomDocumentTitle) setCustomDocumentTitle(preset.name);
      setRawText(preset.rawText);
      const res = sanitizeContractText(preset.rawText);
      const textToAudit = enablePiiShield ? res.sanitizedText : preset.rawText;
      onAnalyze(textToAudit, res);
    }
  };

  const handlePersonaSelect = (personaId: PersonaId) => {
    if (setSelectedPersona) {
      setSelectedPersona(personaId);
    }
    if (activeInputMode === "preset") {
      const matchingPresetId = PERSONA_PROFILES[personaId].matchingPresetId;
      const matchingPreset = CONTRACT_PRESETS.find((p) => p.id === matchingPresetId);
      if (matchingPreset) {
        setSelectedPresetId(matchingPreset.id);
        setRawText(matchingPreset.rawText);
        if (setCustomDocumentTitle) setCustomDocumentTitle(matchingPreset.name);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Signer Persona & Context Selector */}
      <PersonaSelector
        selectedPersona={selectedPersona}
        onSelectPersona={handlePersonaSelect}
      />

      <div
        id="document-input-section"
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6"
      >
      {/* Header & Ingestion Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <span>Contract Ingestion Hub</span>
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Upload your PDF/Word document, paste contract text, or explore verified legal benchmarks.
          </p>
        </div>

        {/* 3-Way Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-gray-950 p-1 border border-gray-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveInputMode("upload")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeInputMode === "upload"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode("paste")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeInputMode === "paste"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveInputMode("preset")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeInputMode === "preset"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sample Contracts</span>
          </button>
        </div>
      </div>

      {/* Mode 1: File Dropzone (Upload PDF, Word, TXT) */}
      {activeInputMode === "upload" && (
        <div className="space-y-4">
          <FileDropzone
            onTextExtracted={handleDropzoneTextExtracted}
            disabled={isLoading}
          />

          {rawText.length > 0 && (
            <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Extracted Contract Preview:
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    ({wordCount} words • {charCount} characters)
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveInputMode("paste")}
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Edit in Text Editor
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="max-h-36 overflow-y-auto font-mono text-xs text-gray-300 p-3 bg-gray-950 rounded-lg border border-gray-800/80 leading-relaxed whitespace-pre-wrap">
                {rawText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Direct Text Paste */}
      {activeInputMode === "paste" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Custom Title Input */}
            <div className="flex-1 max-w-md">
              <label
                htmlFor="custom-contract-title"
                className="block text-[11px] font-semibold text-gray-300 mb-1"
              >
                Contract Title / Nickname (Optional):
              </label>
              <input
                id="custom-contract-title"
                type="text"
                value={customDocumentTitle}
                onChange={(e) => setCustomDocumentTitle?.(e.target.value)}
                placeholder="e.g. Apartment Lease - 5th Ave or Acme MSA"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-lg flex items-center space-x-1.5 transition-colors"
              >
                {hasPastedFromClipboard ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Pasted!</span>
                  </>
                ) : (
                  <>
                    <ClipboardPaste className="w-3.5 h-3.5 text-blue-400" />
                    <span>Paste Clipboard</span>
                  </>
                )}
              </button>
              {rawText && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1.5 text-xs text-rose-300 hover:text-white bg-gray-950 border border-rose-900/60 rounded-lg flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <label htmlFor="custom-contract-text" className="sr-only">
              Custom Contract Input
            </label>
            <textarea
              id="custom-contract-text"
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                if (selectedPresetId) setSelectedPresetId(null);
              }}
              placeholder="Paste any agreement, lease, NDA, contract, or policy text here to begin risk deconstruction..."
              rows={9}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs sm:text-sm font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all leading-relaxed"
            />

            <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-[11px] text-gray-300 bg-gray-900/90 px-2.5 py-1 rounded-md border border-gray-800 pointer-events-none">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Minimum 20 characters required for semantic clause analysis.
          </div>
        </div>
      )}

      {/* Mode 3: Verified Preset Templates */}
      {activeInputMode === "preset" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CONTRACT_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const Icon =
                preset.category === "Freelance MSA"
                  ? Briefcase
                  : preset.category === "Residential Lease"
                  ? Home
                  : Cloud;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/30"
                      : "bg-gray-950/70 border-gray-800 hover:border-gray-700 hover:bg-gray-950"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-blue-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-gray-900 text-gray-300 border border-gray-800">
                        {preset.badge}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-gray-800/80">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {isSelected ? "Selected ✓" : "Click to load"}
                    </span>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantPresetAudit(preset.id);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600/80 hover:bg-blue-500 text-white rounded-md flex items-center space-x-1 transition-colors"
                    >
                      <span>Instant Audit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Local Contract History Drawer */}
      {onLoadFromVault && (
        <ContractHistoryVault
          onLoadContract={onLoadFromVault}
          currentDocumentTitle={customDocumentTitle}
        />
      )}

      {/* Privacy Vault Panel */}
      <div className="bg-gray-950/80 border border-cyan-900/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3">
          <div
            className={`p-2 rounded-xl flex-shrink-0 ${
              enablePiiShield
                ? "bg-cyan-950 text-cyan-400 border border-cyan-800/60"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            {enablePiiShield ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">
                Client-Side Privacy Vault
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                  enablePiiShield
                    ? "bg-cyan-900/40 text-cyan-300 border border-cyan-700/50"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                {enablePiiShield ? "Active Shield" : "Off"}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {sanitizationResult.redactions.length > 0 ? (
                <>
                  <strong className="text-cyan-300 font-semibold">
                    {sanitizationResult.redactions.length} PII entities detected
                  </strong>{" "}
                  (names, compensation, emails, phone numbers) masked locally in your browser before LLM dispatch.
                </>
              ) : (
                "Scans and masks names, compensation, and contact info in your browser before LLM dispatch."
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end md:self-center">
          {sanitizationResult.redactions.length > 0 && enablePiiShield && (
            <button
              type="button"
              onClick={() => setShowSanitizedPreview(!showSanitizedPreview)}
              className="px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-200 bg-cyan-950/60 border border-cyan-800/60 rounded-md flex items-center space-x-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {showSanitizedPreview ? "Hide Masked Preview" : "Inspect Payload"}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setEnablePiiShield(!enablePiiShield)}
            className="text-xs text-gray-400 hover:text-gray-200 underline"
          >
            {enablePiiShield ? "Bypass Shield" : "Enable Shield"}
          </button>
        </div>
      </div>

      {/* Sanitized Payload Inspection Drawer */}
      {showSanitizedPreview && enablePiiShield && (
        <div className="p-3.5 bg-gray-950 border border-cyan-900/50 rounded-xl text-xs font-mono text-cyan-200/90 max-h-44 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-cyan-950 text-[11px] text-cyan-400 font-sans">
            <span className="font-semibold">
              Client-Sanitized Text Dispatched to Gemini 2.5 Flash:
            </span>
            <span>{sanitizationResult.redactions.length} tokens replaced</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
            {sanitizationResult.sanitizedText}
          </pre>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800">
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            Decomposes clauses, scores risk (0–100), and checks for omitted protections.
          </span>
        </div>

        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading || rawText.trim().length < 20}
          className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg ${
            isLoading || rawText.trim().length < 20
              ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-600/25 hover:shadow-blue-500/35"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Deconstructing Clauses with Gemini 2.5 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Audit &amp; Deconstruct Contract</span>
            </>
          )}
        </button>
      </div>
    </div>
    </div>
  );
}
