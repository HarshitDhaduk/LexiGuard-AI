import { NextRequest, NextResponse } from "next/server";
import { analyzeContractWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length < 20) {
      return NextResponse.json(
        {
          error: "Please provide valid legal contract text with at least 20 characters.",
        },
        { status: 400 }
      );
    }

    const analysis = await analyzeContractWithGemini(text);
    return NextResponse.json({ success: true, data: analysis });
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
