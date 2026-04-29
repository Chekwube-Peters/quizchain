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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        achievements: { orderBy: { earnedAt: "desc" } },
        participations: {
          include: {
            room: {
              include: {
                quiz: { select: { title: true, category: true } },
              },
            },
          },
          orderBy: { joinedAt: "desc" },
          take: 20,
        },
        _count: { select: { quizzesHosted: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      role: user.role,
      totalScore: user.totalScore,
      quizzesWon: user.quizzesWon,
      quizzesPlayed: user.quizzesPlayed,
      quizzesHosted: user._count.quizzesHosted,
      createdAt: user.createdAt,
      achievements: user.achievements,
      history: user.participations.map((p) => ({
        id: p.id,
        quizTitle: p.room.quiz.title,
        category: p.room.quiz.category,
        rank: p.rank,
        score: p.score,
        totalTime: p.totalTime,
        roomCode: p.room.code,
        playerCount: 0,
        date: p.joinedAt,
      })),
    });
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
