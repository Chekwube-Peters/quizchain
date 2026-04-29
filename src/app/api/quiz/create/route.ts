import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateQuizQuestions } from "@/lib/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to create a quiz" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const data = parsed.data;
    let rawQuestions: Array<{
      text: string; options: string[]; correctIndex: number;
      explanation?: string; points: number; timeLimit: number; order: number;
    }>;

    if (data.mode === "AI_GENERATED") {
      rawQuestions = await generateQuizQuestions(data.category, data.difficulty, data.questionCount, data.customTopic);
    } else {
      if (!data.questions || data.questions.length === 0) {
        return NextResponse.json({ error: "Manual mode requires questions" }, { status: 400 });
      }
      rawQuestions = data.questions.map((q, i) => ({
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

    const quiz = await prisma.quiz.create({
      data: {
        title: data.title || `${data.category} Quiz`,
        description: data.description,
        category: data.category as any,
        difficulty: data.difficulty as any,
        mode: data.mode as any,
        status: "PUBLISHED" as any,
        hostId: session.user.id,
        entryFee: data.entryFee,
        prizePool: data.prizePool,
        questions: {
          create: rawQuestions.map((q) => ({
            text: q.text,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation || "",
            points: q.points,
            timeLimit: q.timeLimit,
            order: q.order,
          })),
        },
        rooms: {
          create: { code: roomCode, maxPlayers: data.maxPlayers, isPublic: true },
        },
      },
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    });

    const quizForClient = {
      id: quiz.id,
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || "",
        points: q.points,
        timeLimit: q.timeLimit,
        order: q.order,
      })),
      totalQuestions: quiz.questions.length,
      maxPlayers: data.maxPlayers,
      entryFee: data.entryFee,
      prizePool: data.prizePool,
    };

    return NextResponse.json({ roomCode, quiz: quizForClient, message: "Quiz created successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create quiz";
    console.error("Create quiz error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
