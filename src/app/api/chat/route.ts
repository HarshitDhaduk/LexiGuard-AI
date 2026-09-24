import { NextRequest, NextResponse } from "next/server";
import { chatGroundedWithGemini, streamChatGroundedWithGemini } from "@/lib/gemini";
import { apiRateLimiter } from "@/lib/rate-limiter";
import { getClientIp, sanitizePromptInput, getCorsHeaders } from "@/lib/security";
import { ChatRequestSchema, formatZodError } from "@/lib/schemas";

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
    const parseResult = ChatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: formatZodError(parseResult.error) },
        { status: 400, headers }
      );
    }
    const { contractText, query, history, stream } = parseResult.data;

    const valQuery = sanitizePromptInput(query, 5000);
    if (!valQuery.isValid && query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid question." },
        { status: 400, headers }
      );
    }

    // Server-Sent Events (SSE) streaming support for low-latency TTFT
    if (stream || req.headers.get("accept")?.includes("text/event-stream")) {
      const textEncoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const tokenStream = streamChatGroundedWithGemini(
              contractText,
              valQuery.sanitizedText || query,
              history
            );
            for await (const chunk of tokenStream) {
              const sseLine = `data: ${JSON.stringify({ chunk })}\n\n`;
              controller.enqueue(textEncoder.encode(sseLine));
            }
            controller.enqueue(textEncoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (streamErr) {
            controller.error(streamErr);
          }
        },
      });

      return new Response(readable, {
        headers: {
          ...headers,
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
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
