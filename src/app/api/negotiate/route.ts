import { NextRequest, NextResponse } from "next/server";
import { generateCounterClauseWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clauseTitle, originalSnippet, stance = "Balanced" } = body;

    if (!clauseTitle || !originalSnippet) {
      return NextResponse.json(
        { error: "Please provide both clauseTitle and originalSnippet." },
        { status: 400 }
      );
    }

    const proposal = await generateCounterClauseWithGemini(
      clauseTitle,
      originalSnippet,
      stance === "Protective" ? "Protective" : "Balanced"
    );

    return NextResponse.json({ success: true, data: proposal });
  } catch (error) {
    console.error("Error in /api/negotiate:", error);
    return NextResponse.json(
      { error: "Failed to generate negotiation counter-proposal." },
      { status: 500 }
    );
  }
}
