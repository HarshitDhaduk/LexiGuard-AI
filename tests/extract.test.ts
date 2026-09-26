import { describe, it, expect, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as extractPost, OPTIONS as extractOptions } from "../src/app/api/extract/route";
import { apiRateLimiter } from "../src/lib/rate-limiter";

function createMockFormDataRequest(file?: File | null, headers?: Record<string, string>): NextRequest {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

  const reqInit: RequestInit = {
    method: "POST",
    headers: {
      ...(headers || {}),
    },
    body: formData,
  };

  return new NextRequest(new URL("http://localhost:3000/api/extract"), reqInit);
}

describe("POST /api/extract (Document Ingestion Endpoint)", () => {
  beforeEach(() => {
    apiRateLimiter.reset();
  });

  it("handles OPTIONS request with CORS headers", async () => {
    const req = new NextRequest("http://localhost:3000/api/extract", { method: "OPTIONS" });
    const res = await extractOptions(req);
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("returns 400 when no file is uploaded in formData", async () => {
    const req = createMockFormDataRequest(null);
    const res = await extractPost(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("No file uploaded");
  });

  it("returns 400 when file format is unsupported (e.g., .exe, .zip)", async () => {
    const file = new File(["malicious binary content"], "virus.exe", { type: "application/octet-stream" });
    const req = createMockFormDataRequest(file);
    const res = await extractPost(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toContain("Unsupported file format");
  });

  it("extracts text correctly from a .txt contract file", async () => {
    const sampleContract =
      "This Master Services Agreement is entered into on January 15, 2026 by and between Client and Independent Contractor. Payment terms are Net 30 with 1.5% late fee per month.";
    const file = new File([sampleContract], "agreement.txt", { type: "text/plain" });

    const req = createMockFormDataRequest(file);
    const res = await extractPost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.text).toContain("Master Services Agreement");
    expect(json.wordCount).toBeGreaterThan(10);
    expect(json.charCount).toBe(sampleContract.length);
    expect(json.filename).toBe("agreement.txt");
  });

  it("extracts text correctly from a .md markdown contract file", async () => {
    const mdContract =
      "# Residential Lease Agreement\n\n1. Rent is due on the 1st of every month.\n2. Landlord requires 48 hours notice before entry.";
    const file = new File([mdContract], "lease.md", { type: "text/markdown" });

    const req = createMockFormDataRequest(file);
    const res = await extractPost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.text).toContain("Residential Lease Agreement");
  });

  it("returns 422 if extracted text is too short or empty", async () => {
    const shortFile = new File(["hi"], "contract.txt", { type: "text/plain" });
    const req = createMockFormDataRequest(shortFile);
    const res = await extractPost(req);
    expect(res.status).toBe(422);

    const json = await res.json();
    expect(json.error).toContain("Unable to extract readable text");
  });

  it("enforces rate limiting when too many requests arrive", async () => {
    const file = new File(["Valid Contract Text with sufficient length for testing purposes."], "contract.txt", {
      type: "text/plain",
    });

    // Exhaust limit (45 requests)
    for (let i = 0; i < 45; i++) {
      apiRateLimiter.check("127.0.0.1");
    }

    const req = createMockFormDataRequest(file, { "x-forwarded-for": "127.0.0.1" });
    const res = await extractPost(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toContain("Rate limit exceeded");
  });
});
