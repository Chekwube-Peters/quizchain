"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Trophy, Zap, Medal, Flame, Star, Clock, Brain,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { formatScore, formatTime } from "@/lib/utils";

interface ProfileData {
  id: string;
  name: string | null;
  image: string | null;
  username: string | null;
  totalScore: number;
  quizzesWon: number;
  quizzesPlayed: number;
  quizzesHosted: number;
  createdAt: string;
  achievements: { id: string; type: string; title: string; earnedAt: string }[];
  history: {
    id: string;
    quizTitle: string;
    category: string;
    rank: number | null;
    score: number;
    totalTime: number;
    roomCode: string;
    date: string;
  }[];
}

const ACHIEVEMENT_DEFS = [
  { type: "FIRST_WIN", icon: "🥇", title: "First Victory", desc: "Won your first quiz", rarity: "Common", check: (p: ProfileData) => p.quizzesWon >= 1 },
  { type: "SPEED_DEMON", icon: "⚡", title: "Speed Demon", desc: "Answered quickly and correctly", rarity: "Rare", check: (p: ProfileData) => p.quizzesPlayed >= 3 },
  { type: "STREAK_5", icon: "🔥", title: "5 Streak", desc: "Got 5 correct answers in a row", rarity: "Rare", check: (p: ProfileData) => p.quizzesPlayed >= 5 },
  { type: "PERFECT_SCORE", icon: "💯", title: "Perfect Score", desc: "Got 100% on a quiz", rarity: "Epic", check: (_p: ProfileData) => false },
  { type: "STREAK_10", icon: "🌟", title: "10 Streak", desc: "Got 10 correct answers in a row", rarity: "Epic", check: (_p: ProfileData) => false },
  { type: "QUIZ_CREATOR", icon: "🧠", title: "Quiz Creator", desc: "Created your first quiz", rarity: "Common", check: (p: ProfileData) => p.quizzesHosted >= 1 },
  { type: "TOURNAMENT_WINNER", icon: "🏆", title: "Tournament Winner", desc: "Won a tournament", rarity: "Legendary", check: (_p: ProfileData) => false },
  { type: "COMMUNITY_STAR", icon: "⭐", title: "Community Star", desc: "Played in 10+ quizzes", rarity: "Epic", check: (p: ProfileData) => p.quizzesPlayed >= 10 },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-400",
  Rare: "text-blue-400",
  Epic: "text-violet-400",
  Legendary: "text-amber-400",
};

export default function ProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"achievements" | "history">("achievements");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin?callbackUrl=/profile");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((d) => setProfile(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || status === "unauthenticated" || loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const achievements = ACHIEVEMENT_DEFS.map((a) => ({
    ...a,
    earned: a.check(profile),
  }));

  const earnedCount = achievements.filter((a) => a.earned).length;
  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const avatarSeed = profile.username || profile.name || profile.id;
  const avatarUrl = profile.image ||
    `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=0f172a`;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-violet-500/20 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatarUrl} alt="Profile" className="w-20 h-20 rounded-2xl border-2 border-violet-500/40" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-dark-900" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-white">
                  {profile.name || profile.username || "Player"}
                </h1>
                {profile.username && (
                  <span className="text-xs text-slate-500 font-mono">@{profile.username}</span>
                )}
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Joined {joinDate} · {profile.quizzesPlayed} quizzes played
              </p>
              <div className="flex flex-wrap gap-4">
                <MiniStat icon={<Trophy className="w-3.5 h-3.5 text-yellow-400" />} value={profile.quizzesWon} label="Wins" />
                <MiniStat icon={<Zap className="w-3.5 h-3.5 text-violet-400" />} value={formatScore(profile.totalScore)} label="Total Score" />
                <MiniStat icon={<Medal className="w-3.5 h-3.5 text-cyan-400" />} value={`${earnedCount}/${achievements.length}`} label="Badges" />
                <MiniStat icon={<Brain className="w-3.5 h-3.5 text-pink-400" />} value={profile.quizzesHosted} label="Hosted" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-800 p-1 rounded-2xl border border-slate-800 w-fit">
          {(["achievements", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                activeTab === tab ? "bg-violet-600 text-white shadow-glow-purple" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "achievements" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-bold">{earnedCount}</span> of {achievements.length} earned
              </p>
              <div className="h-2 w-40 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full progress-bar" style={{ width: `${(earnedCount / achievements.length) * 100}%` }} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.type}
                  className={`glass rounded-2xl p-4 border transition-all ${
                    a.earned ? "border-violet-500/30 hover:-translate-y-1 hover:shadow-glow-purple" : "border-slate-800 opacity-50 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <div className={`text-xs font-bold mb-1 ${RARITY_COLORS[a.rarity]}`}>{a.rarity}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{a.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
                  {a.earned && (
                    <div className="mt-3 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <span className="text-xs text-yellow-400 font-medium">Earned</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="glass rounded-3xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white">Quiz History</h3>
            </div>
            {profile.history.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Flame className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No quiz history yet</p>
                <Link href="/play" className="mt-4 inline-block text-xs text-violet-400 hover:text-violet-300">
                  Join a quiz →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {profile.history.map((h) => (
                  <div key={h.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="w-8 h-8 flex items-center justify-center rounded-xl text-lg bg-dark-700">
                      {h.rank === 1 ? "🥇" : h.rank === 2 ? "🥈" : h.rank === 3 ? "🥉" : h.rank ? `#${h.rank}` : "—"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{h.quizTitle}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-500">{h.category}</span>
                        <span className="text-xs text-slate-600">·</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(h.date).toLocaleDateString()}
                        </span>
                        {h.totalTime > 0 && (
                          <>
                            <span className="text-xs text-slate-600">·</span>
                            <span className="text-xs text-slate-500">{formatTime(h.totalTime)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold gradient-text">{formatScore(h.score)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-white font-bold text-sm">{value}</span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}

