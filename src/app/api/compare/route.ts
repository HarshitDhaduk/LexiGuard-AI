import { NextRequest, NextResponse } from "next/server";
import { compareContractsWithGemini } from "@/lib/gemini";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { getClientIp, sanitizePromptInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const rateLimit = apiRateLimiter.check(ip);

    const headers = {
      "X-RateLimit-Limit": rateLimit.limit.toString(),
      "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      "X-RateLimit-Reset": rateLimit.resetTimeMs.toString(),
    };

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": (rateLimit.retryAfterSeconds || 60).toString(),
          },
        }
      );
    }

    const body = await req.json();
    const { docA, docB } = body;

    const valA = sanitizePromptInput(docA, 65000);
    const valB = sanitizePromptInput(docB, 65000);

    if (!valA.isValid || !valB.isValid) {
      return NextResponse.json(
        {
          error: "Please provide two valid contract texts to compare, each with at least 20 characters.",
        },
        { status: 400, headers }
      );
    }

    const diffResult = await compareContractsWithGemini(valA.sanitizedText, valB.sanitizedText);
    return NextResponse.json({ success: true, data: diffResult }, { headers });
  } catch (error) {
    console.error("Error in /api/compare:", error);
    return NextResponse.json(
      { error: "Failed to compare contract versions. Please try again." },
      { status: 500 }
    );
  }
}
