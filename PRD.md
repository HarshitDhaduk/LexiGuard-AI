# Product Requirements Document (PRD)

## Project Title: LexiGuard AI — Intelligent Legal Navigation, Risk Auditing & Negotiation Copilot
**Challenge:** PromptWars: Virtual (Exclusive Edition) — Top Performer Arena  
**Theme:** AI for Legal Assistance & Access  
**Target Delivery:** Live Deployed Prototype, GitHub Repository (< 10 MB), GenAI Architecture Map, Demo Walkthrough Video (< 4 mins)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
Legal documents (contracts, residential leases, non-disclosure agreements, freelance Master Service Agreements, SaaS terms of service) are deliberately drafted in dense, archaic legalese. Everyday individuals, freelancers, tenants, and small business owners face severe information asymmetry. Retaining legal counsel for routine document analysis costs between $250–$650 per hour—prohibitive for the vast majority of individuals. Consequently, over 85% of people sign binding legal agreements without understanding critical risks, hidden liabilities, predatory indemnities, or unilateral termination clauses.

### 1.2 The Solution
**LexiGuard AI** is a Generative AI-powered legal intelligence platform designed to democratize legal comprehension and basic pre-signature assistance without practicing law. It provides:
1. **Automated Clause Decomposition & Multi-Tier Risk Auditing**: Instantly highlights critical risks, predatory stipulations, unilateral liabilities, and hidden obligations with clear severity tags (Critical, High, Medium, Low, Safe).
2. **Plain-English Translation & Contextual Glossary**: De-jargonizes complex clauses into 8th-grade readable language with interactive term tooltips.
3. **Bilateral Contract & Policy Comparison Engine**: Side-by-side diff analyzer highlighting altered, omitted, or skewed clauses between two versions (e.g., standard vs. redlined MSA, previous vs. updated privacy policy).
4. **Grounded Document Q&A & "What-If" Scenario Simulator**: Verifiable question-answering strictly grounded in document text with exact citation links and scenario probing (e.g., *"What happens if client delays payment past 30 days?"*).
5. **Actionable Negotiation Playbook & Counter-Clause Drafter**: Provides fair, industry-standard counter-proposals with persuasive reasoning tailored to the user's bargaining position.
6. **Smart "Lawyer Dossier" Briefing Exporter**: Compiles structured summaries, identified risks, timeline of deadlines, and tailored questions for formal legal counsel, slashing billable consultation hours.
7. **Privacy-Preserving Client-Side PII Shield**: Automatically detects and masks Personally Identifiable Information (names, SSNs, financial figures, company identifiers) prior to LLM submission.

### 1.3 Legal & Ethical Boundary (Guardrails)
> **Legal Disclaimer & Boundary Enforcement**:  
> LexiGuard AI is an **informational and educational assistance platform**. It does **not** provide formal legal advice, legal representation, or attorney-client privilege. Every output carries clear jurisdictional disclaimers, confidence disclosures, and explicit reminders urging professional consultation for binding legal decisions.

---

## 2. Target Personas & Use Cases

| Persona | Key Pain Points | Primary Use Case in LexiGuard AI |
| :--- | :--- | :--- |
| **Freelancer / Independent Contractor** | Uncapped indemnity, broad IP assignment clauses, vague payment terms, unfair kill fees. | Upload client MSA/SOW $\rightarrow$ Run Risk Audit $\rightarrow$ Generate counter-clauses with balanced payment protection and retained IP rights. |
| **Tenant / Renter** | Sneaky security deposit forfeiture, landlord entry without notice, unilateral maintenance burdens, harsh early termination penalties. | Upload Residential Lease $\rightarrow$ Check compliance against tenant-rights norms $\rightarrow$ Generate question list for landlord negotiation. |
| **Everyday Consumer / Employee** | Broad non-compete covenants, arbitration waivers, auto-renewing subscriptions, invasive data privacy policies. | Upload employment offer or digital ToS $\rightarrow$ Plain English summary + "What-If" scenario simulation regarding post-employment restrictions. |
| **Small Business Owner / Operator** | Vendor lock-in, uncapped liabilities, missing SLAs, asymmetrical termination provisions. | Compare two vendor contracts $\rightarrow$ Generate redline variance report + Attorney Briefing Dossier. |

