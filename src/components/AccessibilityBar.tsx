"use client";

import React, { useState, useEffect } from "react";
import {
  Type,
  Eye,
  Keyboard,
  X,
  Sparkles,
  Contrast,
  Check,
} from "lucide-react";

interface AccessibilityBarProps {
  fontSizeLevel: "normal" | "medium" | "large";
  setFontSizeLevel: (size: "normal" | "medium" | "large") => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  onTabSelect: (tabId: string) => void;
  onOpenTour?: () => void;
}

export default function AccessibilityBar({
  fontSizeLevel,
  setFontSizeLevel,
  highContrast,
  setHighContrast,
  onTabSelect,
  onOpenTour,
}: AccessibilityBarProps) {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Global Keyboard Navigation Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "1":
          onTabSelect("audit");
          break;
        case "2":
          onTabSelect("qa");
          break;
        case "3":
          onTabSelect("compare");
          break;
        case "4":
          onTabSelect("negotiate");
          break;
        case "5":
          onTabSelect("dossier");
          break;
        case "6":
          onTabSelect("aid");
          break;
        case "?":
          setShowShortcutsModal((prev) => !prev);
          break;
        case "Escape":
          setShowShortcutsModal(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTabSelect]);

  return (
    <>
      <div
        role="region"
        aria-label="Accessibility &amp; Display Controls"
        className="bg-gray-950/80 border-b border-gray-800/80 px-4 py-1.5 text-xs text-gray-400 flex items-center justify-between"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          {/* Left: Accessibility Controls */}
          <div className="flex items-center space-x-4">
            {/* Font Size Zoom */}
            <div className="flex items-center space-x-1">
              <Type className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] text-gray-400 mr-1">Reading Size:</span>
              <button
                onClick={() => setFontSizeLevel("normal")}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                  fontSizeLevel === "normal"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
                title="Standard Text Size (100%)"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel("medium")}
                className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                  fontSizeLevel === "medium"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
                title="Medium Reading Size (115%)"
              >
                A+
              </button>
              <button
                onClick={() => setFontSizeLevel("large")}
                className={`px-1.5 py-0.5 rounded text-sm font-bold ${
                  fontSizeLevel === "large"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
                title="Large High-Legibility Size (130%)"
              >
                A++
              </button>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center space-x-1.5">
              <Contrast className="w-3.5 h-3.5 text-gray-500" />
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  highContrast
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-gray-900 text-gray-400 hover:text-white"
                }`}
              >
                {highContrast ? "High Contrast: ON" : "High Contrast"}
              </button>
            </div>
          </div>

          {/* Right: Keyboard Shortcuts & Tour Trigger */}
          <div className="flex items-center space-x-2">
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="flex items-center space-x-1 text-[11px] text-blue-300 hover:text-white bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/80 transition-colors"
                title="Open 5-Step Guided Walkthrough"
              >
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Quick Tour</span>
              </button>
            )}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-white bg-gray-900/90 px-2 py-0.5 rounded border border-gray-800 transition-colors"
            >
              <Keyboard className="w-3 h-3 text-blue-400" />
              <span>Shortcuts (Press ?)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3
                id="shortcuts-title"
                className="text-base font-bold text-white flex items-center space-x-2"
              >
                <Keyboard className="w-4 h-4 text-blue-400" />
                <span>Keyboard Navigation Shortcuts</span>
              </h3>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>01. Clause Audit &amp; Heatmap</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">1</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>02. Grounded What-If Q&amp;A</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">2</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>03. Redline Diff Analyzer</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">3</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>04. Negotiation Studio</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">4</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>05. Lawyer Briefing Pack</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">5</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Switch to <strong>06. Legal Aid &amp; Checklist</strong></span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">6</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-gray-950 border border-gray-800/80">
                <span>Close Active Modals / Drawers</span>
                <kbd className="px-2 py-1 rounded bg-gray-800 font-mono text-gray-300 border border-gray-700">Esc</kbd>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
