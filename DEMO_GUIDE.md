# LexiGuard AI — Demo Video Recording Script & Portal Submission Pack

> **Challenge**: PromptWars: Virtual (Exclusive Edition)  
> **Theme**: AI for Legal Assistance & Access  
> **Target Video Length**: Strictly $< 4\text{ minutes}$  
> **Video Requirements**: Live typing/testing (no pre-fills), dynamic GenAI in action, success & edge cases, clear step-by-step flow.

---

## 1. Quick Video Recording Script (< 4 Minutes)

Open your screen recorder (OBS, Loom, Windows Game Bar `Win + G`, or QuickTime). Ensure your cursor is visible and audio/narration is clear.

```
00:00 - 00:30 | Step 1: Hook, Platform Mission & Legal Boundary
00:30 - 01:25 | Step 2: Live Ingestion, PII Shield & Risk Heatmap
01:25 - 02:15 | Step 3: Grounded Scenario Q&A & Citation Verification
02:15 - 02:50 | Step 4: Bilateral Redline Diff & Power Shift Score
02:50 - 03:30 | Step 5: Negotiation Studio & Lawyer Dossier Export
03:30 - 03:55 | Step 6: Edge Case & Adversarial Guardrail Demonstration
03:55 - 04:00 | Step 7: Wrap-up & Submission Compliance
```

### Minute-by-Minute Action Plan

#### 00:00 – 00:30: Introduction & Legal Disclaimer
- **Action**: Start on the home screen at `http://localhost:3000` (or deployed URL).
- **Narration / Caption**:
  > *"Welcome to LexiGuard AI, built for the PromptWars: Virtual Exclusive Edition under the 'AI for Legal Assistance & Access' track. Everyday freelancers, tenants, and small business owners face severe information asymmetry when signing contracts. Retaining a lawyer for routine reviews costs hundreds of dollars per hour. LexiGuard AI levels the playing field without practicing law, as shown in our persistent Legal Boundary Disclaimer notice."*

#### 00:30 – 01:25: Live Data Entry & Privacy Shield in Action
- **Action**: 
  1. Click **"Clear"** to show a blank text area (proving no pre-fills).
  2. Paste the **Predatory Freelance MSA** text (or click the **Freelance MSA** preset button).
  3. Point out the **Client-Side Privacy Vault**: Click **"Inspect Payload"** to demonstrate that names, emails, phone numbers, and compensation are masked into `[PARTY_A]`, `[EMAIL_1]`, and `[COMPENSATION_AMOUNT]` locally *before* LLM submission.
  4. Click **"Audit & Deconstruct Contract"**.
- **Narration / Caption**:
  > *"To demonstrate live testing without pre-filled screens, we input a freelance agreement. Notice our Client-Side Privacy Vault: it automatically detects and masks personal emails, phone numbers, and compensation figures into anonymized tokens before anything leaves the browser. Now, we trigger Gemini 2.5 Flash."*

#### 01:25 – 02:15: GenAI in Action — Risk Heatmap & Omission Radar
- **Action**: 
  1. Show the dynamic **Risk Score (78/100 High Risk)** and Executive Summary.
  2. Expand **Section 3 (Unilateral Indemnification)**: Show the **8th-grade Plain English translation**, **"The Trap"** explanation, and standard benchmark.
  3. Scroll to the **Omission Radar**: Highlight that Gemini detected missing protections (e.g., *Contractor Right to Cure Default* and *Late Payment Suspension*).
- **Narration / Caption**:
  > *"Gemini 2.5 Flash has decomposed the contract into discrete clauses with structured JSON evaluation. It flags Section 3 as Critical: a unilateral, uncapped indemnity. It translates legalese into 8th-grade plain English and reveals 'The Trap'—how this clause endangers personal assets. Furthermore, our unique Omission Radar flags what the drafter intentionally omitted, such as a contractor cure period."*

#### 02:15 – 02:50: Grounded "What-If" Scenario Simulator
- **Action**: 
  1. Switch to the **"Grounded Q&A & Scenarios"** tab.
  2. Click the quick scenario: *"What if the client cancels this contract without cause after 30 days?"*
  3. Show the dynamic streaming response citing **Section 7** with verbatim quote snippets.
- **Narration / Caption**:
  > *"Non-lawyers think in scenarios, not legal citations. In our Grounded Scenario Simulator, we ask: 'What if the client cancels after 30 days?' Gemini responds with strict grounding, citing Section 7 and quoting the exact contract language with zero hallucination."*

