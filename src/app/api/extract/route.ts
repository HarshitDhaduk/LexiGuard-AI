import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import mammoth from "mammoth";
import { getCorsHeaders, getClientIp } from "@/lib/security";
import { apiRateLimiter } from "@/lib/rate-limiter";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin);
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // 1. Rate Limiting Check (45 requests / min per IP)
  const clientIp = getClientIp(req.headers);
  const rateLimit = apiRateLimiter.check(clientIp);

  const headers: Record<string, string> = {
    ...corsHeaders,
    "X-RateLimit-Limit": rateLimit.limit.toString(),
    "X-RateLimit-Remaining": rateLimit.remaining.toString(),
    "X-RateLimit-Reset": rateLimit.resetTimeMs.toString(),
  };

  if (!rateLimit.allowed) {
    headers["Retry-After"] = (rateLimit.retryAfterSeconds || 60).toString();
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds} seconds before extracting more documents.`,
      },
      { status: 429, headers }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please upload a PDF, DOCX, or TXT document." },
        { status: 400, headers }
      );
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB limit
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File exceeds 10 MB limit. Please upload a smaller legal document." },
        { status: 400, headers }
      );
    }

    const filename = file.name || "contract-document";
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const buffer = await file.arrayBuffer();

    let extractedText = "";

    if (extension === "pdf" || file.type === "application/pdf") {
      const pdfData = await extractText(buffer);
      if (Array.isArray(pdfData.text)) {
        extractedText = pdfData.text.join("\n\n");
      } else if (typeof pdfData.text === "string") {
        extractedText = pdfData.text;
      }
    } else if (
      extension === "docx" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const nodeBuffer = Buffer.from(buffer);
      const mammothResult = await mammoth.extractRawText({ buffer: nodeBuffer });
      extractedText = mammothResult.value;
    } else if (
      extension === "txt" ||
      extension === "md" ||
      extension === "rtf" ||
      file.type.startsWith("text/")
    ) {
      extractedText = new TextDecoder("utf-8").decode(buffer);
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file format (.${extension}). Please upload a .pdf, .docx, .txt, or .md contract file.`,
        },
        { status: 400, headers }
      );
    }

    // Clean up excessive whitespace and page break artifacts
    const cleanedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!cleanedText || cleanedText.length < 15) {
      return NextResponse.json(
        {
          error:
            "Unable to extract readable text. The document might be an image-only scan or password-protected. Please paste the text directly.",
        },
        { status: 422, headers }
      );
    }

    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
    const charCount = cleanedText.length;

    return NextResponse.json(
      {
        success: true,
        text: cleanedText,
        filename,
        wordCount,
        charCount,
      },
      { status: 200, headers }
    );
  } catch (err: unknown) {
    console.error("Document extraction error:", err);
    return NextResponse.json(
      {
        error:
          "Failed to parse document. Please ensure the file is not corrupted or password-protected, or paste the text directly.",
      },
      { status: 500, headers }
    );
  }
}
