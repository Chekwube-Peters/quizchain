"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, Users, Zap, DollarSign, Calendar, ChevronRight, Star, Filter } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

const TOURNAMENTS = [
  {
    id: "1",
    name: "Bitcoin Masters Championship",
    description: "Test your Bitcoin knowledge in the ultimate showdown",
    category: "BITCOIN",
    emoji: "₿",
    prizePool: 0.5,
    currency: "RBTC",
    entryFee: 0.001,
    participants: 128,
    maxParticipants: 256,
    status: "ACTIVE",
    startDate: "2025-01-25T18:00:00Z",
    difficulty: "HARD",
    gradient: "from-orange-500 to-red-500",
    featured: true,
  },
  {
    id: "2",
    name: "Rootstock Builder Quest",
    description: "For RSK ecosystem builders and enthusiasts",
    category: "ROOTSTOCK",
    emoji: "🔗",
    prizePool: 0.25,
    currency: "RBTC",
    entryFee: 0.0005,
    participants: 64,
    maxParticipants: 128,
    status: "UPCOMING",
    startDate: "2025-01-28T20:00:00Z",
    difficulty: "MEDIUM",
    gradient: "from-amber-500 to-orange-600",
    featured: false,
  },
  {
    id: "3",
    name: "Blockchain Trivia Cup",
    description: "Open to all — test your Web3 fundamentals",
    category: "BLOCKCHAIN",
    emoji: "⛓️",
    prizePool: 0.1,
    currency: "RBTC",
    entryFee: 0,
    participants: 342,
    maxParticipants: 500,
    status: "UPCOMING",
    startDate: "2025-02-01T16:00:00Z",
    difficulty: "EASY",
    gradient: "from-violet-500 to-purple-600",
    featured: false,
  },
  {
    id: "4",
    name: "Sports Trivia League",
    description: "Football, basketball, F1, Olympics — the full sports world",
    category: "SPORTS",
    emoji: "⚽",
    prizePool: 0,
    currency: "NFT",
    entryFee: 0,
    participants: 89,
    maxParticipants: 200,
    status: "UPCOMING",
    startDate: "2025-02-05T19:00:00Z",
    difficulty: "MEDIUM",
    gradient: "from-blue-500 to-indigo-600",
    featured: false,
  },
];

export default function TournamentsPage() {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING" | "FREE">("ALL");

  const filtered = TOURNAMENTS.filter((t) => {
    if (filter === "ACTIVE") return t.status === "ACTIVE";
    if (filter === "UPCOMING") return t.status === "UPCOMING";
    if (filter === "FREE") return t.entryFee === 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium">
            <Trophy className="w-3.5 h-3.5" />
            Competitive Play
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            <span className="gradient-text">Tournaments</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Compete for RBTC prizes and exclusive NFT badges. Results hashed on-chain.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <FilterIcon className="text-slate-400 mt-2" />
          {(["ALL", "ACTIVE", "UPCOMING", "FREE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                filter === f
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {f === "FREE" ? "🆓 Free" : f === "ACTIVE" ? "🔴 Live" : f}
            </button>
          ))}
        </div>

        {/* Featured tournament */}
        {filter === "ALL" && TOURNAMENTS.find((t) => t.featured) && (
          <FeaturedTournament tournament={TOURNAMENTS.find((t) => t.featured)!} />
        )}

        {/* Tournament grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered
            .filter((t) => filter !== "ALL" || !t.featured)
            .map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
        </div>

        {/* Create tournament CTA */}
        <div className="mt-10 glass rounded-3xl p-8 text-center border border-violet-500/20">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Host Your Own Tournament</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            Set up prize pools, entry fees, and run multi-round tournaments for your community.
            Smart contracts auto-distribute rewards.
          </p>
          <Link href="/create" className="btn-primary py-3 px-8 gap-2">
            <Zap className="w-4 h-4" />
            Create Tournament
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedTournament({ tournament: t }: { tournament: (typeof TOURNAMENTS)[0] }) {
  const pct = (t.participants / t.maxParticipants) * 100;

  return (
    <div className="relative glass rounded-3xl p-6 sm:p-8 border border-violet-500/30 shadow-glow-purple mb-6 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${t.gradient} opacity-10 rounded-full blur-3xl`}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="status-dot-live" />
              <span className="text-xs font-bold text-emerald-400 uppercase">FEATURED • LIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{t.name}</h2>
            <p className="text-slate-400 mt-1">{t.description}</p>
          </div>
          <div className="text-5xl">{t.emoji}</div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <InfoBlock icon={<DollarSign className="w-4 h-4 text-amber-400" />} label="Prize Pool" value={`${t.prizePool} ${t.currency}`} highlight />
          <InfoBlock icon={<Users className="w-4 h-4 text-cyan-400" />} label="Players" value={`${t.participants}/${t.maxParticipants}`} />
          <InfoBlock icon={<Zap className="w-4 h-4 text-violet-400" />} label="Entry" value={t.entryFee === 0 ? "Free" : `${t.entryFee} RBTC`} />
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Spots filling up</span>
            <span>{t.maxParticipants - t.participants} remaining</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="progress-bar h-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <button className="btn-primary py-3 px-8 gap-2">
          <Star className="w-4 h-4" />
          Join Tournament
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function TournamentCard({ tournament: t }: { tournament: (typeof TOURNAMENTS)[0] }) {
  const start = new Date(t.startDate);
  const isLive = t.status === "ACTIVE";

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/50 hover:border-violet-500/30 transition-colors group">
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}
        >
          {t.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-white">{t.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                isLive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {isLive ? "🔴 LIVE" : "🔵 Soon"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-2">{t.description}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {t.participants}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {t.prizePool > 0 ? `${t.prizePool} RBTC` : "No prize"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {start.toLocaleDateString()}
            </span>
            <span
              className={`font-medium ${
                t.difficulty === "EASY"
                  ? "text-emerald-400"
                  : t.difficulty === "MEDIUM"
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {t.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          {t.entryFee === 0 ? (
            <span className="text-emerald-400 font-semibold">🆓 Free Entry</span>
          ) : (
            <span>Entry: {t.entryFee} RBTC</span>
          )}
        </span>
        <button className="flex items-center gap-1.5 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group-hover:gap-2">
          Join
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function InfoBlock({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="glass rounded-xl p-3 border border-slate-700/50">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        {icon}
        {label}
      </div>
      <div className={`font-bold text-sm ${highlight ? "gradient-text" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return <Filter className={`w-4 h-4 ${className}`} />;
}
