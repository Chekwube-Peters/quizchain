import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateQuizQuestions } from "@/lib/ai";

const schema = z.object({
  category: z.enum(["BLOCKCHAIN", "ROOTSTOCK", "BITCOIN", "BIOLOGY", "SPORTS", "HISTORY", "MOVIES", "RELIGION", "CUSTOM"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  count: z.number().int().min(5).max(50).default(10),
  customTopic: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.issues }, { status: 400 });
    }

    const { category, difficulty, count, customTopic } = parsed.data;
    const questions = await generateQuizQuestions(category, difficulty, count, customTopic);

    return NextResponse.json({ questions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
