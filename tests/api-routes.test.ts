import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as analyzePost, OPTIONS as analyzeOptions } from "../src/app/api/analyze/route";
import { POST as chatPost, OPTIONS as chatOptions } from "../src/app/api/chat/route";
import { POST as comparePost, OPTIONS as compareOptions } from "../src/app/api/compare/route";
import { POST as negotiatePost, OPTIONS as negotiateOptions } from "../src/app/api/negotiate/route";
import { apiRateLimiter } from "../src/lib/rate-limiter";

function createMockRequest(url: string, body?: any, headers?: Record<string, string>): NextRequest {
  const reqInit: RequestInit = {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  };
  if (body) {
    reqInit.body = JSON.stringify(body);
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), reqInit);
}

describe("API Route Integration Tests (/api/*)", () => {
  beforeEach(() => {
    apiRateLimiter.reset();
  });

  describe("POST /api/analyze", () => {
    it("returns 400 when input contract is empty or too short", async () => {
      const req = createMockRequest("http://localhost:3000/api/analyze", { text: "Too short" });
      const res = await analyzePost(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toContain("Minimum 20 characters required");
    });

    it("returns 200 with analysis result for valid contract text", async () => {
      const validText =
        "This Master Services Agreement is entered between Acme Corp and Jane Doe. Payment is Net 30 with 1.5% late fee. Contractor retains background IP.";
      const req = createMockRequest("http://localhost:3000/api/analyze", { text: validText });
      const res = await analyzePost(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.clauses).toBeDefined();
    });

    it("handles OPTIONS request with CORS headers", async () => {
      const req = createMockRequest("http://localhost:3000/api/analyze");
      const res = await analyzeOptions(req);
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    });
  });

  describe("POST /api/chat", () => {
    it("returns 400 when contract context is missing", async () => {
      const req = createMockRequest("http://localhost:3000/api/chat", { query: "What are payment terms?" });
      const res = await chatPost(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("No contract context found");
    });

    it("returns 200 with grounded answer and citations in JSON mode", async () => {
      const req = createMockRequest("http://localhost:3000/api/chat", {
        contractText: "Section 2 states that client pays within 30 days. Section 7 allows termination on 30 days notice.",
        query: "When do I get paid?",
        stream: false,
      });
      const res = await chatPost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.answer).toBeDefined();
    });

    it("supports Server-Sent Events (SSE) streaming when stream: true", async () => {
      const req = createMockRequest("http://localhost:3000/api/chat", {
        contractText: "Section 2 states that client pays within 30 days.",
        query: "What are the payment terms?",
        stream: true,
      });
      const res = await chatPost(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("text/event-stream");
    });
  });

  describe("POST /api/compare", () => {
    it("returns 400 when either docA or docB is missing or too short", async () => {
      const req = createMockRequest("http://localhost:3000/api/compare", {
        docA: "Short",
        docB: "Short",
      });
      const res = await comparePost(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 with bilateral redline diff for two documents", async () => {
      const docA = "Agreement Version A: Payment within 30 days. Mutual indemnity capped at contract value.";
      const docB = "Agreement Version B: Payment within 90 days. Unilateral uncapped indemnity on contractor.";
      const req = createMockRequest("http://localhost:3000/api/compare", { docA, docB });
      const res = await comparePost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.powerShiftScore).toBeDefined();
    });
  });

  describe("POST /api/negotiate", () => {
    it("returns 400 when clauseTitle or originalSnippet is missing", async () => {
      const req = createMockRequest("http://localhost:3000/api/negotiate", {
        clauseTitle: "Indemnity",
      });
      const res = await negotiatePost(req);
      expect(res.status).toBe(400);
    });

    it("returns 200 with counter-proposal and diplomatic email", async () => {
      const req = createMockRequest("http://localhost:3000/api/negotiate", {
        clauseTitle: "Unilateral Indemnification",
        originalSnippet: "Contractor indemnifies client with uncapped liability.",
        stance: "Balanced",
      });
      const res = await negotiatePost(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.diplomaticEmailDraft).toMatch(/^(?:Hi|Dear)/);
    });
  });
});
