"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy, Users, Zap, DollarSign, Calendar, ChevronRight,
  Star, Filter, Loader2, Clock, RefreshCw, Gift, X,
  Brain, Shield, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { CATEGORIES, QuizCategory, Difficulty } from "@/types";

interface Tournament {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: Difficulty;
  prizeType: string;
  prizePool: number;
  prizeCurrency: string;
  prizeDescription: string;
  prizeDisplay: string;
  entryFee: number;
  scheduledAt: string | null;
  status: "UPCOMING" | "LIVE" | "ENDED";
  participantCount: number;
  maxPlayers: number;
  roomCode: string | null;
  hostName: string;
  hostImage: string | null;
  timesPlayed: number;
}

interface Stats {
  total: number;
  live: number;
  upcoming: number;
}

function getTimeLeft(iso: string | null): { d: number; h: number; m: number; s: number } | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function Countdown({ iso, large }: { iso: string; large?: boolean }) {
  const [left, setLeft] = useState(() => getTimeLeft(iso));

  useEffect(() => {
    const id = setInterval(() => setLeft(getTimeLeft(iso)), 1000);
    return () => clearInterval(id);
  }, [iso]);

  if (!left) return <span className={`text-emerald-400 font-semibold ${large ? "text-lg" : "text-sm"}`}>Starting now!</span>;

  if (left.d > 0) {
    return (
      <span className={`text-slate-300 tabular-nums ${large ? "text-lg font-bold" : "text-sm"}`}>
        {left.d}d {left.h}h {left.m}m
      </span>
    );
  }
  return (
    <span className={`text-amber-300 font-mono tabular-nums ${large ? "text-2xl font-black" : "text-sm"}`}>
      {String(left.h).padStart(2, "0")}:{String(left.m).padStart(2, "0")}:{String(left.s).padStart(2, "0")}
    </span>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function TournamentModal({ tournament: t, onClose }: { tournament: Tournament; onClose: () => void }) {
  const router = useRouter();
  const cat = CATEGORIES.find((c) => c.id === t.category);
  const isLive = t.status === "LIVE";
  const pct = Math.min((t.participantCount / t.maxPlayers) * 100, 100);

  const handleJoin = () => {
    if (t.roomCode) {
      router.push(`/play/${t.roomCode}`);
    }
  };

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-lg glass rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden animate-fade-in">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat?.gradient || "from-violet-500 to-cyan-500"}`} />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat?.gradient || "from-violet-500 to-cyan-500"} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
              {cat?.emoji ?? "🏆"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                  isLive
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                }`}>
                  {isLive ? "🔴 LIVE" : "🔵 Upcoming"}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  t.difficulty === "EASY" ? "text-emerald-300 bg-emerald-500/10" :
                  t.difficulty === "MEDIUM" ? "text-amber-300 bg-amber-500/10" :
                  "text-red-300 bg-red-500/10"
                }`}>
                  {t.difficulty === "EASY" ? "😊" : t.difficulty === "MEDIUM" ? "🔥" : "💀"} {t.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-black text-white leading-snug">{t.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{cat?.label} · Hosted by {t.hostName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Description */}
          {t.description && (
            <p className="text-slate-300 text-sm leading-relaxed">{t.description}</p>
          )}

          {/* Countdown / live indicator */}
          <div className={`rounded-2xl p-4 border text-center ${
            isLive
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-cyan-500/20 bg-cyan-500/5"
          }`}>
            {isLive ? (
              <div className="flex items-center justify-center gap-2">
                <div className="status-dot-live" />
                <span className="text-emerald-400 font-bold text-lg">Tournament is Live!</span>
              </div>
            ) : t.scheduledAt ? (
              <>
                <p className="text-xs text-slate-500 mb-1.5 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Starts in
                </p>
                <Countdown iso={t.scheduledAt} large />
                <p className="text-xs text-slate-500 mt-1.5">
                  {new Date(t.scheduledAt).toLocaleString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </>
            ) : (
              <p className="text-slate-400 text-sm">Date to be announced</p>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <DetailTile
              icon={<PrizeIcon type={t.prizeType} />}
              label="Prize"
              value={t.prizeDisplay}
              accent={t.prizeType !== "NONE"}
            />
            <DetailTile
              icon={<Zap className="w-4 h-4 text-violet-400" />}
              label="Entry Fee"
              value={t.entryFee === 0 ? "🆓 Free" : `${t.entryFee} RBTC`}
            />
            <DetailTile
              icon={<Users className="w-4 h-4 text-cyan-400" />}
              label="Players"
              value={`${t.participantCount} / ${t.maxPlayers}`}
            />
            <DetailTile
              icon={<Brain className="w-4 h-4 text-pink-400" />}
              label="Category"
              value={`${cat?.emoji} ${cat?.label}`}
            />
          </div>

          {/* Spots progress */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Spots filled</span>
              <span>{t.maxPlayers - t.participantCount} remaining</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="progress-bar h-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Prize description for branded gift */}
          {t.prizeType === "BRANDED_GIFT" && t.prizeDescription && (
            <div className="rounded-xl p-3 border border-pink-500/20 bg-pink-500/5 text-sm text-pink-200">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5" /> Prize Details
              </p>
              <p className="text-slate-300 text-xs">{t.prizeDescription}</p>
            </div>
          )}

          {/* Room code info */}
          {!t.roomCode && (
            <div className="rounded-xl p-3 border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300 flex items-start gap-2">
              <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              The host hasn&apos;t opened the room yet. Check back closer to the start time.
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={handleJoin}
            disabled={!t.roomCode}
            className="flex-1 btn-primary py-3 gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLive ? (
              <>
                <Star className="w-4 h-4" fill="currentColor" />
                Join Now
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Enter Room
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TournamentsPage() {
  const [filter, setFilter] = useState<"ALL" | "LIVE" | "UPCOMING" | "FREE">("ALL");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, live: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [selected, setSelected] = useState<Tournament | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      const res = await fetch("/api/tournaments");
      const data = await res.json();
      setTournaments(data.tournaments ?? []);
      setStats(data.stats ?? { total: 0, live: 0, upcoming: 0 });
      setLastRefreshed(new Date());
    } catch (e) {
      console.error("Failed to fetch tournaments:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
    const id = setInterval(fetchTournaments, 30000);
    return () => clearInterval(id);
  }, [fetchTournaments]);

  const filtered = tournaments.filter((t) => {
    if (filter === "LIVE") return t.status === "LIVE";
    if (filter === "UPCOMING") return t.status === "UPCOMING";
    if (filter === "FREE") return t.entryFee === 0;
    return t.status !== "ENDED";
  });

  const featured = tournaments.find((t) => t.status === "LIVE");

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      {selected && (
        <TournamentModal tournament={selected} onClose={() => setSelected(null)} />
      )}

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
            Compete for prizes and exclusive badges. All scheduled and live tournaments in one place.
          </p>
        </div>

        {/* Live stats bar */}
        {!loading && (
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <StatPill icon={<Trophy className="w-3.5 h-3.5 text-amber-400" />} value={stats.total} label="Total" />
            <StatPill icon={<div className="status-dot-live scale-75" />} value={stats.live} label="Live now" highlight={stats.live > 0} />
            <StatPill icon={<Calendar className="w-3.5 h-3.5 text-cyan-400" />} value={stats.upcoming} label="Upcoming" />
            <button
              onClick={fetchTournaments}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              title={`Last updated: ${lastRefreshed.toLocaleTimeString()}`}
            >
              <RefreshCw className="w-3 h-3" />
              Refreshes live
            </button>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap items-center">
          <Filter className="w-4 h-4 text-slate-400 mt-0.5" />
          {(["ALL", "LIVE", "UPCOMING", "FREE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                filter === f
                  ? "bg-violet-600 border-violet-500 text-white"
                  : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {f === "FREE" ? "🆓 Free" : f === "LIVE" ? "🔴 Live" : f}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        )}

        {/* Featured LIVE tournament */}
        {!loading && filter === "ALL" && featured && (
          <FeaturedCard tournament={featured} onViewDetails={() => setSelected(featured)} />
        )}

        {/* Grid */}
        {!loading && (
          <>
            {filtered.filter((t) => filter !== "ALL" || t.id !== featured?.id).length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5">
                {filtered
                  .filter((t) => filter !== "ALL" || t.id !== featured?.id)
                  .map((t) => (
                    <TournamentCard key={t.id} tournament={t} onViewDetails={() => setSelected(t)} />
                  ))}
              </div>
            ) : (
              !featured && <EmptyState filter={filter} />
            )}
          </>
        )}

        {/* Create CTA */}
        <div className="mt-10 glass rounded-3xl p-8 text-center border border-violet-500/20">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Host Your Own Tournament</h3>
          <p className="text-slate-400 text-sm mb-5 max-w-md mx-auto">
            Schedule a quiz with prizes, set entry conditions, and share the room code with your community.
          </p>
          <Link href="/create" className="btn-primary py-3 px-8 gap-2">
            <Zap className="w-4 h-4" />
            Schedule Tournament
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function StatPill({ icon, value, label, highlight }: { icon: React.ReactNode; value: number; label: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-800 border border-slate-800">
      {icon}
      <span className={`text-sm font-bold ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function FeaturedCard({ tournament: t, onViewDetails }: { tournament: Tournament; onViewDetails: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === t.category);
  const pct = Math.min((t.participantCount / t.maxPlayers) * 100, 100);

  return (
    <div className="relative glass rounded-3xl p-6 sm:p-8 border border-violet-500/30 shadow-glow-purple mb-6 overflow-hidden">
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${cat?.gradient || "from-violet-500 to-cyan-500"} opacity-10 rounded-full blur-3xl`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="status-dot-live" />
              <span className="text-xs font-bold text-emerald-400 uppercase">Featured · Live Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{t.title}</h2>
            {t.description && <p className="text-slate-400 mt-1">{t.description}</p>}
          </div>
          <div className="text-5xl">{cat?.emoji ?? "🏆"}</div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <InfoBlock icon={<PrizeIcon type={t.prizeType} />} label="Prize" value={t.prizeDisplay} highlight={t.prizeType !== "NONE"} />
          <InfoBlock icon={<Users className="w-4 h-4 text-cyan-400" />} label="Players" value={`${t.participantCount}/${t.maxPlayers}`} />
          <InfoBlock icon={<Zap className="w-4 h-4 text-violet-400" />} label="Entry" value={t.entryFee === 0 ? "Free" : `${t.entryFee} RBTC`} />
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Spots filling</span>
            <span>{t.maxPlayers - t.participantCount} remaining</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="progress-bar h-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onViewDetails} className="btn-primary py-3 px-8 gap-2">
            <Star className="w-4 h-4" />
            View & Join
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {t.participantCount} joined
          </span>
        </div>
      </div>
    </div>
  );
}

function TournamentCard({ tournament: t, onViewDetails }: { tournament: Tournament; onViewDetails: () => void }) {
  const cat = CATEGORIES.find((c) => c.id === t.category);
  const isLive = t.status === "LIVE";

  return (
    <div className="glass rounded-2xl p-5 border border-slate-700/50 hover:border-violet-500/30 transition-colors group flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat?.gradient || "from-violet-500 to-cyan-500"} flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
          {cat?.emoji ?? "🏆"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-white truncate">{t.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 border ${
              isLive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
            }`}>
              {isLive ? "🔴 LIVE" : "🔵 Upcoming"}
            </span>
          </div>

          {t.description && (
            <p className="text-xs text-slate-400 mb-2 line-clamp-1">{t.description}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {t.participantCount}/{t.maxPlayers}
            </span>
            <span className={`font-medium ${
              t.difficulty === "EASY" ? "text-emerald-400" :
              t.difficulty === "MEDIUM" ? "text-amber-400" : "text-red-400"
            }`}>
              {t.difficulty}
            </span>
            {t.prizeDisplay !== "No Prize" && (
              <span className="flex items-center gap-1 text-amber-300">
                <PrizeIcon type={t.prizeType} small />
                {t.prizeDisplay}
              </span>
            )}
          </div>

          {/* Countdown or live */}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {isLive ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <div className="status-dot-live scale-50" />
                Live now
              </span>
            ) : t.scheduledAt ? (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                Starts in <Countdown iso={t.scheduledAt} />
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Date TBD
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <span className="text-xs text-slate-500">
          {t.entryFee === 0 ? (
            <span className="text-emerald-400 font-semibold">🆓 Free Entry</span>
          ) : (
            <span>Entry: {t.entryFee} RBTC</span>
          )}
        </span>
        <button
          onClick={onViewDetails}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors group-hover:gap-2 ${
            isLive ? "text-emerald-400 hover:text-emerald-300" : "text-violet-400 hover:text-violet-300"
          }`}
        >
          {isLive ? "Join Now" : "View & Join"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DetailTile({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl p-3 bg-dark-800/60 border border-slate-800">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        {icon}
        {label}
      </div>
      <div className={`font-bold text-sm ${accent ? "gradient-text" : "text-white"}`}>{value}</div>
    </div>
  );
}

function InfoBlock({ icon, label, value, highlight = false }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="glass rounded-xl p-3 border border-slate-700/50">
      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
        {icon}
        {label}
      </div>
      <div className={`font-bold text-sm ${highlight ? "gradient-text" : "text-white"}`}>{value}</div>
    </div>
  );
}

function PrizeIcon({ type, small }: { type: string; small?: boolean }) {
  const cls = small ? "w-3 h-3" : "w-4 h-4";
  if (type === "CRYPTO") return <Zap className={`${cls} text-amber-400`} />;
  if (type === "CASH") return <DollarSign className={`${cls} text-emerald-400`} />;
  if (type === "BRANDED_GIFT") return <Gift className={`${cls} text-pink-400`} />;
  return <Trophy className={`${cls} text-amber-400`} />;
}

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="text-center py-20 text-slate-500">
      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
      <p className="text-lg font-semibold text-slate-400 mb-2">
        {filter === "LIVE" ? "No live tournaments right now" :
         filter === "UPCOMING" ? "No upcoming tournaments yet" :
         filter === "FREE" ? "No free tournaments scheduled" :
         "No tournaments scheduled yet"}
      </p>
      <p className="text-sm mb-6">Be the first to create one!</p>
      <Link href="/create" className="btn-primary py-3 px-8 gap-2">
        <Zap className="w-4 h-4" />
        Schedule Tournament
      </Link>
    </div>
  );
}
