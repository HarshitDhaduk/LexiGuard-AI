# Challenge Execution Guidelines & Instructions

**Event**: PromptWars: Virtual (Exclusive Edition) — Invite-Only Arena  
**Track**: AI for Legal Assistance & Access  
**Target Solution**: LexiGuard AI  
**Document Purpose**: Developer & Submission Playbook for 100% Compliance and Evaluation Excellence  

---

## 1. Challenge Overview & Critical Rules

### 1.1 Non-Negotiable Submission Rules
| Rule | Requirement | Consequence of Failure |
| :--- | :--- | :--- |
| **Max Attempts** | **Maximum 3 attempts allowed** on the submission portal | Wasted submissions permanently close your evaluation window. |
| **Repo Size** | **Strictly < 10 MB** (measured via git tree & total repo size) | AI Evaluator tool rejects repository; immediate disqualification. |
| **Branching** | **Single Branch Only** (`main`) | Submissions with multiple branches fail automated git evaluation. |
| **Visibility** | **Public Access is Mandatory** | Private or restricted links cannot be cloned by the evaluator. |
| **Deployed Prototype** | **Working Live URL** (Vercel / Cloud Run / Firebase) | Inactive or 404 links cause zero marks in live testing tier. |
| **Video Duration** | **Strictly < 4 minutes** | Videos over 4 minutes will not be processed by the evaluator. |
| **Legal Boundary** | **Explicit Disclaimer & Non-Advisory Guardrail** | Solutions pretending to be a licensed attorney will be penalized. |

---

## 2. Evaluation Parameter Alignment Strategy

The AI Evaluator grades across three impact tiers:

### 2.1 High Impact (Top Priority — Drives the Core Score)
1. **Code Quality**:
   - Clean, modular Next.js / React + TypeScript architecture.
   - Strict typing across all data interfaces (no `any`).
   - Zero console errors, warnings, or dead code.
   - Comprehensive docstrings and architectural comments explaining design patterns.
   - Clean separation of UI, API routes, GenAI orchestration, and client utilities.
2. **Problem Statement Alignment**:
   - Solves real-world legal accessibility for non-lawyers (freelancers, tenants, small businesses, consumers).
   - Core features: Clause risk breakdown, plain-English translation, side-by-side contract comparison, grounded Q&A with citations, counter-clause generation, and lawyer briefing packs.
   - Strong domain accuracy without overstepping into unauthorized legal advice.

### 2.2 Medium Impact (Solidifies High Standing)
1. **Security**:
   - Client-side PII detection and redaction shield (masks emails, phone numbers, SSNs, monetary amounts before sending to LLM).
   - API key security via backend environment variables (`GEMINI_API_KEY`).
   - Safe prompt engineering with prompt injection prevention and strict JSON schema parsing.
2. **Efficiency**:
   - Ultra-low latency through Google Gemini 2.5 Flash.
   - Server-Sent Events (SSE) streaming for real-time response generation.
   - Efficient state management and in-memory memoization to prevent redundant API queries.

### 2.3 Low Impact (Polish Needed for Perfect Score)
1. **Testing**:
   - Automated unit test suite (`npm test`) covering PII redaction, prompt sanitization, risk heuristics, and UI component behavior.
2. **Accessibility**:
   - WCAG 2.1 AA compliant colors, proper ARIA labels, full keyboard navigation support, and responsive layouts.

---

## 3. Git & Repository Hygiene Protocol (< 10 MB Enforced)

### 3.1 Strict `.gitignore` Setup
To prevent repository size bloat, ensure the following is never committed:
```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing & Coverage
coverage/
*.lcov

# Next.js Build Output
.next/
out/
build/
dist/

# Environment Variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs & OS artifacts
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
Thumbs.db
*.tsbuildinfo

# Media & Large Files
*.mp4
*.mov
*.zip
*.tar.gz
*.pdf
```

### 3.2 Verification Command for Repo Size
Run this PowerShell command in the repository root before any push:
```powershell
# Check git pack size
git count-objects -vH
# Check working directory size excluding node_modules and .next
Get-ChildItem -Recurse -Exclude node_modules,.next,.git | Measure-Object -Property Length -Sum
```
**Acceptable threshold**: `< 5 MB` (safely below the 10 MB limit).

### 3.3 Single Branch Enforcement
```powershell
# Always stay on main
git checkout -B main
# Check active branches (should only show 'main')
git branch
```

---

## 4. Video Recording Blueprint (< 4 Minutes)

The demo video is processed directly by the evaluation engine. Follow this exact minute-by-minute timeline:

```
00:00 - 00:35 (35s) : Hook, Problem & Legal Boundary Disclaimer
00:35 - 01:25 (50s) : Core Flow 1 — Live Text Ingestion, PII Redaction & Multi-Tier Risk Heatmap
01:25 - 02:15 (50s) : Core Flow 2 — Grounded Q&A with Clause Citations & "What-If" Scenario Simulation
02:15 - 02:55 (40s) : Core Flow 3 — Dual-Document Redline Diff & Power Shift Analysis
02:55 - 03:30 (35s) : Core Flow 4 — Counter-Clause Drafter & Lawyer Dossier Export
03:30 - 03:55 (25s) : Edge Case & Error Handling Demonstration (Input validation / prompt injection)
03:55 - 04:00 (05s) : Closing & Submission Summary
```

