import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateQuizQuestions } from "@/lib/ai";

const schema = z.object({
  mode: z.enum(["AI_GENERATED", "MANUAL"]),
  category: z.enum(["BLOCKCHAIN", "ROOTSTOCK", "BITCOIN", "BIOLOGY", "SPORTS", "HISTORY", "MOVIES", "RELIGION", "CUSTOM"]),
  customTopic: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  questionCount: z.number().int().min(5).max(50).default(10),
  title: z.string().optional(),
  description: z.string().optional(),
  timeLimit: z.number().int().min(10).max(120).default(30),
  maxPlayers: z.number().int().min(2).max(1000).default(100),
  entryFee: z.number().optional(),
  prizePool: z.number().optional(),
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
    explanation: z.string().optional(),
    timeLimit: z.number().optional(),
  })).optional(),
});

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    let questions;

    if (data.mode === "AI_GENERATED") {
      questions = await generateQuizQuestions(
        data.category,
        data.difficulty,
        data.questionCount,
        data.customTopic
      );
    } else {
      if (!data.questions || data.questions.length === 0) {
        return NextResponse.json({ error: "Manual mode requires questions" }, { status: 400 });
      }
      questions = data.questions.map((q, i) => ({
        id: `q_${i + 1}`,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || "",
        points: 1000,
        timeLimit: q.timeLimit || data.timeLimit,
        order: i + 1,
      }));
    }

    const roomCode = generateCode();

    // Build the quiz object for session storage
    const quiz = {
      id: `quiz_${Date.now()}`,
      title: data.title || `${data.category} Quiz`,
      category: data.category,
      difficulty: data.difficulty,
      questions,
      totalQuestions: questions.length,
      maxPlayers: data.maxPlayers,
      entryFee: data.entryFee,
      prizePool: data.prizePool,
    };

    // Return the room code and quiz data
    // In production, store in DB and use DB ID
    return NextResponse.json({
      roomCode,
      quiz,
      message: "Quiz created successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create quiz";
    console.error("Create quiz error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
