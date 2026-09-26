"use client";

import React from "react";
import {
  Briefcase,
  Home,
  Building2,
  User,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { PersonaId, PERSONA_PROFILES, getPersonaProfile } from "@/lib/persona";

interface PersonaSelectorProps {
  selectedPersona: PersonaId;
  onSelectPersona: (persona: PersonaId) => void;
  compact?: boolean;
}

export default function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  compact = false,
}: PersonaSelectorProps) {
  const personas: PersonaId[] = ["freelancer", "tenant", "small_business", "consumer"];
  const activeProfile = getPersonaProfile(selectedPersona);

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Home":
        return <Home className={className} />;
      case "Building2":
        return <Building2 className={className} />;
      case "User":
      default:
        return <User className={className} />;
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              Context-Aware Decision Making
            </span>
            <span className="bg-blue-950/80 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-800/50">
              Active: {activeProfile.badge}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">
            Select Your Signer Persona & Legal Context
          </h3>
        </div>
        <p className="text-[11px] text-gray-400 sm:text-right max-w-xs">
          Calibrates risk thresholds, omission scans, negotiation posture, and pre-signing gates to your bargaining position.
        </p>
      </div>

      {/* Persona Selection Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {personas.map((id) => {
          const profile = PERSONA_PROFILES[id];
          const isSelected = selectedPersona === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectPersona(id)}
              aria-pressed={isSelected}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                  : "bg-gray-950/60 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/60"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`p-2 rounded-lg border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-gray-800 text-gray-400 border-gray-700 group-hover:text-gray-200"
                  }`}
                >
                  {renderIcon(profile.iconName, "w-4 h-4")}
                </div>
                {isSelected ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <span className="text-[10px] text-gray-500 font-mono">
                    {profile.badge}
                  </span>
                )}
              </div>

              <div>
                <div className="font-semibold text-xs text-white">
                  {profile.name}
                </div>
                <div className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-tight">
                  {profile.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Persona Context Guidance Banner */}
      {!compact && (
        <div className="bg-gray-950/80 border border-gray-800/80 rounded-xl p-3 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start space-x-2.5">
            <div className="p-1 rounded bg-blue-950/80 text-blue-400 mt-0.5">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-gray-200">
                Persona Benchmark Focus:
              </span>{" "}
              <span className="text-gray-400">{activeProfile.benchmarkFocus}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap self-end md:self-center shrink-0">
            <span className="text-[10px] text-gray-500 font-mono">
              Key Protections:
            </span>
            {activeProfile.primaryInterests.slice(0, 2).map((interest, i) => (
              <span
                key={i}
                className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
