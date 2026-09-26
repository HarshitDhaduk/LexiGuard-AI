/**
 * User Persona & Context Profiles for LexiGuard AI
 * Implements context-aware decision making tailored to non-lawyer personas:
 * 1. Freelancers & Independent Contractors
 * 2. Residential Tenants & Renters
 * 3. Small Business Owners & SMB Operators
 * 4. Everyday Consumers & Employees
 */

export type PersonaId = "freelancer" | "tenant" | "small_business" | "consumer";

export interface PersonaChecklistItem {
  id: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface PersonaProfile {
  id: PersonaId;
  name: string;
  badge: string;
  tagline: string;
  roleTitle: string;
  iconName: "Briefcase" | "Home" | "Building2" | "User";
  primaryInterests: string[];
  watchOutTraps: string[];
  suggestedQuestions: string[];
  benchmarkFocus: string;
  matchingPresetId: string;
  checklistItems: PersonaChecklistItem[];
}

export const PERSONA_PROFILES: Record<PersonaId, PersonaProfile> = {
  freelancer: {
    id: "freelancer",
    name: "Freelancer / Contractor",
    badge: "Solo Professional",
    tagline: "Protect your intellectual property, payment terms, and independent contractor status.",
    roleTitle: "Independent Contractor / Consultant",
    iconName: "Briefcase",
    primaryInterests: [
      "IP carve-outs for personal background tools & code",
      "Net-15 / Net-30 payment with statutory late interest",
      "Mutual liability caps tied to contract earnings",
      "Narrow non-solicitation (no broad non-compete)",
    ],
    watchOutTraps: [
      "Unilateral uncapped indemnification for third-party claims",
      "Overbroad 'work-for-hire' seizing personal libraries",
      "Net-90 payment cycles with no remedies for non-payment",
      "Worldwide non-compete covenants preventing future work",
    ],
    suggestedQuestions: [
      "Can I be terminated immediately without cause or payment?",
      "Does this contract claim ownership over my pre-existing code and tools?",
      "What is my maximum financial liability if the client gets sued?",
      "Are there any non-compete restrictions preventing me from taking other clients?",
    ],
    benchmarkFocus:
      "Contractor Benchmark: Mutual indemnity capped at 12-month fees, Net-30 payment with 1.5% late fee, explicit retained background IP.",
    matchingPresetId: "freelance-predatory-msa",
    checklistItems: [
      {
        id: "fl-liability-cap",
        title: "1. Cap Unilateral Liabilities to Aggregate Fees Paid",
        description: "Ensure your exposure to damages cannot exceed the total amount earned under the contract.",
        recommendation: "Replace 'unlimited liability' with 'total aggregate liability shall not exceed the fees paid in the preceding 12 months'.",
      },
      {
        id: "fl-cure-period",
        title: "2. Insert 14–30 Day Written Notice & Cure Window",
        description: "Prevent immediate arbitrary termination or breach claims without an opportunity to rectify the issue.",
        recommendation: "Require that either party provide at least 14 days written notice specifying any alleged breach before terminating.",
      },
      {
        id: "fl-payment-terms",
        title: "3. Lock in Net-30 Payment Milestones & Late Penalties",
        description: "Eliminate vague 'upon client satisfaction' payment delays and safeguard against unpaid labor.",
        recommendation: "Include explicit Net 30 terms, milestone schedules, and a 1.5% monthly late fee for overdue invoices.",
      },
      {
        id: "fl-ip-transfer",
        title: "4. Condition IP Transfer on Full Payment Clearance",
        description: "Retain ownership of your creative work product and code until all associated invoices have cleared.",
        recommendation: "Add: 'Ownership of deliverables transfers to Client strictly and only upon receipt of full payment.'",
      },
      {
        id: "fl-non-compete",
        title: "5. Narrow or Strike Worldwide Non-Compete Covenants",
        description: "Prevent restrictions that unlawfully limit your right to earn a livelihood in your industry.",
        recommendation: "Replace non-competes with a standard 12-month non-solicitation of direct client employees.",
      },
    ],
  },

  tenant: {
    id: "tenant",
    name: "Tenant / Renter",
    badge: "Residential Lessee",
    tagline: "Safeguard your security deposit, right to privacy, and landlord maintenance duties.",
    roleTitle: "Residential Tenant / Lessee",
    iconName: "Home",
    primaryInterests: [
      "24 to 48-hour mandatory advance written notice before landlord entry",
      "Itemized security deposit return with normal wear-and-tear protection",
      "Landlord statutory warranty of habitability (heating, plumbing, roof)",
      "Reasonable early lease break terms with landlord duty to mitigate damages",
    ],
    watchOutTraps: [
      "Automatic full forfeiture of security deposits for minor paint scuffs",
      "Unrestricted landlord entry at any hour without notice",
      "Shifting repairs under $1,000 to tenant regardless of pre-existing condition",
      "Punitive 4-month rent acceleration penalties for early lease termination",
    ],
    suggestedQuestions: [
      "Under what conditions can the landlord enter without my advance permission?",
      "What specific wear and tear can cause forfeiture of my security deposit?",
      "Am I financially responsible for pre-existing plumbing or heating failures?",
      "What is the penalty if I need to relocate before the lease term ends?",
    ],
    benchmarkFocus:
      "Tenant Rights Benchmark: 24-hr advance written entry notice, statutory deposit accounting within 21 days, landlord responsibility for major repairs.",
    matchingPresetId: "residential-lease-harsh",
    checklistItems: [
      {
        id: "tn-entry-notice",
        title: "1. Demand 24-Hour Advance Written Entry Notice",
        description: "Ensure the landlord cannot enter your home without reasonable advance written notification.",
        recommendation: "Confirm the lease states: 'Landlord shall provide at least 24 hours advance written notice prior to entry, except in bona fide emergencies.'",
      },
      {
        id: "tn-deposit-return",
        title: "2. Protect Deposit Against Normal Wear and Tear",
        description: "Prevent arbitrary deposit forfeiture for pre-existing scuffs, nail holes, or carpet fading.",
        recommendation: "Ensure deductions require itemized receipts and exclude standard residential wear and tear.",
      },
      {
        id: "tn-habitability",
        title: "3. Confirm Landlord Warranty of Habitability",
        description: "Ensure vital systems (heat, water, electricity, structural repairs) are legally the landlord's duty.",
        recommendation: "Strike any clause attempting to shift plumbing or structural repair costs under $1,000 to the tenant.",
      },
      {
        id: "tn-early-term",
        title: "4. Cap Early Termination to 1–2 Months with Mitigation",
        description: "Prevent 4-month rent acceleration penalties if life circumstances force you to move.",
        recommendation: "Seek a 1-to-2 month lease break fee alongside the landlord's statutory duty to re-rent the unit.",
      },
      {
        id: "tn-guest-rules",
        title: "5. Review Guest and Occupancy Restrictions",
        description: "Ensure temporary guests do not trigger automatic daily fines or unauthorized tenant accusations.",
        recommendation: "Verify reasonable guest stays (e.g., up to 14 consecutive days) are permitted without landlord approval.",
      },
    ],
  },

  small_business: {
    id: "small_business",
    name: "Small Business / SMB",
    badge: "Commercial Operator",
    tagline: "Defend your margins, prevent vendor lock-in, and manage commercial liability.",
    roleTitle: "Small Business Owner / Operator",
    iconName: "Building2",
    primaryInterests: [
      "Consequential damage waivers & bilateral liability caps",
      "Service Level Agreement (SLA) uptime commitments and billing credits",
      "Exit rights without punitive liquidated damages or hidden auto-renewals",
      "Strict confidentiality protections and audit boundaries",
    ],
    watchOutTraps: [
      "Asymmetric liability caps ($100 cap for vendor, uncapped for your business)",
      "Silent 12-month auto-renewals with narrow 60-day cancellation windows",
      "Unilateral price increases with only 3 days advance notice",
      "Broad indemnities extending to third-party vendor errors",
    ],
    suggestedQuestions: [
      "Is the limitation of liability reciprocal or heavily asymmetric?",
      "How many days notice must I give to prevent automatic contract renewal?",
      "What remedies or fee credits do I receive if the vendor suffers an outage?",
      "Can the vendor raise prices unilaterally during the active subscription term?",
    ],
    benchmarkFocus:
      "B2B Commercial Benchmark: Bilateral liability cap at 12-month fees paid, 30-day non-renewal window, mutual SLA uptime credits of 99.9%.",
    matchingPresetId: "freelance-predatory-msa",
    checklistItems: [
      {
        id: "sb-bilateral-cap",
        title: "1. Enforce Bilateral Limitation of Liability",
        description: "Ensure the vendor's liability is not capped at $100 while your company faces unlimited exposure.",
        recommendation: "Require mutual liability caps set to fees paid under the agreement in the preceding 12 months.",
      },
      {
        id: "sb-renewal-notice",
        title: "2. Flag Automatic Contract Renewal Windows",
        description: "Prevent being locked into an unwanted 12-month extension due to a missed 60-day cancellation deadline.",
        recommendation: "Require the vendor to provide written reminder notice at least 30 days prior to any automatic renewal.",
      },
      {
        id: "sb-sla-remedies",
        title: "3. Verify Service Level Agreements (SLAs) & Credits",
        description: "Ensure you have financial remedies if critical vendor infrastructure fails or experiences downtime.",
        recommendation: "Incorporate SLA uptime targets (e.g. 99.9%) with proportional monthly invoice service credits.",
      },
      {
        id: "sb-price-protection",
        title: "4. Cap Annual Price Increases to CPI / 5%",
        description: "Prevent sudden unilateral fee hikes during the active contract period.",
        recommendation: "Limit price increases to no more than once per year, capped at 5% or the Consumer Price Index (CPI).",
      },
      {
        id: "sb-data-ownership",
        title: "5. Retain Absolute Data Ownership and Portability",
        description: "Ensure all business records and customer data can be exported in standard formats upon termination.",
        recommendation: "Mandate complete data return or destruction within 30 days of contract conclusion with zero retention.",
      },
    ],
  },

  consumer: {
    id: "consumer",
    name: "Consumer / Everyday Signer",
    badge: "Digital Consumer",
    tagline: "Understand user agreements, protect personal data, and preserve legal rights.",
    roleTitle: "Consumer / Platform User",
    iconName: "User",
    primaryInterests: [
      "Data privacy rights (opt-out of AI training on uploaded private files)",
      "Right to cancel recurring subscriptions easily without hidden charges",
      "Preservation of dispute resolution rights (rejection of unfair fee shifting)",
      "Notice of unilateral modifications to terms of service",
    ],
    watchOutTraps: [
      "Perpetual, irrevocable license to train AI on personal user data",
      "Forced individual arbitration with one-sided legal fee reimbursement",
      "Class action waiver stripping collective dispute rights",
      "Unilateral modifications taking effect immediately upon posting",
    ],
    suggestedQuestions: [
      "Does this service claim rights to train commercial AI models on my data?",
      "Can I participate in a class action if there is a massive data breach?",
      "What happens if I lose an arbitration dispute against the company?",
      "Can the provider increase fees without my explicit prior consent?",
    ],
    benchmarkFocus:
      "Consumer Protection Benchmark: Opt-in data training consent, bilateral arbitration fee limits, standard 30-day cancellation rights.",
    matchingPresetId: "saas-terms-invasive",
    checklistItems: [
      {
        id: "cs-ai-training",
        title: "1. Opt Out of AI Model Training on Personal Content",
        description: "Prevent platforms from commercializing your private uploaded documents, code, or personal data.",
        recommendation: "Ensure terms specify user data will not be used for machine learning or foundation model training.",
      },
      {
        id: "cs-arbitration-fees",
        title: "2. Strike One-Sided Legal Fee Reimbursement in Arbitration",
        description: "Prevent clauses requiring you to pay the corporation's legal bills if your consumer complaint fails.",
        recommendation: "Ensure each party pays their own legal fees unless a claim is proven frivolous under applicable law.",
      },
      {
        id: "cs-auto-renewal",
        title: "3. Verify 1-Click Subscription Cancellation Mechanism",
        description: "Ensure cancellation is as simple as signing up, compliant with FTC 'Click-to-Cancel' standards.",
        recommendation: "Confirm you can cancel directly in your online account settings without phone calls or certified mail.",
      },
      {
        id: "cs-unilateral-changes",
        title: "4. Require Material Notice for Term Modifications",
        description: "Prevent providers from altering contract terms overnight without your knowledge or consent.",
        recommendation: "Demand at least 30 days prior email notice for any material modifications or fee increases.",
      },
      {
        id: "cs-data-deletion",
        title: "5. Ensure Account Deletion and Privacy Rights",
        description: "Verify your right to request complete deletion of personal records under CCPA/GDPR principles.",
        recommendation: "Confirm the privacy policy guarantees full data deletion upon user account closure.",
      },
    ],
  },
};

export function getPersonaProfile(id: PersonaId): PersonaProfile {
  return PERSONA_PROFILES[id] || PERSONA_PROFILES.freelancer;
}
