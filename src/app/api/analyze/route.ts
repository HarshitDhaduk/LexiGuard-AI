import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini } from "@/lib/gemini";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { getClientIp, sanitizePromptInput, getCorsHeaders } from "@/lib/security";
import { AnalyzeRequestSchema, formatZodError } from "@/lib/schemas";

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

    // 1. Rate Limiting Defense
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
        {
          error: "Rate limit exceeded. Please wait a few seconds before submitting more requests.",
        },
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
    const parseResult = AnalyzeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: formatZodError(parseResult.error) },
        { status: 400, headers }
      );
    }
    const { text, persona } = parseResult.data;

    // 2. Input Length & Security Validation
    const validation = sanitizePromptInput(text, 65000);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage },
        { status: 400, headers }
      );
    }

    const analysis = await analyzeContractWithGemini(validation.sanitizedText, persona);
    return NextResponse.json({ success: true, data: analysis }, { headers });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return NextResponse.json(
      {
        error: "Failed to complete contract analysis. Please check your text and try again.",
      },
      { status: 500 }
    );
  }
}
