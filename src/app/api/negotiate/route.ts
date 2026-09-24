import { NextRequest, NextResponse } from "next/server";
import { generateCounterClauseWithGemini } from "@/lib/gemini";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { getClientIp, sanitizePromptInput, getCorsHeaders } from "@/lib/security";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);
    const ip = getClientIp(req.headers);
    const rateLimit = apiRateLimiter.check(ip);

    const headers = {
      ...corsHeaders,
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
    const { clauseTitle, originalSnippet, stance = "Balanced" } = body;

    if (!clauseTitle || !originalSnippet) {
      return NextResponse.json(
        { error: "Please provide both clauseTitle and originalSnippet." },
        { status: 400, headers }
      );
    }

    const valSnippet = sanitizePromptInput(originalSnippet, 10000);
    const proposal = await generateCounterClauseWithGemini(
      clauseTitle,
      valSnippet.sanitizedText || originalSnippet,
      stance === "Protective" ? "Protective" : "Balanced"
    );

    return NextResponse.json({ success: true, data: proposal }, { headers });
  } catch (error) {
    console.error("Error in /api/negotiate:", error);
    return NextResponse.json(
      { error: "Failed to generate negotiation counter-proposal." },
      { status: 500 }
    );
  }
}
