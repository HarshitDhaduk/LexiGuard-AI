"use client";

import React from "react";
import { Zap, Clock, ShieldCheck, Cpu } from "lucide-react";

interface TelemetryPillProps {
  cached?: boolean;
  executionTimeMs?: number;
  tokensSaved?: number;
}

export default function TelemetryPill({
  cached = false,
  executionTimeMs,
  tokensSaved,
}: TelemetryPillProps) {
  if (executionTimeMs === undefined) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center space-x-2 text-[11px] font-mono rounded-lg px-2.5 py-1 border transition-all shadow-sm bg-gray-950/80 border-gray-800"
    >
      {cached ? (
        <span className="flex items-center space-x-1 text-emerald-400 font-bold">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cache Hit ({executionTimeMs}ms)</span>
          {tokensSaved && (
            <span className="text-gray-400 font-normal">
              • ~{tokensSaved} tokens saved
            </span>
          )}
        </span>
      ) : (
        <span className="flex items-center space-x-1 text-blue-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Processed in {(executionTimeMs / 1000).toFixed(2)}s</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Optimized Token Budget</span>
        </span>
      )}
    </div>
  );
}
