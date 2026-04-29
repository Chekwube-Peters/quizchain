import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id, hostId: session.user.id },
      include: {
        questions: { orderBy: { order: "asc" } },
        rooms: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { code: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({
      roomCode: quiz.rooms[0]?.code ?? null,
      quiz: {
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
        maxPlayers: quiz.rooms[0] ? 100 : 100,
      },
    });
  } catch (error) {
    console.error("Get quiz error:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