---

## 3. Core Functional Requirements & Feature Specifications

### Module 1: Document Ingestion & PII Shield
- **Supported Inputs**: Direct text paste, Markdown, PDF, and text upload.
- **Client-Side PII Redaction**:
  - Regex & NER-based masking of emails, phone numbers, dollar amounts, addresses, and party names before sending payloads to the GenAI endpoint.
  - Option for users to toggle redaction review (anonymized tokens like `[PARTY_A]`, `[MAX_LIABILITY_AMOUNT]`).
- **Sample Presets**: One-click preloaded documents (e.g., Predatory Freelance MSA, Harsh Residential Lease Agreement, SaaS Terms of Service) to enable zero-friction evaluation and live testing.

### Module 2: Clause Extraction & Multi-Tier Risk Heatmap
- Deconstructs legal text into semantic clauses (Indemnification, Limitation of Liability, Termination, Governing Law, IP Rights, Payment/Fees, Confidentiality, Non-Compete).
- Assigns severity scores:
  - 🔴 **Critical**: Uncapped liability, unilateral IP transfer without payment, forfeiture of basic rights.
  - 🟠 **High**: Strict non-competes, aggressive liquidated damages, short dispute notice windows.
  - 🟡 **Medium**: Unclear governing law, ambiguity in payment schedules, one-sided renewal clauses.
  - 🟢 **Safe / Standard**: Mutual confidentiality, standard force majeure, standard severance.
- Displays exact clause citations, "Why this is risky" explanation in plain English, and standard benchmark comparison.

### Module 3: Dual-Document Redline & Comparison Engine
- Compares two versions of a document or two competing vendor agreements.
- Produces:
  - **Clause-by-Clause Alignment Matrix** (Matched, Added, Deleted, Modified).
  - **Power Balance Shift Indicator**: Detects whether modifications shifted legal leverage toward Party A or Party B.
  - **Summary of Key Deviations**: Top 5 critical changes requiring immediate attention.

### Module 4: Grounded Document Q&A & "What-If" Scenario Simulator
- Conversational assistant strictly constrained to the ingested document content (Zero Hallucination mode with fallback: *"The provided document does not mention X"*).
- Exact citation highlighting: Every answer quotes line/clause references.
- **Scenario Simulator**: Pre-curated prompts & custom simulation queries:
  - *"What if I terminate this contract after 45 days?"*
  - *"What are my exact obligations if an NDA breach occurs?"*
  - *"Can the landlord enter my apartment without 24-hour advance notice?"*

### Module 5: Actionable Negotiation Playbook & Counter-Clause Generator
- Generates balanced, standard counter-clauses (e.g., converting unilateral indemnity into mutual indemnity capped at fees paid in prior 12 months).
- Generates **Tactful Negotiation Scripts**: Email/letter draft addressing the opposing party respectfully with commercial rationale.

### Module 6: Attorney Briefing Pack (The "Lawyer Dossier")
- Aggregates document metadata, key dates, detected high risks, user questions, and action items.
- Exports a clean, formatted Lawyer Briefing Document (Downloadable as PDF / Markdown) that users can hand directly to an attorney.

### Module 7: Obligation & Deadline Timeline Checklist
- Automatically extracts all temporal commitments:
  - Payment terms (e.g., Net 30, penalty after 15 days).
  - Notice periods (e.g., 60-day written notice prior to auto-renewal).
  - Deliverable milestones and cure periods.
- Interactive checklist UI with status toggles (Pending, Completed, Flagged).

---

## 4. GenAI Architecture & Integration Mapping

To satisfy the evaluation requirement for explicit GenAI service mapping:

