import { NextRequest, NextResponse } from "next/server";
import { chatGroundedWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contractText, query, history = [] } = body;

    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        { error: "No contract context found to answer questions against." },
        { status: 400 }
      );
    }

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid question." },
        { status: 400 }
      );
    }

    const response = await chatGroundedWithGemini(contractText, query, history);
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to process grounded chat question." },
      { status: 500 }
    );
  }
}
