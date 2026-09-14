import { NextRequest, NextResponse } from "next/server";
import { compareContractsWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docA, docB } = body;

    if (!docA || !docB || docA.trim().length < 20 || docB.trim().length < 20) {
      return NextResponse.json(
        {
          error: "Please provide two contract texts to compare, each with at least 20 characters.",
        },
        { status: 400 }
      );
    }

    const diffResult = await compareContractsWithGemini(docA, docB);
    return NextResponse.json({ success: true, data: diffResult });
  } catch (error) {
    console.error("Error in /api/compare:", error);
    return NextResponse.json(
      {
        error: "Failed to compare contract versions. Please try again.",
      },
      { status: 500 }
    );
  }
}
