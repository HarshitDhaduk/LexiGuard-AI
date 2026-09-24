"use client";

import React, { useState } from "react";
import {
  LEGAL_AID_DIRECTORY,
  STATUTORY_PROTECTIONS,
  LegalAidResource,
} from "@/lib/legal-aid";
import {
  Scale,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Phone,
  Landmark,
  FileCheck2,
  Users,
  AlertTriangle,
} from "lucide-react";

export default function LegalAidDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"directory" | "statutory">("directory");

  const categories = [
    "All",
    "Federal Legal Aid",
    "Tenant Rights",
    "Freelancer Rights",
    "Pro Bono Clinic",
    "Small Business",
  ];

  const filteredResources =
    selectedCategory === "All"
      ? LEGAL_AID_DIRECTORY
      : LEGAL_AID_DIRECTORY.filter((r) => r.category === selectedCategory);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
              <Scale className="w-5 h-5" />
            </span>
            <h3 className="text-base font-bold text-white">
              Access to Justice &amp; Legal Aid Directory
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
              Pro Bono &amp; Free Services
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Free, legitimate legal assistance networks, tenant unions, and statutory consumer protection rights for underserved signers.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex rounded-lg bg-gray-950 p-1 border border-gray-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("directory")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "directory"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Free Legal Clinics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("statutory")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "statutory"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Statutory Protections
          </button>
        </div>
      </div>

      {/* View 1: Free Legal Clinics Directory */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors border ${
                  selectedCategory === cat
                    ? "bg-emerald-950/80 border-emerald-600 text-emerald-300"
                    : "bg-gray-950 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res: LegalAidResource) => (
              <div
                key={res.id}
                className="bg-gray-950 border border-gray-800 hover:border-emerald-800/60 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>{res.name}</span>
                      </h4>
                      <span className="text-[11px] text-emerald-400 font-medium">
                        {res.category}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-gray-900 text-gray-300 border border-gray-800 flex-shrink-0">
                      {res.badge}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="bg-gray-900/80 border border-gray-800/80 rounded-lg p-2 text-[11px] text-gray-400 space-y-1">
                    <div>
                      <strong className="text-gray-300">Eligibility:</strong> {res.eligibility}
                    </div>
                    <div>
                      <strong className="text-gray-300">Coverage:</strong> {res.regions.join(" • ")}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-800/80 text-xs">
                  {res.phone ? (
                    <a
                      href={`tel:${res.phone}`}
                      className="text-gray-300 hover:text-white flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{res.phone}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Online Intake</span>
                  )}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 hover:text-emerald-200 rounded-lg flex items-center space-x-1 font-semibold transition-colors"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Statutory Consumer & Worker Protections */}
      {activeTab === "statutory" && (
        <div className="space-y-4">
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3.5 flex items-start space-x-3 text-xs text-blue-300">
            <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Statutory Override Rule:</strong> In many jurisdictions, predatory contract clauses (such as unconscionable indemnity, non-payment waivers, or illegal tenant entry) are <em>legally nullified</em> by statutes, even if you unknowingly signed them.
            </p>
          </div>

          <div className="space-y-3">
            {STATUTORY_PROTECTIONS.map((statute) => (
              <div
                key={statute.id}
                className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <h4 className="text-sm font-bold text-white">
                      {statute.statuteName}
                    </h4>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded font-mono font-semibold bg-gray-900 text-gray-300 border border-gray-800 self-start sm:self-auto">
                    {statute.jurisdiction}
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {statute.summary}
                </p>

                <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-2.5 text-xs text-emerald-300 leading-relaxed">
                  <strong className="text-emerald-200">How it protects you:</strong>{" "}
                  {statute.howItProtectsYou}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
