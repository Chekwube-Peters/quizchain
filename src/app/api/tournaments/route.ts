import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: {
        scheduledAt: { not: null },
        status: "PUBLISHED",
      },
      include: {
        host: { select: { name: true, image: true } },
        rooms: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            _count: { select: { participants: true } },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    const now = new Date();

    const tournaments = quizzes.map((q) => {
      const room = q.rooms[0] ?? null;
      const participantCount = room?._count.participants ?? 0;
      const roomStatus = room?.status ?? "WAITING";

      let status: "UPCOMING" | "LIVE" | "ENDED";
      if (roomStatus === "ACTIVE" || roomStatus === "PAUSED") {
        status = "LIVE";
      } else if (roomStatus === "ENDED") {
        status = "ENDED";
      } else if (q.scheduledAt && q.scheduledAt <= now) {
        status = "LIVE";
      } else {
        status = "UPCOMING";
      }

      const prizeDisplay = buildPrizeDisplay(q);

      return {
        id: q.id,
        title: q.title,
        description: q.description ?? "",
        category: q.category,
        difficulty: q.difficulty,
        prizeType: q.prizeType,
        prizePool: q.prizePool ?? 0,
        prizeCurrency: q.prizeCurrency ?? "RBTC",
        prizeDescription: q.prizeDescription ?? "",
        prizeDisplay,
        entryFee: q.entryFee ?? 0,
        scheduledAt: q.scheduledAt?.toISOString() ?? null,
        status,
        participantCount,
        maxPlayers: room?.maxPlayers ?? 100,
        roomCode: room?.code ?? null,
        hostName: q.host.name ?? "Host",
        hostImage: q.host.image ?? null,
        timesPlayed: q.timesPlayed,
      };
    });

    const stats = {
      total: tournaments.length,
      live: tournaments.filter((t) => t.status === "LIVE").length,
      upcoming: tournaments.filter((t) => t.status === "UPCOMING").length,
    };

    return NextResponse.json({ tournaments, stats });
  } catch (error) {
    console.error("Tournaments fetch error:", error);
    return NextResponse.json({ tournaments: [], stats: { total: 0, live: 0, upcoming: 0 } });
  }
}

function buildPrizeDisplay(q: { prizeType: string; prizePool: number | null; prizeCurrency: string | null; prizeDescription: string | null }) {
  if (q.prizeType === "CASH") {
    return q.prizePool ? `$${q.prizePool} USD` : "Cash Prize";
  }
  if (q.prizeType === "CRYPTO") {
    const currency = q.prizeCurrency ?? "RBTC";
    return q.prizePool ? `${q.prizePool} ${currency}` : currency;
  }
  if (q.prizeType === "BRANDED_GIFT") {
    return q.prizeDescription ? q.prizeDescription.slice(0, 40) : "Branded Gift 🎁";
  }
  if (q.prizePool && q.prizePool > 0) {
    return `${q.prizePool} RBTC`;
  }
  return "No Prize";
}
