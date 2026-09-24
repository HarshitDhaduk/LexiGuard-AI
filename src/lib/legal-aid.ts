/**
 * Legal Aid Directory & Statutory Consumer Rights Knowledgebase
 * Connects underrepresented individuals, tenants, and freelancers to legitimate
 * free/pro bono legal assistance, government hotlines, and statutory protections.
 */

import { ClauseCategory } from "./types";

export interface LegalAidResource {
  id: string;
  name: string;
  category: "Federal Legal Aid" | "Tenant Rights" | "Freelancer Rights" | "Pro Bono Clinic" | "Small Business";
  description: string;
  eligibility: string;
  url: string;
  phone?: string;
  badge: string;
  regions: string[];
}

export interface StatutoryProtection {
  id: string;
  statuteName: string;
  jurisdiction: string;
  category: ClauseCategory;
  summary: string;
  howItProtectsYou: string;
}

export const LEGAL_AID_DIRECTORY: LegalAidResource[] = [
  {
    id: "lsc-nationwide",
    name: "Legal Services Corporation (LSC)",
    category: "Federal Legal Aid",
    description: "The single largest funder of civil legal aid for low-income Americans in the United States, supporting 131 independent non-profit legal aid organizations across all 50 states.",
    eligibility: "Income at or below 125% of federal poverty guidelines; special exemptions for veterans and disaster survivors.",
    url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-aid",
    phone: "1-202-295-1500",
    badge: "Federally Backed",
    regions: ["Nationwide US", "Puerto Rico", "US Territories"],
  },
  {
    id: "lawhelp-org",
    name: "LawHelp.org",
    category: "Federal Legal Aid",
    description: "Comprehensive national directory helping individuals find free legal aid programs in their communities, obtain answers to civil legal questions, and access state-specific self-help forms.",
    eligibility: "Free self-help legal resources available to all; clinic intake varies by local legal aid provider.",
    url: "https://www.lawhelp.org",
    badge: "50-State Network",
    regions: ["Nationwide US"],
  },
  {
    id: "aba-free-legal-answers",
    name: "ABA Free Legal Answers",
    category: "Pro Bono Clinic",
    description: "A virtual pro bono legal clinic sponsored by the American Bar Association where qualifying individuals post specific civil legal questions to be answered by licensed volunteer attorneys.",
    eligibility: "Users must meet state income guidelines and cannot be currently incarcerated.",
    url: "https://www.abafreelegalanswers.org",
    badge: "Licensed Attorneys",
    regions: ["40+ US States"],
  },
  {
    id: "freelancers-union",
    name: "Freelancers Union Legal Resources",
    category: "Freelancer Rights",
    description: "Free legal contract education, fee dispute guidelines, and enforcement assistance under the Freelance Isn't Free Act for gig workers and independent contractors.",
    eligibility: "Open to all freelancers, independent contractors, and solo practitioners.",
    url: "https://freelancersunion.org/resources/legal",
    badge: "Gig Worker Advocacy",
    regions: ["Nationwide US", "New York", "California", "Illinois"],
  },
  {
    id: "national-tenant-union",
    name: "Tenant Defense Network & Eviction Clinic",
    category: "Tenant Rights",
    description: "Provides free tenant hotline counseling, guidance on habitability standards, security deposit recovery, and defense against illegal lease covenants and retaliatory evictions.",
    eligibility: "Open to residential tenants and renters facing unfair landlord practices.",
    url: "https://www.hud.gov/topics/rental_assistance/tenantrights",
    phone: "1-800-569-4287",
    badge: "Tenant Advocacy",
    regions: ["Nationwide US"],
  },
  {
    id: "score-sba",
    name: "SCORE Commercial Mentorship (SBA Partner)",
    category: "Small Business",
    description: "Offers free, confidential legal and business mentorship to micro-enterprises and sole proprietors, helping review standard commercial vendor agreements.",
    eligibility: "Free for all early-stage entrepreneurs and small business owners.",
    url: "https://www.score.org",
    phone: "1-800-634-0245",
    badge: "SBA Supported",
    regions: ["Nationwide US"],
  },
];

export const STATUTORY_PROTECTIONS: StatutoryProtection[] = [
  {
    id: "fifa-ny",
    statuteName: "New York Freelance Isn't Free Act (FIFA)",
    jurisdiction: "New York State & NYC",
    category: "Payment, Invoicing & Penalties",
    summary: "Requires written contracts for work valued at $800+, mandates full payment within 30 days of completion, and awards double damages for non-payment.",
    howItProtectsYou: "If a client attempts to withhold payment or delay past 30 days without cause, statutory penalties equal to 2x the contract amount apply regardless of fine-print contract waivers.",
  },
  {
    id: "sb548-ca",
    statuteName: "California Freelance Worker Protection Act (SB 548)",
    jurisdiction: "California",
    category: "Termination & Cancellation",
    summary: "Mandates written agreements for contracts over $250, protects against retaliatory termination, and forbids conditioning payment on discounts.",
    howItProtectsYou: "Clients cannot legally coerce contractors to accept partial payments or sign sudden waivers to release owed compensation.",
  },
  {
    id: "urlta-leases",
    statuteName: "Uniform Residential Landlord and Tenant Act (URLTA)",
    jurisdiction: "Adopted in 21+ US States",
    category: "Indemnification",
    summary: "Limits landlord exculpatory clauses, restricts unilateral entry without 24-48 hours notice, and prohibits lease terms that force tenants to waive rights to trial or habitability.",
    howItProtectsYou: "Clauses that force tenants to hold landlords harmless for landlord negligence or structural defects are legally void and unenforceable in court.",
  },
  {
    id: "cra-uk-eu",
    statuteName: "Unfair Contract Terms Regulations (Consumer Protection)",
    jurisdiction: "UK / European Union / General Consumer Protection",
    category: "Limitation of Liability",
    summary: "Clauses that attempt to exclude liability for gross negligence, death, personal injury, or impose disproportionately high cancellation penalties are void.",
    howItProtectsYou: "Even if you signed a contract with an uncapped liability waiver or unilateral forfeiture, statutory consumer law automatically nullifies the unfair term.",
  },
  {
    id: "ftc-non-compete",
    statuteName: "Federal & State Non-Compete Doctrine",
    jurisdiction: "California, Minnesota, North Dakota, Oklahoma & Federal",
    category: "Non-Compete & Restrictive Covenants",
    summary: "Prohibits unreasonable post-employment or post-contract restrictions on a worker's freedom to earn a living in their trade or profession.",
    howItProtectsYou: "Broad 12-to-24 month non-compete clauses in independent contractor agreements are generally unenforceable as unlawful restraints on trade.",
  },
];