```
+-------------------------------------------------------------------------------+
|                               LexiGuard AI UI                                 |
|          (React / Next.js / Tailwind CSS / Lucide / Accessible UI)            |
+---------------------------------------+---------------------------------------+
                                        | (Sanitized / Redacted Payload)
                                        v
+-------------------------------------------------------------------------------+
|                       LexiGuard GenAI Orchestration API                       |
|                       (/api/analyze, /api/compare, /api/chat)                 |
+---------------------------------------+---------------------------------------+
                                        |
        +-------------------------------+-------------------------------+
        |                               |                               |
        v                               v                               v
+-----------------------+   +-----------------------+   +-----------------------+
|    GenAI Service 1    |   |    GenAI Service 2    |   |    GenAI Service 3    |
|   Gemini 2.5 Flash    |   |   Gemini 2.5 Flash    |   |   Gemini 2.5 Flash    |
|    (Structured JSON   |   |   (Streaming Chat &   |   |    (Redline Diff &    |
|    Clause & Risk      |   |   Grounded Citation   |   |   Negotiation Counter |
|      Extractor)       |   |       Engine)         |   |         Drafter)      |
+-----------------------+   +-----------------------+   +-----------------------+
        |                               |                               |
        +-------------------------------+-------------------------------+
                                        v
+-------------------------------------------------------------------------------+
|                   Validation, Guardrail & JSON Schema Filter                  |
|    (Schema Validation, Confidence Scoring, Legal Disclaimer Enforcement)      |
+-------------------------------------------------------------------------------+
```

### Detailed GenAI Service Mapping Table

| GenAI Service / Endpoint | Model & Parameters | Prompt Strategy | Exact Role in Solution | Input -> Output |
| :--- | :--- | :--- | :--- | :--- |
| **Service A: Semantic Clause & Risk Auditor** (`/api/analyze`) | Google Gemini 2.5 Flash / Flash Lite<br>`temperature: 0.1`<br>`response_mime_type: "application/json"` | Few-shot taxonomy prompting with strict Zod/JSON schema output defining risk score, clause title, original quote, plain explanation, and risk tag. | Decomposes raw legal text into discrete clauses, rates risk severity, and creates the visual heatmap. | Raw Contract Text -> Structured Array of Analyzed Clauses with Risk Metadata. |
| **Service B: Grounded Q&A & Scenario Engine** (`/api/chat`) | Google Gemini 2.5 Flash<br>`temperature: 0.2`<br>Streaming enabled (SSE) | System instruction strictly forbidding external factual assumptions; requires explicit `[Clause X.X]` citations. Fallback triggers if unmentioned. | Answers user questions and executes "What-If" scenarios in real-time streaming mode. | Document Context + User Question -> Streamed Plain English Answer with Clause Citations. |
| **Service C: Redline & Discrepancy Analyzer** (`/api/compare`) | Google Gemini 2.5 Flash<br>`temperature: 0.15`<br>`response_mime_type: "application/json"` | Bilateral diff extraction prompt detecting additions, deletions, modifications, and leverage shifts. | Compares Document A vs. Document B, identifies subtle loopholes or altered liability terms. | Doc A + Doc B -> Clause Variance Table + Shift in Leverage Score. |
| **Service D: Counter-Clause & Playbook Generator** (`/api/negotiate`) | Google Gemini 2.5 Flash<br>`temperature: 0.3`<br>Structured Markdown / JSON | Role-based prompt as an experienced neutral contract negotiator recommending balanced, industry-standard compromise language. | Generates replacement counter-clauses and respectful negotiation scripts. | Risky Clause + User Stance -> Ready-to-use Counter-Clause + Email Pitch. |

---

## 5. Technical Architecture & Tech Stack

### 5.1 Technology Stack
- **Framework**: Next.js 14+ (App Router) / React 18+ with TypeScript.
- **Styling & UI**: Tailwind CSS, Shadcn-style accessible components, Lucide Icons.
- **GenAI SDK**: `@google/genai` or `@google/generative-ai` (Official Google GenAI SDK).
- **Document Parsing**: In-browser text parser, PDF.js / text extraction utilities.
- **State Management**: React Hooks (`useState`, `useReducer`, `useMemo`), LocalStorage persistence for user sessions.
- **Testing**: Vitest / Jest + React Testing Library for unit and component testing.
- **Deployment**: Vercel / Cloud Run with automated CI/CD and HTTPS.

