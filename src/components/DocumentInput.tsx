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
} from "lucide-react";
import { CONTRACT_PRESETS } from "@/lib/presets";
import { sanitizeContractText } from "@/lib/pii";
import { SanitizationResult } from "@/lib/types";

interface DocumentInputProps {
  rawText: string;
  setRawText: (text: string) => void;
  onAnalyze: (sanitizedText: string, sanitizationResult: SanitizationResult) => void;
  isLoading: boolean;
  selectedPresetId: string | null;
  setSelectedPresetId: (id: string | null) => void;
}

export default function DocumentInput({
  rawText,
  setRawText,
  onAnalyze,
  isLoading,
  selectedPresetId,
  setSelectedPresetId,
}: DocumentInputProps) {
  const [enablePiiShield, setEnablePiiShield] = useState(true);
  const [showSanitizedPreview, setShowSanitizedPreview] = useState(false);

  // Compute live sanitization preview
  const sanitizationResult = React.useMemo(() => {
    return sanitizeContractText(rawText);
  }, [rawText]);

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  const handleSelectPreset = (presetId: string) => {
    const preset = CONTRACT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setRawText(preset.rawText);
    }
  };

  const handleClear = () => {
    setSelectedPresetId(null);
    setRawText("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || rawText.trim().length < 20) return;

    const payloadText = enablePiiShield
      ? sanitizationResult.sanitizedText
      : rawText;

    onAnalyze(payloadText, sanitizationResult);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-3">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Document Ingestion &amp; Privacy Shield</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Paste any contract, lease, or agreement, or test with pre-built real-world presets.
          </p>
        </div>

        {/* Live Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-500 font-medium mr-1">Presets:</span>
          {CONTRACT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                selectedPresetId === preset.id
                  ? "bg-blue-600/30 border-blue-500 text-blue-200"
                  : "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              title={preset.description}
            >
              {preset.category}
            </button>
          ))}
          {rawText && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 text-xs text-gray-400 hover:text-red-400 border border-transparent hover:border-red-800/50 rounded-md transition-colors flex items-center space-x-1"
              title="Clear input"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Text Area */}
        <div className="relative">
          <label htmlFor="contract-text-area" className="sr-only">
            Legal Contract Text
          </label>
          <textarea
            id="contract-text-area"
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              if (selectedPresetId) setSelectedPresetId(null);
            }}
            placeholder="Paste your legal document here (e.g., Master Services Agreement, Lease, NDA, ToS) or select a preset above..."
            rows={10}
            className="w-full bg-gray-950/80 border border-gray-800 rounded-lg p-3.5 text-xs sm:text-sm font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all leading-relaxed"
          />

          <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-[11px] text-gray-500 bg-gray-900/90 px-2.5 py-1 rounded border border-gray-800 pointer-events-none">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Privacy Vault Panel */}
        <div className="mt-3 bg-gray-950/60 border border-gray-800/80 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <div
              className={`p-1.5 rounded-md ${
                enablePiiShield
                  ? "bg-cyan-950 text-cyan-400 border border-cyan-800/60"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {enablePiiShield ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-200">
                  Client-Side Privacy Vault
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    enablePiiShield
                      ? "bg-cyan-900/40 text-cyan-300 border border-cyan-700/50"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {enablePiiShield ? "Shield Enabled" : "Bypass"}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                {sanitizationResult.redactions.length > 0 ? (
                  <>
                    Detected and masking{" "}
                    <strong className="text-cyan-300">
                      {sanitizationResult.redactions.length} PII tokens
                    </strong>{" "}
                    (names, emails, phones, monetary values) locally before LLM submission.
                  </>
                ) : (
                  "Ready to sanitize names, compensation, and contact info in your browser."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-center">
            {sanitizationResult.redactions.length > 0 && enablePiiShield && (
              <button
                type="button"
                onClick={() => setShowSanitizedPreview(!showSanitizedPreview)}
                className="px-2 py-1 text-[11px] text-cyan-400 hover:text-cyan-200 bg-cyan-950/40 border border-cyan-800/60 rounded flex items-center space-x-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                <span>
                  {showSanitizedPreview ? "Hide Masked Preview" : "Inspect Payload"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setEnablePiiShield(!enablePiiShield)}
              className="text-[11px] text-gray-400 hover:text-gray-200 underline"
            >
              {enablePiiShield ? "Disable Shield" : "Enable Shield"}
            </button>
          </div>
        </div>

        {/* Sanitized Payload Preview Drawer */}
        {showSanitizedPreview && enablePiiShield && (
          <div className="mt-2.5 p-3 bg-gray-950 border border-cyan-900/40 rounded-lg text-xs font-mono text-cyan-200/90 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-cyan-950 text-[11px] text-cyan-400">
              <span>Sanitized Payload Dispatched to Gemini 2.5 Flash:</span>
              <span>{sanitizationResult.redactions.length} tokens replaced</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {sanitizationResult.sanitizedText}
            </pre>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Powered by <strong>Gemini 2.5 Flash</strong> with structured JSON schema evaluation.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || rawText.trim().length < 20}
            className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-md ${
              isLoading || rawText.trim().length < 20
                ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-500/50 hover:shadow-blue-500/20"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Decomposing Clauses with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Audit &amp; Deconstruct Contract</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
