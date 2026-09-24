# Security Policy — LexiGuard AI

LexiGuard AI is engineered with defense-in-depth principles to protect user privacy, prevent unauthorized data access, and defend against adversarial machine learning threats in legal analysis.

---

## 1. Supported Versions

| Version | Supported | Security Maintenance |
| :--- | :---: | :--- |
| `1.0.x` | ✅ Yes | Actively patched against prompt injection, ReDoS, and privacy vulnerabilities |
| `< 1.0` | ❌ No | Deprecated |

---

## 2. Core Security Architecture & Safeguards

### 2.1 Client-Side Privacy Vault (Zero-Leakage PII Defense)
- All Personally Identifiable Information (PII) is masked **in the client browser** before payload transmission (`src/lib/pii.ts`).
- Identifiers masked include:
  - Credit Cards verified via the **Luhn Algorithm** (`isValidLuhn`).
  - International Bank Account Numbers (**IBAN**).
  - Social Security Numbers (**SSN**) and Employer Identification Numbers (**EIN**).
  - Email addresses, telephone numbers, and physical street addresses.
  - Named commercial parties (anonymized to `[PARTY_A]` / `[PARTY_B]`).

### 2.2 Adversarial Prompt Injection & Jailbreak Defense
- Every incoming legal text and user prompt is sanitized through an adversarial defense layer (`src/lib/security.ts`).
- Neutralizes:
  - Instruction override attacks (`ignore all previous instructions`).
  - Role hijacking (`you are now a DAN/jailbroken AI`).
  - System prompt extraction requests.
  - Markdown image data exfiltration (`![img](https://evil.com/leak)`).
  - ReDoS (Regular Expression Denial of Service) through strict string bounds and character filtering.

### 2.3 API Throttling & Rate Limiting
- Sliding-window in-memory IP rate limiter (`src/lib/rate-limiter.ts`) enforcing:
  - Max 45 requests per 60-second sliding window.
  - RFC 6585 compliant `429 Too Many Requests` responses with `Retry-After` and `X-RateLimit-*` headers.

### 2.4 Hardened HTTP Security Headers
Configured in `next.config.mjs`:
- `Content-Security-Policy`: Restricts scripts, connections, and frame ancestors.
- `Strict-Transport-Security`: HSTS enabled for 2 years with preloading.
- `X-Frame-Options: DENY`: Prevents clickjacking attacks.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
- `Cross-Origin-Opener-Policy: same-origin`: Isolates browsing context.
- `Permissions-Policy`: Disables microphone, camera, and geolocation.

---

## 3. Reporting a Vulnerability

If you discover a potential security vulnerability within LexiGuard AI:
1. Please open a private security advisory on GitHub or email the maintainer directly.
2. Provide reproducible steps or a proof-of-concept payload.
3. We will acknowledge receipt within 24 hours and issue a mitigation patch promptly.
