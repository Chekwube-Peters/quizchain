import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { hostId: session.user.id },
      include: {
        questions: { select: { id: true } },
        rooms: {
          select: {
            code: true,
            status: true,
            _count: { select: { participants: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      status: q.status,
      questionCount: q.questions.length,
      timesPlayed: q.timesPlayed,
      createdAt: q.createdAt,
      roomCode: q.rooms[0]?.code ?? null,
      roomStatus: q.rooms[0]?.status ?? null,
      playerCount: q.rooms[0]?._count.participants ?? 0,
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (error) {
    console.error("My quizzes error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