### 5.2 Repository Hygiene & Size Management (< 10 MB Strict Rule)
- **Zero Heavy Assets in Git**: No large video files, no bulky PDFs, no unoptimized binary blobs.
- **Aggressive `.gitignore`**: Excludes `.next/`, `node_modules/`, `.turbo/`, `coverage/`, `.env*`.
- **Pre-commit Size Audit**: Script to verify total git tree size `< 10 MB` before push.
- **Single Branch Workflow**: All work maintained on `main` branch.

---

## 6. Evaluation Criteria Alignment Matrix

| Evaluation Parameter | Impact | How LexiGuard AI Delivers Excellence |
| :--- | :--- | :--- |
| **Code Quality** | **High Impact** | Clean TypeScript architecture, strict interface definitions, separation of concerns (API clients, prompt templates, UI components, custom hooks), modular utilities, linted with zero errors. |
| **Problem Statement Alignment** | **High Impact** | Directly empowers non-lawyers to understand, compare, and navigate complex contracts; adheres to ethical legal boundaries; delivers actionable outputs (checklists, counter-clauses, briefing packs). |
| **Security** | **Medium Impact** | Client-side PII redaction shield before sending text to LLMs, environment variable protection for API keys, strict input validation, prompt injection sanitization. |
| **Efficiency** | **Medium Impact** | Gemini Flash model utilization for ultra-fast latency (< 1.5s TTFT), server-sent event (SSE) streaming for instant UI feedback, JSON mode for deterministic parsing without retry loops. |
| **Testing** | **Low Impact** | Comprehensive unit test suite for PII redaction, prompt formatting, risk evaluation logic, and UI component rendering. |
| **Accessibility** | **Low Impact** | WCAG 2.1 AA compliance: high contrast color palettes, ARIA attributes for modals and accordions, keyboard navigable tabs, responsive mobile-friendly layouts. |

---

## 7. Product Roadmap & Phased Implementation Plan

- **Phase 1: Foundation & Architecture Setup**:
  - Initialize Next.js with TypeScript, Tailwind CSS, Lucide icons, and strict `.gitignore`.
  - Build UI layout with Accessible Tab Navigation, Legal Boundary Disclaimers, and Preset Selectors.
- **Phase 2: Core GenAI Services & PII Redaction**:
  - Implement client-side PII masking utility.
  - Implement `/api/analyze` with Gemini 2.5 Flash for clause risk classification.
  - Build the interactive Risk Heatmap and Plain-English translation view.
- **Phase 3: Deep Legal Assistance Features**:
  - Implement `/api/compare` for dual-document redline comparison and leverage shift index.
  - Implement `/api/chat` for grounded Q&A with real-time streaming and clause citations.
  - Implement `/api/negotiate` for counter-clause generation and negotiation email scripts.
  - Implement Lawyer Dossier compilation and Timeline / Obligation Checklist.
- **Phase 4: Quality, Verification & Delivery**:
  - Add comprehensive automated unit tests (`npm test`).
  - Perform repository size check (ensuring total repo < 10 MB).
  - Deploy to live hosting URL (Vercel / Cloud Run).
  - Record the < 4-minute demo walkthrough following the prompt testing guidelines.

---

## 8. Success Metrics & Demonstration Acceptance Criteria
1. **Zero Pre-fill Rule**: The demo video and live prototype allow live typing or pasting of arbitrary text with instantaneous, dynamic GenAI analysis.
2. **Deterministic Risk Rating**: Consistent risk tagging across predefined test fixtures.
3. **Citation Verifiability**: 100% of Q&A answers cite specific clause sections.
4. **Lightweight Footprint**: Repository size verified at under 5 MB (safely below 10 MB ceiling).
5. **Live Uptime**: Deployed URL publicly accessible with SSL/HTTPS.
