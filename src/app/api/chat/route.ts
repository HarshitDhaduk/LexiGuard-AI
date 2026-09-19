import { NextRequest, NextResponse } from "next/server";
import { chatGroundedWithGemini } from "@/lib/gemini";
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
        { error: "Too many messages sent. Please slow down." },
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
    const { contractText, query, history = [] } = body;

    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        { error: "No contract context found to answer questions against." },
        { status: 400, headers }
      );
    }

    const valQuery = sanitizePromptInput(query, 5000);
    if (!valQuery.isValid && query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid question." },
        { status: 400, headers }
      );
    }

    const response = await chatGroundedWithGemini(
      contractText,
      valQuery.sanitizedText || query,
      history
    );
    return NextResponse.json({ success: true, data: response }, { headers });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to process grounded chat question." },
      { status: 500 }
    );
  }
}