### Critical Rules for Video Recording:
1. **Live Testing — No Pre-fills**:
   - Do **not** record a screen that is already populated.
   - Type or paste the legal contract live into the text box.
   - Show the loading/streaming indicator and watch the dynamic output appear.
2. **Explicit GenAI Highlights**:
   - Visually point out where Gemini 2.5 Flash is invoked.
   - Mention the structured JSON extraction and streaming SSE tokens.
3. **Show Both Success & Edge Cases**:
   - **Success case**: Full analysis of a harsh freelance contract with critical risk flags.
   - **Edge case / Safety**: User asks an out-of-scope question (e.g., *"How do I evade taxes on this invoice?"*) and the assistant demonstrates principled guardrails refusing to give illegal advice while citing the contract.
4. **Host Platforms**:
   - YouTube (Unlisted or Public).
   - Google Drive (set permissions to **"Anyone with the link can view"**).
   - Test in an Incognito window before submitting!

---

## 5. Submission Portal Form Fields Reference

When ready to submit on the challenge portal, use the exact data outlined below:

### Field 1: Public GitHub Repository Link
- Format: `https://github.com/<username>/<repo-name>`
- Verify: Accessible without login, single `main` branch, `< 10 MB`.

### Field 2: Deployed Link
- Format: `https://lexiguard-ai.vercel.app` (or active Cloud Run/Firebase domain).
- Verify: Loads over HTTPS with working backend GenAI routes.

### Field 3: Describe the changes/updates made in the deployed version
*Character count: Up to 1024 chars*
> LexiGuard AI is a full-stack Next.js/TypeScript legal intelligence platform built for non-lawyers (freelancers, tenants, SMBs). Updates deployed:
> 1. Real-time Semantic Clause & Risk Auditor powered by Gemini 2.5 Flash with multi-tier severity tagging (Critical, High, Medium, Low, Safe).
> 2. Client-side PII Redaction Shield automatically masking emails, phone numbers, and monetary figures before LLM ingestion.
> 3. Bilateral Redline Contract Diff Engine identifying predatory clause drift and power-balance shifts between two agreement versions.
> 4. Zero-Hallucination Grounded Q&A and "What-If" Scenario Simulator with verbatim clause citations.
> 5. One-Click Negotiation Playbook generating balanced counter-clauses and email proposals.
> 6. Automated Lawyer Briefing Dossier and Timeline Checklist exporter.
> Fully tested with Vitest, WCAG 2.1 AA accessible, and optimized with streaming responses.

### Field 4: Mention the Gen AI services utilized in the submission, and where did you utilize it?
*Character count: Up to 1024 chars*
> We utilized Google Gemini 2.5 Flash across 4 dedicated, specialized orchestration services:
> 1. /api/analyze: Gemini 2.5 Flash with structured JSON schema (`temperature: 0.1`) decomposes raw contracts into categorized clauses, generates plain-English translations, and assigns calibrated risk severity scores.
> 2. /api/chat: Gemini 2.5 Flash with Server-Sent Events (SSE) streaming (`temperature: 0.2`) performs grounded question-answering strictly constrained to contract text with line citations and "What-If" scenario simulations.
> 3. /api/compare: Gemini 2.5 Flash (`temperature: 0.15`) evaluates bilateral agreement discrepancies, mapping added/deleted/modified terms and scoring the legal leverage shift.
> 4. /api/negotiate: Gemini 2.5 Flash (`temperature: 0.3`) acts as a neutral negotiation assistant to draft balanced, market-standard counter-clauses and diplomatic email scripts.
> All prompts feature strict safety guardrails, PII redaction tokens, and legal boundary disclosures.

---

## 6. Development Workflow Checklist

- [ ] **Step 1**: Initialize Next.js 14 project with TypeScript & Tailwind CSS.
- [ ] **Step 2**: Configure `.gitignore` and verify single `main` git branch.
- [ ] **Step 3**: Implement Client-Side PII Redaction Shield (`src/lib/pii.ts`).
- [ ] **Step 4**: Implement Gemini 2.5 Flash API routes (`/api/analyze`, `/api/chat`, `/api/compare`, `/api/negotiate`).
- [ ] **Step 5**: Build UI components:
  - Navigation & Legal Boundary Disclaimer Banner.
  - Document Input Area with sample presets (Freelance MSA, Rental Lease, SaaS ToS).
  - Clause Breakdown & Risk Heatmap View.
  - Plain-English Translation & Glossary Tooltip.
  - Side-by-Side Dual-Document Diff Inspector.
  - Grounded Streaming Q&A & Scenario Simulator.
  - Counter-Clause Negotiation Studio.
  - Lawyer Briefing Dossier Exporter & Milestone Checklist.
- [ ] **Step 6**: Add automated test suite with Vitest (unit tests for redaction, risk mapping, prompt formatting).
- [ ] **Step 7**: Conduct Accessibility Audit (ARIA labels, keyboard focus, contrast).
- [ ] **Step 8**: Deploy to live URL (Vercel / Cloud Run) and verify environment variables.
- [ ] **Step 9**: Audit repository size (`< 10 MB`) and commit history.
- [ ] **Step 10**: Record < 4-minute demo walkthrough video showing live typing, GenAI streaming, success + edge cases.
- [ ] **Step 11**: Submit on portal and verify evaluation status.
