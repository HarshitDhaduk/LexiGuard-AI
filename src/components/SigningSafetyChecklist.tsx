"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, AlertCircle, FileCheck2, Download } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  recommendation: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "liability-cap",
    title: "1. Cap Unilateral Liabilities to Fees Paid",
    description: "Ensure your exposure to damages cannot exceed the total amount earned or paid under the contract.",
    recommendation: "Replace 'unlimited liability' with 'total liability shall not exceed the aggregate fees paid in the past 12 months'.",
  },
  {
    id: "cure-period",
    title: "2. Insert 14–30 Day Written Notice & Cure Window",
    description: "Prevent immediate arbitrary termination or breach claims without an opportunity to rectify the issue.",
    recommendation: "Require that either party provide at least 14 days written notice specifying any alleged breach before terminating.",
  },
  {
    id: "payment-terms",
    title: "3. Lock in Net-30 Payment Milestones & Late Penalties",
    description: "Eliminate vague 'upon client satisfaction' payment delays and safeguard against unpaid labor.",
    recommendation: "Include explicit Net 30 terms, milestone schedules, and a 1.5% monthly late fee for overdue invoices.",
  },
  {
    id: "ip-transfer",
    title: "4. Condition IP Transfer on Full Payment Clearance",
    description: "Retain ownership of your creative work product and code until all associated invoices have cleared.",
    recommendation: "Add: 'Ownership of deliverables transfers to Client strictly and only upon receipt of full payment.'",
  },
  {
    id: "legal-aid-consult",
    title: "5. Legal Aid Review for Contracts Exceeding $5,000",
    description: "If dispute risk or damages exposure exceeds $5,000, utilize pro bono legal aid or the Lawyer Briefing Dossier.",
    recommendation: "Submit your 1-page Dossier to ABA Free Legal Answers, LawHelp.org, or your local pro bono clinic.",
  },
];

import { PersonaId, getPersonaProfile, PERSONA_PROFILES } from "@/lib/persona";

interface SigningSafetyChecklistProps {
  persona?: PersonaId;
  onSelectPersona?: (persona: PersonaId) => void;
}

export default function SigningSafetyChecklist({
  persona = "freelancer",
  onSelectPersona,
}: SigningSafetyChecklistProps) {
  const [activePersona, setActivePersona] = useState<PersonaId>(persona);
  const currentPersona = onSelectPersona ? persona : activePersona;
  const personaProfile = getPersonaProfile(currentPersona);
  const checklistItems = personaProfile.checklistItems;

  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set([checklistItems[0]?.id || "default-item"])
  );

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const progressPercentage = Math.round((checkedIds.size / checklistItems.length) * 100);

  const getReadinessBadge = () => {
    if (progressPercentage === 100) {
      return { label: "Fully Protected — Safe to Sign", color: "text-emerald-400 bg-emerald-950 border-emerald-700/60" };
    }
    if (progressPercentage >= 60) {
      return { label: "Moderate Protection — Review Flags", color: "text-yellow-400 bg-yellow-950 border-yellow-700/60" };
    }
    return { label: "High Vulnerability — Do Not Sign Yet", color: "text-rose-400 bg-rose-950 border-rose-700/60" };
  };

  const badge = getReadinessBadge();

  const handleExportChecklist = () => {
    const text = [
      "# LexiGuard AI — Pre-Signing Verification Checklist",
      `Readiness Status: ${progressPercentage}% (${badge.label})`,
      `Verified on: ${new Date().toLocaleDateString()}`,
      "",
      "## Verification Points:",
      ...CHECKLIST_ITEMS.map((item) => {
        const isChecked = checkedIds.has(item.id) ? "[X]" : "[ ]";
        return `${isChecked} ${item.title}\n   - Details: ${item.description}\n   - Recommended: ${item.recommendation}\n`;
      }),
      "---",
      "Notice: Informational safety checklist created with LexiGuard AI. Not a formal legal opinion.",
    ].join("\n");

    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LexiGuard_PreSigning_Checklist.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVerifyAll = () => {
    if (checkedIds.size === checklistItems.length) {
      setCheckedIds(new Set([checklistItems[0]?.id || "default-item"]));
    } else {
      setCheckedIds(new Set(checklistItems.map((item) => item.id)));
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-700/60 text-blue-400">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-white">
              Pre-Signing Safety Checklist
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
              Role: {personaProfile.badge}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            5 non-negotiable verification gates calibrated for {personaProfile.name} before signing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Persona Switcher Tabs */}
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            {(["freelancer", "tenant", "small_business", "consumer"] as PersonaId[]).map((pId) => {
              const p = PERSONA_PROFILES[pId];
              const isSelected = currentPersona === pId;
              return (
                <button
                  key={pId}
                  type="button"
                  onClick={() => {
                    if (onSelectPersona) onSelectPersona(pId);
                    else setActivePersona(pId);
                  }}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white font-semibold shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {p.name.split(" / ")[0]}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleVerifyAll}
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{checkedIds.size === checklistItems.length ? "Reset Gates" : "Verify All (Safe to Sign)"}</span>
          </button>

          <button
            type="button"
            onClick={handleExportChecklist}
            className="px-3 py-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg border border-gray-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Checklist</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-300">
            Pre-Signing Readiness: {checkedIds.size} of {checklistItems.length} Safeguards Confirmed
          </span>
          <span className="font-mono font-bold text-white">{progressPercentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
          <div
            className={`h-full transition-all duration-300 ${
              progressPercentage === 100
                ? "bg-emerald-500"
                : progressPercentage >= 60
                ? "bg-yellow-500"
                : "bg-blue-600"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklistItems.map((item) => {
          const isChecked = checkedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start space-x-3.5 ${
                isChecked
                  ? "bg-emerald-950/20 border-emerald-800/50 text-gray-200"
                  : "bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300"
              }`}
            >
              <button
                type="button"
                aria-label={`Toggle ${item.title}`}
                className="mt-0.5 flex-shrink-0 text-emerald-400 focus:outline-none"
              >
                {isChecked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950/80" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? "text-emerald-300 line-through opacity-85" : "text-white"}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {isChecked ? "Verified ✓" : "Click to verify"}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[11px] text-blue-300 bg-blue-950/30 border border-blue-900/40 rounded-lg p-2 mt-1.5">
                  <strong className="text-blue-200">Recommended action:</strong> {item.recommendation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
