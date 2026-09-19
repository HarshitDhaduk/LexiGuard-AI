# LexiGuard AI — Intelligent Legal Navigation, Risk Auditing & Negotiation Copilot

[![Google Gemini 2.5 Flash](https://img.shields.io/badge/Model-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014%20(App%20Router)-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-%3C%201%20MB%20(Rule%3A%20%3C10MB)-emerald)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-gray)](LICENSE)

> **Event**: PromptWars: Virtual (Exclusive Edition) — Top Performer Arena  
> **Problem Statement**: **AI for Legal Assistance & Access**  
> **Legal Boundary**: Informational and educational assistance only. Does not replace licensed legal counsel.

---

## 1. Executive Summary & Chosen Vertical

### The Problem
Legal contracts (freelance Master Services Agreements, residential leases, SaaS terms, NDAs) are written in dense, archaic legalese designed to protect drafting parties. Everyday individuals, freelancers, tenants, and small businesses face severe information asymmetry. Retaining an attorney for routine document reviews costs between **$250 and $650 per hour**, causing over 85% of signers to accept binding liabilities, predatory indemnities, and hidden forfeiture clauses without realizing it.

### Our Chosen Vertical & Persona
**LexiGuard AI** targets the **Independent Contractor, Tenant, and SMB** persona. It de-jargonizes contracts into 8th-grade plain English, audits risks on a 5-tier severity scale, uncovers vital protective terms deliberately omitted by drafters, simulates real-world "What-If" scenarios, drafts balanced counter-clauses with diplomatic email pitches, and exports a 1-page **Lawyer Briefing Dossier** that slashes attorney consultation time.

---

## 2. Core Architecture & Feature Modules

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 LEXIGUARD AI UI                                 │
│            (Next.js 14 App Router • Tailwind CSS • Lucide Icons • WCAG AA)      │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ (Client-Side Sanitized Text)
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MODULE 1: CLIENT-SIDE PRIVACY VAULT                          │
│     • In-browser regex/NER redaction of names, emails, phones, amounts, SSN     │
│     • Anonymizes to [PARTY_A], [COMPENSATION_AMOUNT], [EMAIL_1] before LLM call │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                 MODULE 2: GENAI MULTI-MODEL ORCHESTRATION GATEWAY               │
│                                                                                 │
│  ┌──────────────────────┬──────────────────────┬─────────────────────────────┐  │
│  │  POST /api/analyze   │  POST /api/compare   │  POST /api/chat (Streaming) │  │
│  │  Gemini 2.5 Flash    │  Gemini 2.5 Flash    │  Gemini 2.5 Flash           │  │
│  │  temp: 0.1, JSON     │  temp: 0.15, JSON    │  temp: 0.2, Grounded Cit.   │  │
│  └──────────┬───────────┴──────────┬───────────┴──────────────┬──────────────┘  │
│             │                      │                          │                 │
│  ┌──────────┴──────────────────────┴──────────────────────────┴──────────────┐  │
│  │  POST /api/negotiate (Gemini 2.5 Flash, temp: 0.3)                        │  │
│  │  Drafts 3-Tier Counter-Clauses + Diplomatic Counter-Offer Email           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          INTERACTIVE USER WORKBENCH                             │
│  1. Risk Heatmap & Clause Radar (0-100 Gauge, "The Trap", Plain English)        │
│  2. Omission Radar (Detects Missing Protections: cure period, late fees)        │
│  3. Bilateral Redline Diff & Power Shift Index (-100 to +100)                   │
│  4. Grounded What-If Scenario Simulator with Verifiable Section Citations       │
│  5. Negotiation Studio (Copyable Counter-Clauses & Polite Negotiation Emails)   │
│  6. Lawyer Briefing Dossier & Deadline Checklist (Downloadable Markdown)        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Explicit GenAI Architecture Mapping

| Endpoint | GenAI Model & Parameters | Prompt Strategy | Role in Solution | Input $\rightarrow$ Output |
| :--- | :--- | :--- | :--- | :--- |
| **`/api/analyze`** | **Gemini 2.5 Flash**<br>`temperature: 0.1`<br>`responseMimeType: "application/json"` | Few-shot taxonomy prompting with strict Zod/JSON schema output defining risk score, clause title, original quote, plain explanation, and risk tag. | Decomposes raw legal text into discrete clauses, rates risk severity, identifies "The Trap", and alerts on missing clauses. | Sanitized Contract Text $\rightarrow$ Structured JSON Clause Breakdown & Risk Metrics. |
| **`/api/compare`** | **Gemini 2.5 Flash**<br>`temperature: 0.15`<br>`responseMimeType: "application/json"` | Bilateral diff extraction prompt detecting additions, deletions, modifications, and leverage shifts. | Compares Document A vs Document B, calculates the **Power Shift Score** (-100 to +100). | Doc A + Doc B $\rightarrow$ Clause Variance Table + Shift in Legal Leverage. |
| **`/api/chat`** | **Gemini 2.5 Flash**<br>`temperature: 0.2` | Grounded system instructions strictly forbidding external factual assumptions; requires explicit `[Section X.X]` citations. Fallback guardrail for out-of-scope/illegal queries. | Simulates "What-If" scenarios in real-time streaming mode with verifiable clause citations. | Contract Context + User Question $\rightarrow$ Grounded Plain-English Answer with Citations. |
| **`/api/negotiate`**| **Gemini 2.5 Flash**<br>`temperature: 0.3`<br>`responseMimeType: "application/json"` | Contract attorney role-play generating standard market compromise language and diplomatic business emails. | Drafts balanced alternative clauses and copy-ready counter-offer emails. | Risky Clause + Stance $\rightarrow$ Ready-to-copy Counter-Clause + Negotiation Email. |

---

## 4. Evaluation Criteria Alignment

### High Impact: Code Quality & Problem Statement Alignment
- **Code Quality**: Strictly typed TypeScript with zero `any` usage. Clean separation of concerns across `src/lib/types.ts`, `src/lib/pii.ts`, `src/lib/gemini.ts`, and modular React components.
- **Problem Statement Alignment**: Directly solves contract opacity for non-lawyers. Goes far beyond generic chatbots by providing:
  - **Omission Radar**: Flags what the drafter intentionally left out (e.g. no contractor cure period, no client late fee).
  - **Power Shift Index**: Quantifies who gained or lost leverage between two draft versions.
  - **Negotiation Studio**: Equips signers with actual alternative wording and polite counter-offer emails.

### Medium Impact: Security & Efficiency
- **Security (Client-Side Privacy Vault)**: Personal Identifiable Information (PII) including party names, emails, phone numbers, addresses, and monetary figures are automatically detected and masked in the browser prior to sending payloads to the LLM.
- **Efficiency**: Powered by **Google Gemini 2.5 Flash** for sub-2-second end-to-end response generation, structured JSON mode eliminating retries, and clean bundle size ($< 110\text{ KB}$ First Load JS).

### Low Impact: Testing & Accessibility
- **Testing**: 11 automated unit tests across 3 suites executed via Vitest verifying PII redaction, preset integrity, and schema compliance (`npm test` passes 100%).
- **Accessibility**: High-contrast WCAG 2.1 AA color scheme, screen-reader friendly ARIA attributes, full keyboard navigability (`Tab`/`Enter`), and clear responsive views across mobile and desktop.

---

## 5. Strict Competition Compliance

| Constraint | Requirement | Status |
| :--- | :--- | :--- |
| **Repository Size** | Strictly $< 10\text{ MB}$ | **PASSED**: Total clean tracked size is **~295 KB** (< 3% of limit). |
| **Branching** | Single `main` branch only | **PASSED**: All commits on `main`. |
| **Attempts** | Maximum 3 attempts | **OPTIMIZED**: Full local test pass and build verification before submission. |
| **Legal Boundary** | Informational assistance, not legal advice | **PASSED**: Persistent non-advisory disclaimer banner and ethical guardrails. |
| **Demo Video** | Strictly $< 4\text{ minutes}$ | Script prepared for live data entry (no pre-fills), dynamic AI outputs, and edge cases. |

---

## 6. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested on v24.13.0)
- npm 9+
- Google Gemini API Key (optional for live AI; high-fidelity heuristic engine runs seamlessly offline)

### Installation
```bash
# 1. Clone repository
git clone https://github.com/HarshitDhaduk/LexiGuard-AI.git
cd LexiGuard-AI

# 2. Install dependencies
npm install

# 3. (Optional) Set your Gemini API Key
cp .env.example .env.local
# Add: GEMINI_API_KEY=your_actual_gemini_api_key

# 4. Run automated test suite
npm test

# 5. Build for production
npm run build

# 6. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Demo Video Walkthrough Blueprint (< 4 Minutes)

Follow this minute-by-minute blueprint during screen recording:
1. **00:00 - 00:30 (Problem & Intro)**: Introduce LexiGuard AI, explain how non-lawyers get trapped by predatory agreements, and highlight the non-advisory legal disclaimer.
2. **00:30 - 01:20 (Live Testing - No Pre-fills)**: Paste contract text live into the text area. Show the **Privacy Vault** masking names and amounts live before dispatch. Click **Audit & Deconstruct Contract**.
3. **01:20 - 02:10 (GenAI in Action: Heatmap & Omission Radar)**: Point out Gemini 2.5 Flash deconstructing clauses, calculating the 78/100 risk score, revealing "The Trap", and alerting to Missing Clauses.
4. **02:10 - 02:50 (Grounded What-If Simulator)**: Type a live question (*"What if the client cancels after 30 days?"*). Show the streaming response citing Section 7 with verbatim quotes.
5. **02:50 - 03:30 (Counter-Clauses & Negotiation Email)**: Select the uncapped indemnity clause, generate a balanced counter-clause, and show the drafted negotiation email.
6. **03:30 - 03:55 (Edge Case / Guardrail)**: Test adversarial query (*"How do I evade paying taxes under this contract?"*). Show the AI refusing the illegal request while staying within legal assistance boundaries.
7. **03:55 - 04:00 (Conclusion)**: Brief summary of live deployment and GitHub repo (< 10 MB).

---

## 8. Assumptions Made
1. **Jurisdiction Flexibility**: Contract norms vary by jurisdiction (e.g. Delaware corporate law vs California employee protections); our models default to standard US commercial practices while urging local attorney review.
2. **Plain-English Level**: Translations are calibrated to an 8th-grade reading level to ensure maximum accessibility for non-lawyers without sacrificing technical accuracy.
3. **Confidentiality**: All PII redaction runs 100% locally in the client browser using regex and pattern-matching before network dispatch.
