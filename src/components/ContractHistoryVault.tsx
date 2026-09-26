"use client";

import React, { useState, useEffect } from "react";
import {
  FolderClock,
  Trash2,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { ContractAnalysisResult } from "@/lib/types";

export interface StoredContractRecord {
  id: string;
  title: string;
  timestamp: number;
  riskScore: number;
  riskRating: string;
  wordCount: number;
  rawText: string;
  analysis: ContractAnalysisResult;
}

const STORAGE_KEY = "lexiguard_contract_vault";

export function saveContractToVault(
  title: string,
  rawText: string,
  analysis: ContractAnalysisResult
) {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: StoredContractRecord[] = raw ? JSON.parse(raw) : [];

    // Avoid duplicate entries by title and text snippet
    const existingIndex = list.findIndex(
      (item) => item.title === title || item.rawText.slice(0, 100) === rawText.slice(0, 100)
    );

    const newRecord: StoredContractRecord = {
      id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title || analysis.documentTitle || "Custom Contract",
      timestamp: Date.now(),
      riskScore: analysis.overallRiskScore,
      riskRating: analysis.overallRiskRating,
      wordCount: rawText.trim().split(/\s+/).filter(Boolean).length,
      rawText,
      analysis,
    };

    if (existingIndex >= 0) {
      list[existingIndex] = newRecord;
    } else {
      list.unshift(newRecord);
    }

    // Keep up to 10 most recent custom contracts
    const trimmed = list.slice(0, 10);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (err) {
    console.warn("Unable to save to localStorage vault:", err);
  }
}

interface ContractHistoryVaultProps {
  onLoadContract: (record: StoredContractRecord) => void;
  currentDocumentTitle?: string;
}

export default function ContractHistoryVault({
  onLoadContract,
  currentDocumentTitle,
}: ContractHistoryVaultProps) {
  const [records, setRecords] = useState<StoredContractRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setRecords(JSON.parse(raw));
        }
      } catch (e) {}
    }
  }, [isOpen]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = records.filter((r) => r.id !== id);
      setRecords(updated);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearAll = () => {
    try {
      setRecords([]);
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  if (records.length === 0) return null;

  return (
    <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-xs font-bold text-white hover:text-blue-300 transition-colors"
        >
          <FolderClock className="w-4 h-4 text-blue-400" />
          <span>My Saved Contracts Vault ({records.length})</span>
          <span className="text-[10px] text-gray-500 font-mono">
            {isOpen ? "▲ Hide" : "▼ Show Recent"}
          </span>
        </button>

        {isOpen && records.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] text-gray-400 hover:text-rose-300 flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-2 pt-2 border-t border-gray-800/80 max-h-60 overflow-y-auto pr-1">
          {records.map((item) => {
            const isCurrent = currentDocumentTitle === item.title;
            const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                onClick={() => onLoadContract(item)}
                className={`cursor-pointer rounded-lg p-3 border transition-all flex items-center justify-between gap-3 ${
                  isCurrent
                    ? "bg-blue-950/40 border-blue-600 ring-1 ring-blue-500/30"
                    : "bg-gray-900/80 border-gray-800 hover:border-gray-700 hover:bg-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-2 rounded-lg bg-gray-950 text-blue-400 border border-gray-800 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                        {item.title}
                      </h5>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                          item.riskScore >= 70
                            ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                            : item.riskScore >= 40
                            ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                        }`}
                      >
                        {item.riskScore}/100 Risk
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center space-x-2 mt-0.5">
                      <span>{item.wordCount} words</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>{dateStr}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadContract(item);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center space-x-1 transition-colors"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-gray-500 hover:text-rose-300 rounded hover:bg-gray-800 transition-colors"
                    title="Delete record"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
