"use client";

import React, { useState } from "react";
import { ShieldAlert, X, Info } from "lucide-react";

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <aside aria-label="Legal information status" className="bg-blue-950/40 border-b border-blue-900/50 px-4 py-1.5 text-xs text-blue-300 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
          <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
          <span>
            <strong>Legal Assistance Notice:</strong> LexiGuard AI provides educational information and document navigation. It does not provide formal legal advice.
          </span>
          <button
            onClick={() => setDismissed(false)}
            className="underline hover:text-white ml-auto text-[11px]"
          >
            Show Full Disclaimer
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      role="region"
      aria-label="Legal Disclaimer and Boundary Notice"
      className="bg-amber-950/40 border-b border-amber-800/60 px-4 py-2.5 text-xs text-amber-200 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <span className="font-semibold text-amber-300">
              Legal Boundary & Non-Advisory Notice:
            </span>{" "}
            LexiGuard AI is an AI-powered legal document comprehension and negotiation copilot. It provides automated analysis, risk ratings, and drafting assistance for informational purposes only. It is <strong>not a law firm</strong>, does <strong>not provide licensed legal representation</strong>, and does not create an attorney-client relationship. Always consult a qualified attorney for jurisdiction-specific legal decisions.
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss full disclaimer"
          className="text-amber-400/80 hover:text-amber-200 p-1 rounded hover:bg-amber-900/40 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
