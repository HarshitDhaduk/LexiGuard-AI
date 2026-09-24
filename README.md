# LexiGuard AI

> **AI for Legal Assistance & Access**  
> An accessible contract intelligence and negotiation copilot built for freelancers, tenants, and small business owners.  
> Powered by Google Gemini 2.5 Flash, Next.js 14, and client-side privacy architecture.

[![CI Pipeline](https://github.com/HarshitDhaduk/LexiGuard-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/HarshitDhaduk/LexiGuard-AI/actions/workflows/ci.yml)
[![Live Application](https://img.shields.io/badge/Live%20Demo-lexiguard--ai--phi.vercel.app-4285F4)](https://lexi-guard-ai-phi.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WCAG 2.1 AAA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AAA-brightgreen)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Tests](https://img.shields.io/badge/Tests-88%20Passing-success)](tests/)

---

## Why We Built LexiGuard AI

Most people who sign a contract have never read it all the way through—not because they are careless, but because legal contracts are deliberately written in an intimidating, asymmetric dialect. 

Whether you are a freelance developer signing a client agreement, a tenant signing a residential lease, or a small shop owner signing a SaaS vendor contract, retaining an attorney for a routine 5-page document review costs between **$250 and $650 per hour**. As a result, over 85% of people sign contracts containing hidden indemnity traps, unilateral IP forfeitures, and uncapped liability terms without knowing what they agreed to.

**LexiGuard AI** was designed to level this playing field. It translates dense legal jargon into 8th-grade Plain English, highlights predatory traps, uncovers terms that the other party deliberately left out, and helps users negotiate fair, standard terms—all while keeping sensitive private data safely inside their browser.

> **Important Legal Boundary**: LexiGuard AI is an informational tool for de-jargonizing contracts and understanding risk. It is not a law firm and does not provide formal legal counsel or create an attorney-client relationship.

---

## What the App Does

LexiGuard provides a focused, end-to-end legal navigation workflow:

1. **Client-Side Privacy Vault**: Before any contract text is sent to an AI model, our in-browser engine scans and redacts personal identifiable information (party names, addresses, phone numbers, compensation rates, credit cards, and bank account numbers). Your private terms never leave your device in raw form.
2. **Clause Radar & Risk Heatmap**: Powered by Gemini 2.5 Flash, the app breaks down the contract section by section, assigns a 0–100 severity risk score, flags "The Trap", and explains the practical consequence in plain English.
3. **Plain-English De-Jargonizer**: We measure readability before and after analysis using the international **Flesch-Kincaid Grade Level** and **Reading Ease** metric, showing users an objective clarity gain (typically moving post-graduate Grade 16+ legalese down to clear Grade 7–8 language).
4. **Omission Radar**: What is *missing* from a contract is often more dangerous than what is in it. LexiGuard detects absent mutual protections, such as missing cure periods, missing audit caps, and unilateral termination clauses.
5. **Bilateral Redline Diff Engine**: Compare version 1 against version 2 of an agreement to see what changed, who gained leverage, and how the **Power Shift Index (-100 to +100)** moved.
6. **Grounded What-If Q&A**: Ask realistic situational questions (*"What happens if the client cancels after 20 days?"*) and receive streamed answers grounded strictly in the contract text, complete with line and section citations.
7. **Negotiation Studio**: Select any high-risk clause and generate 2 alternate counter-clauses (Balanced or Protective) along with a polite, professional negotiation email pitch to send back to the other party.
8. **Lawyer Briefing Dossier**: If you choose to speak with an attorney, LexiGuard generates a downloadable 1-page briefing summary containing prioritized questions and key risk points, cutting billable consultation time from hours to minutes.

---

## Architectural Decisions

When designing the system, we prioritized three engineering goals: **privacy by design**, **low latency**, and **zero-barrier accessibility**.

### 1. The Processing Pipeline
```
[Raw Contract]
      │
      ▼
[Client-Side Privacy Vault] ─── (Masks PII to [PARTY_A], [AMOUNT_1], etc.)
      │
      ▼
[Dual-Tier Client Cache] ────── (Checks browser memory & sessionStorage; 0ms on hits)
      │  (cache miss)
      ▼
[Next.js API Gateway] ───────── (Sliding-window rate limiter & strict Zod runtime schemas)
      │
      ▼
[Google Gemini 2.5 Flash] ───── (Low temperature, structured JSON schema mode)
      │
      ▼
[Defensive JSON Repair] ─────── (Ensures complete parsing even under payload truncation)
      │
      ▼
[Readability & Risk Engine] ─── (Computes Flesch-Kincaid grade levels & risk totals)
      │
      ▼
[Dynamic React Workbench] ───── (Code-split tabs, WCAG AAA contrast, live screen announcer)
```

### 2. Why Google Gemini 2.5 Flash?
We selected `gemini-2.5-flash` because contract review requires processing large text documents (frequently 15,000 to 50,000 characters) while maintaining interactive conversational speeds:
- **Low latency**: Flash delivers sub-second structured JSON responses and rapid First-Token response (<250ms) during streaming Q&A.
- **Strict adherence to JSON schemas**: Flash reliably adheres to strict response schemas without injecting extraneous markdown conversational filler.
- **Cost & efficiency**: Enables non-profits, legal aid societies, and small businesses to offer free contract deconstruction at scale without prohibitive API bills.

### 3. Client-Side Decoupling via Custom React Hooks
Rather than burying state machines inside monolithic page components, the application logic is separated into specialized hooks:
- **`useContractAudit`**: Manages the ingestion pipeline, client caching, preset switching, and tab routing.
- **`useAccessibilityState`**: Handles single-key keyboard navigation (`1`–`5` for tabs, `?` for tour, `Esc` to close modals), dynamic font scaling (`100%`, `112%`, `125%`), high-contrast themes, and screen-reader announcements.
- **`useDebounce`**: Eliminates unnecessary re-renders while typing or editing long contract text.

### 4. Dynamic Code Splitting
Only the primary Risk Heatmap is loaded on initial render. Secondary modules (`RedlineCompare`, `NegotiationStudio`, `LawyerDossier`, `SplitContractReader`) are lazily loaded via `next/dynamic` with lightweight skeleton placeholders. This reduced the initial JavaScript bundle down to **115 kB**, delivering instantaneous First Contentful Paint.

---

## Engineering Trade-offs & Honest Limitations

Building software always involves deliberate trade-offs. Here is what we chose and why:

| Architectural Choice | What We Gained | What We Traded Off |
| :--- | :--- | :--- |
| **In-Browser Heuristic PII Masking** | Guaranteed zero server transmission of names, emails, phones, and bank data. Fast, runs offline, zero third-party data processor agreements required. | Regular expressions and heuristic tokenizers can occasionally miss unusual non-standard entity formats or unique international addresses compared to heavy server-side NLP models. |
| **Dual-Tier Cache (Memory + `sessionStorage`)** | Repeat analyses and preset toggles return in **0ms** with zero API cost and zero server dependencies. | Cache is scoped per browser session. An external Redis database would allow cross-user caching of popular public terms of service, but would introduce infrastructure costs and privacy concerns about shared storage. |
| **Gemini 2.5 Flash vs. Gemini Pro** | Exceptional throughput, fast response times (<250ms TTFT), and lower resource consumption over large 65k-character inputs. | Slightly less capable of complex statutory cross-referencing (e.g. cross-referencing an obscure subsection of California civil code) compared to larger, slower reasoning models. |
| **Strict Non-Advisory Guardrails** | Total ethical safety. The AI refuses to instruct a user to break laws, violate contracts, or impersonate licensed counsel. | Users looking for definitive legal conclusions (*"Should I sign this right now?"*) receive risk-weighted recommendations rather than a binary yes/no answer. |
| **Strict Single-Branch & Small Repo Footprint** | Tracked repository size is strictly **~340 KiB** (<3.5% of competition limits), clean git history, lightning-fast CI builds. | We avoided checking in heavy static PDF assets, media files, or bundled demo fixtures, choosing lightweight programmatic generators instead. |

---

## Accessibility & Universal Design (WCAG 2.1 AAA)

Legal access should be universal regardless of ability or device:
- **High-Contrast Dark Theme**: Text colors have been calibrated to exceed the **7:1 AAA contrast ratio** against dark surfaces (`#0b0f19` and `#000000`).
- **Screen Reader Broadcaster**: Analysis events, tab changes, and warnings are announced in real-time via an active `aria-live="polite"` region.
- **Single-Key Navigation**:
  - `1`: Jump to Clause Audit & Heatmap
  - `2`: Jump to Grounded What-If Q&A
  - `3`: Jump to Redline Diff
  - `4`: Jump to Negotiation Studio
  - `5`: Jump to Lawyer Briefing Dossier
  - `?`: Open 5-Step Guided Tour
  - `Esc`: Close open dialogs or drawers
- **Dynamic Font Scaling**: 3 font scale presets (`100%`, `112%`, `125%`) that scale the entire UI without breaking layout geometry.
- **Vestibular Motion Safety**: `@media (prefers-reduced-motion: reduce)` disables animations for users sensitive to motion.

---

## Security & Privacy Architecture

- **Client-Side Sanitization**: Detects and replaces emails, phone numbers, monetary values, physical addresses, and Luhn-validated credit card sequences with anonymous tokens prior to dispatch.
- **Runtime Zod Boundary Validation**: Every incoming request to `/api/analyze`, `/api/chat`, `/api/compare`, and `/api/negotiate` is validated against strict runtime schemas (`src/lib/schemas.ts`).
- **Prompt Injection Delimiters**: User-provided contract text is isolated within strict XML tags (`<CONTRACT_TEXT>`) accompanied by system prompt rules forbidding instruction override.
- **Rate Limiting**: Sliding-window IP rate limiter (45 requests/minute) protects backend endpoints against automated scraping and DoS attempts.
- **Strict HTTP Headers**: Configured with Content-Security-Policy (CSP), Cross-Origin-Opener-Policy (COOP), HSTS, and X-Content-Type-Options: nosniff in `next.config.mjs`.

---

## Automated Test Suite

We maintain an automated Vitest test suite with **88 tests across 13 test files**, covering unit, security, and integration layers:

```bash
npm test
```

```text
 RUN  v2.1.9 E:/Projects/Google-PromptWars-Exclusive-Edition

 ✓ tests/validation.test.ts     (2 tests)
 ✓ tests/a11y-wcag.test.ts      (5 tests)
 ✓ tests/readability.test.ts    (5 tests)
 ✓ tests/pii.test.ts           (11 tests)
 ✓ tests/security.test.ts      (12 tests)
 ✓ tests/schemas.test.ts       (15 tests)
 ✓ tests/cache.test.ts          (5 tests)
 ✓ tests/client-cache.test.ts   (6 tests)
 ✓ tests/rate-limiter.test.ts   (4 tests)
 ✓ tests/accessibility.test.ts  (4 tests)
 ✓ tests/gemini.test.ts         (3 tests)
 ✓ tests/presets.test.ts        (6 tests)
 ✓ tests/api-routes.test.ts    (10 tests)

 Test Files  13 passed (13)
      Tests  88 passed (88)
   Duration  < 2.0s
```

---

## Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node 20 and 24)
- npm 9+
- A Google Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/HarshitDhaduk/LexiGuard-AI.git
cd LexiGuard-AI

# 2. Install dependencies
npm install

# 3. Create your local environment configuration
cp .env.example .env.local
# Add: GEMINI_API_KEY=your_actual_gemini_api_key

# 4. Run automated test suites
npm test

# 5. Build for production (verifies types & tree-shaking)
npm run build

# 6. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── .github/workflows/      # Automated CI/CD (Lint, Vitest, Next.js Build)
├── src/
│   ├── app/
│   │   ├── api/            # Edge API routes (/analyze, /chat, /compare, /negotiate)
│   │   ├── page.tsx        # Decoupled primary view with dynamic imports
│   │   └── layout.tsx      # Root layout, fonts, and accessibility landmarks
│   ├── components/         # Accessible, modular React components
│   │   ├── DocumentInput.tsx       # Ingestion & client-side PII privacy shield
│   │   ├── RiskHeatmap.tsx         # Severity breakdown & clause cards
│   │   ├── GroundedChat.tsx        # Streaming Q&A simulator with citations
│   │   ├── RedlineCompare.tsx      # Bilateral redline diff & power shift index
│   │   ├── NegotiationStudio.tsx   # Counter-clause generator & email drafts
│   │   ├── LawyerDossier.tsx       # 1-page attorney briefing export
│   │   ├── SplitContractReader.tsx # Interactive contract reader synced with clauses
│   │   ├── ReadabilityMeter.tsx    # Flesch-Kincaid clarity gain metric
│   │   ├── AccessibilityBar.tsx    # WCAG font scaling & high-contrast toolbar
│   │   └── TabLoadingSkeleton.tsx  # Accessible skeleton loaders for dynamic tabs
│   ├── hooks/              # Custom state machines & listener hooks
│   │   ├── useContractAudit.ts     # Analysis pipeline & client cache manager
│   │   ├── useAccessibilityState.ts# Screen reader & keyboard shortcut hook
│   │   └── useDebounce.ts          # Smooth input text debouncer
│   └── lib/                # Pure business logic & security utilities
│       ├── gemini.ts       # Structured GenAI prompts, JSON repair, & fallbacks
│       ├── pii.ts          # Client-side PII detector & rehydration engine
│       ├── schemas.ts      # Strict runtime Zod validation schemas
│       ├── client-cache.ts # Dual-tier memory + sessionStorage cache
│       ├── rate-limiter.ts # Sliding-window IP rate limiter
│       ├── readability.ts  # Flesch-Kincaid grade level & reading ease formulas
│       ├── security.ts     # Prompt injection isolation & input sanitization
│       └── presets.ts      # Real-world benchmark contracts (Freelance, Lease, SaaS)
├── tests/                  # 13 Vitest test suites (88 tests)
├── ARCHITECTURE.md         # Detailed architectural blueprint & system patterns
├── SECURITY.md             # Security policy & responsible disclosure
└── README.md               # You are here
```

---

## License

This project is open-source under the [MIT License](LICENSE).