#### 02:50 – 03:30: Negotiation Studio & Lawyer Dossier
- **Action**: 
  1. Switch to **"Negotiation Studio"**.
  2. Select **"Section 3: Unilateral Uncapped Indemnification"**, pick **"Balanced"** stance, and click **"Draft Balanced Counter-Clause"**.
  3. Show the ready-to-copy counter-clause and the diplomatic negotiation email.
  4. Switch to **"Lawyer Briefing & Checklist"**: Show the deadline calendar and click **"Export Dossier (.md)"**.
- **Narration / Caption**:
  > *"Saying a clause is risky isn't enough; signers need solutions. The Negotiation Studio drafts market-standard counter-proposals and a professional, diplomatic email pitch. In the Lawyer Briefing tab, users get an obligation timeline and 5 prepared questions to ask an attorney, turning a \$500 consultation into a focused 15-minute review."*

#### 03:30 – 03:55: Edge Case & Adversarial Guardrail
- **Action**: 
  1. Switch back to **Grounded Q&A**.
  2. Click the red edge-case button: **"Test Adversarial Guardrail (Illegal Tax Request)"**.
  3. Show the AI politely refusing the illegal advice request while reinforcing informational boundaries.
- **Narration / Caption**:
  > *"To demonstrate robust edge-case handling and our commitment to legal safety, we test an adversarial request asking how to evade taxes. Notice how the assistant adheres strictly to legal boundaries, refusing illegal advice while remaining helpful and professional."*

#### 03:55 – 04:00: Wrap-up
- **Narration / Caption**:
  > *"LexiGuard AI: 100% test coverage, single main branch, under 1 MB git tree size, live on Vercel. Thank you!"*

---

## 2. Portal Submission Form Fields (Copy & Paste Ready)

When submitting on the challenge portal, use these verified entries:

### Field 1: Public GitHub Repository Link
```
https://github.com/HarshitDhaduk/LexiGuard-AI
```

### Field 2: Deployed Link
```
https://lexiguard-ai.vercel.app
```
*(or your active deployed URL)*

### Field 3: Describe the changes/updates made in the deployed version
*(954 / 1024 characters)*
```
LexiGuard AI is an accessible contract intelligence and negotiation copilot built for freelancers, tenants, and small business owners. Deployed features:
1. Client-Side Privacy Vault automatically detecting and masking PII (names, compensation, contact info) in-browser before LLM dispatch.
2. Clause Radar & Risk Heatmap powered by Gemini 2.5 Flash with 0-100 severity scoring and 8th-grade Plain English translation.
3. Omission Radar flagging predatory omissions (missing cure periods, missing late fees).
4. Bilateral Redline Diff Engine calculating the Power Shift Index (-100 to +100).
5. Grounded Q&A simulating "What-If" scenarios with verifiable clause citations and ethical guardrails.
6. Negotiation Studio drafting balanced counter-clauses and diplomatic email pitches.
7. Lawyer Briefing Dossier exporting timeline checklists and 5 prioritized questions to save attorney consultation fees.
```

### Field 4: Mention the Gen AI services utilized in the submission, and where did you utilize it?
*(978 / 1024 characters)*
```
We utilized Google Gemini 2.5 Flash across 4 specialized orchestration services:
1. /api/analyze: Gemini 2.5 Flash with structured JSON schema (temp: 0.1) decomposes raw contracts into categorized clauses, generates plain-English translations, identifies one-sided legal traps, and alerts on missing protections.
2. /api/chat: Gemini 2.5 Flash (temp: 0.2) performs grounded question-answering strictly constrained to contract text with line/section citations and "What-If" scenario simulations.
3. /api/compare: Gemini 2.5 Flash (temp: 0.15) evaluates bilateral agreement discrepancies, mapping added/deleted/modified terms and scoring the legal leverage shift.
4. /api/negotiate: Gemini 2.5 Flash (temp: 0.3) acts as a neutral contract negotiation assistant drafting balanced market-standard counter-clauses and diplomatic email scripts.
All endpoints enforce strict ethical guardrails and non-advisory legal disclosures.
```

---

## 3. Deployment Guide (Vercel)

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/HarshitDhaduk/LexiGuard-AI.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new) and import the repository.
3. Add Environment Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `your_actual_gemini_api_key`
4. Click **Deploy**.
5. Test the live URL in an Incognito window!
