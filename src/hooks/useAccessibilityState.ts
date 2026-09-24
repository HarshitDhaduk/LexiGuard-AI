"use client";

import { useState, useEffect, useCallback } from "react";

export type FontSizeLevel = "normal" | "medium" | "large";

export interface AccessibilityState {
  fontSizeLevel: FontSizeLevel;
  setFontSizeLevel: (level: FontSizeLevel) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  announcement: string;
  announce: (message: string) => void;
  fontSizeClass: string;
}

export function useAccessibilityState(
  onTabSelect?: (tabId: string) => void,
  onOpenTour?: () => void
): AccessibilityState {
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Auto-clear after 4 seconds
    setTimeout(() => {
      setAnnouncement("");
    }, 4000);
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case "1":
          if (onTabSelect) onTabSelect("audit");
          announce("Switched to Clause Audit & Heatmap");
          break;
        case "2":
          if (onTabSelect) onTabSelect("qa");
          announce("Switched to Grounded What-If Q and A");
          break;
        case "3":
          if (onTabSelect) onTabSelect("compare");
          announce("Switched to Redline Diff");
          break;
        case "4":
          if (onTabSelect) onTabSelect("negotiate");
          announce("Switched to Negotiation Studio");
          break;
        case "5":
          if (onTabSelect) onTabSelect("dossier");
          announce("Switched to Lawyer Briefing Dossier");
          break;
        case "6":
          if (onTabSelect) onTabSelect("aid");
          announce("Switched to Legal Aid Directory & Safety Checklist");
          break;
        case "?":
          if (onOpenTour) onOpenTour();
          announce("Opened Guided Tour");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTabSelect, onOpenTour, announce]);

  const fontSizeClass =
    fontSizeLevel === "large"
      ? "text-[125%]"
      : fontSizeLevel === "medium"
      ? "text-[112%]"
      : "text-[100%]";

  return {
    fontSizeLevel,
    setFontSizeLevel,
    highContrast,
    setHighContrast,
    announcement,
    announce,
    fontSizeClass,
  };
}
