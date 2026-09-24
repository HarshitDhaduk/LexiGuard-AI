import React from "react";
import { Loader2 } from "lucide-react";

interface TabLoadingSkeletonProps {
  title?: string;
  subtitle?: string;
}

export default function TabLoadingSkeleton({
  title = "Loading Module...",
  subtitle = "Optimizing workspace bundle with Gemini 2.5 Flash pipeline",
}: TabLoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full min-h-[360px] flex flex-col items-center justify-center bg-gray-900/60 border border-gray-800 rounded-2xl p-8 space-y-4 animate-pulse"
    >
      <div className="p-3 bg-blue-950/60 border border-blue-800/50 rounded-xl text-blue-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-base font-semibold text-gray-200">{title}</h3>
        <p className="text-xs text-gray-400 max-w-sm">{subtitle}</p>
      </div>
      <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full animate-indeterminate" />
      </div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
