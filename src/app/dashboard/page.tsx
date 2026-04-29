"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trophy,
  Users,
  Zap,
  Brain,
  Play,
  Copy,
  Eye,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { CATEGORIES } from "@/types";

const DEMO_QUIZZES = [
  {
    id: "1",
    title: "Bitcoin Fundamentals",
    category: "BITCOIN" as const,
    difficulty: "EASY",
    questions: 10,
    plays: 342,
    avgScore: 7840,
    status: "PUBLISHED",
    code: "BTC123",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    title: "Rootstock DeFi Deep Dive",
    category: "ROOTSTOCK" as const,
    difficulty: "HARD",
    questions: 20,
    plays: 128,
    avgScore: 5200,
    status: "PUBLISHED",
    code: "RSK456",
    createdAt: "2025-01-18",
  },
  {
    id: "3",
    title: "Blockchain Essentials",
    category: "BLOCKCHAIN" as const,
    difficulty: "MEDIUM",
    questions: 15,
    plays: 0,
    avgScore: 0,
    status: "DRAFT",
    code: "BLK789",
    createdAt: "2025-01-20",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"quizzes" | "analytics" | "achievements">("quizzes");

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Host <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-1">Manage your quizzes and track performance</p>
          </div>
          <Link href="/create" className="btn-primary py-3 px-6 gap-2 w-fit">
            <Plus className="w-4 h-4" />
            New Quiz
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Brain className="w-5 h-5" />} value="3" label="Quizzes Created" color="text-violet-400" bg="bg-violet-500/10" />
          <StatCard icon={<Users className="w-5 h-5" />} value="470" label="Total Players" color="text-cyan-400" bg="bg-cyan-500/10" />
          <StatCard icon={<Trophy className="w-5 h-5" />} value="6,734" label="Avg Score" color="text-amber-400" bg="bg-amber-500/10" />
          <StatCard icon={<Zap className="w-5 h-5" />} value="2" label="Live Now" color="text-emerald-400" bg="bg-emerald-500/10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-dark-700 rounded-2xl w-fit mb-6 border border-slate-800">
          {(["quizzes", "analytics", "achievements"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-glow-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "quizzes" && <QuizzesTab quizzes={DEMO_QUIZZES} />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "achievements" && <AchievementsTab />}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 border border-slate-700/50">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center ${color} mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function QuizzesTab({ quizzes }: { quizzes: typeof DEMO_QUIZZES }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const cat = CATEGORIES.find((c) => c.id === quiz.category);
        return (
          <div key={quiz.id} className="glass rounded-2xl p-5 border border-slate-700/40 hover:border-violet-500/30 transition-colors group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Category icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat?.gradient} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}
                >
                  {cat?.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-white truncate">{quiz.title}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                        quiz.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className={`font-medium ${
                      quiz.difficulty === "EASY" ? "text-emerald-400" :
                      quiz.difficulty === "MEDIUM" ? "text-amber-400" : "text-red-400"
                    }`}>
                      {quiz.difficulty}
                    </span>
                    <span>·</span>
                    <span>{quiz.questions} questions</span>
                    <span>·</span>
                    <span>{quiz.plays} plays</span>
                    {quiz.avgScore > 0 && (
                      <>
                        <span>·</span>
                        <span>avg {quiz.avgScore.toLocaleString()} pts</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyCode(quiz.id, quiz.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  {copiedId === quiz.id ? "Copied!" : quiz.code}
                </button>
                <Link
                  href={`/room/${quiz.code}?host=true`}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Play className="w-4 h-4" />
                </Link>
                <button className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-violet-400 hover:border-violet-500/40 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Create new */}
      <Link
        href="/create"
        className="flex items-center justify-center gap-3 w-full p-5 rounded-2xl border-2 border-dashed border-slate-700 hover:border-violet-500/40 transition-colors text-slate-500 hover:text-violet-300 group"
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Create New Quiz</span>
      </Link>
    </div>
  );
}

function AnalyticsTab() {
  const data = [
    { day: "Mon", plays: 42 },
    { day: "Tue", plays: 78 },
    { day: "Wed", plays: 55 },
    { day: "Thu", plays: 120 },
    { day: "Fri", plays: 95 },
    { day: "Sat", plays: 145 },
    { day: "Sun", plays: 88 },
  ];
  const max = Math.max(...data.map((d) => d.plays));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="glass rounded-2xl p-5 border border-slate-700/50">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Plays This Week
        </h3>
        <div className="flex items-end gap-3 h-32">
          {data.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-slate-500">{d.plays}</span>
              <div
                className="w-full rounded-t-lg progress-bar transition-all duration-700"
                style={{ height: `${(d.plays / max) * 100}%` }}
              />
              <span className="text-xs text-slate-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top performers */}
      <div className="glass rounded-2xl p-5 border border-slate-700/50">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          Top Players Across All Quizzes
        </h3>
        <div className="space-y-3">
          {[
            { name: "CryptoKing", score: 48200, quizzes: 12 },
            { name: "BitMaster", score: 42100, quizzes: 9 },
            { name: "SAT0SHI", score: 38900, quizzes: 15 },
            { name: "Web3Wizard", score: 35400, quizzes: 8 },
          ].map((p, i) => (
            <div key={p.name} className="lb-row">
              <span className="w-6 text-center">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
              </span>
              <img
                src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${p.name}&backgroundColor=0f172a`}
                alt={p.name}
                className="w-7 h-7 rounded-full"
              />
              <span className="flex-1 text-sm font-medium text-white">{p.name}</span>
              <div className="text-right">
                <div className="text-sm font-bold gradient-text">{p.score.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{p.quizzes} quizzes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AchievementsTab() {
  const achievements = [
    { type: "FIRST_WIN", icon: "🥇", title: "First Victory", desc: "Won your first quiz", earned: true },
    { type: "SPEED_DEMON", icon: "⚡", title: "Speed Demon", desc: "Answered 10 questions in under 5s each", earned: true },
    { type: "PERFECT_SCORE", icon: "💯", title: "Perfect Score", desc: "Got 100% on a 20+ question quiz", earned: false },
    { type: "STREAK_5", icon: "🔥", title: "5 Streak", desc: "Got 5 correct answers in a row", earned: true },
    { type: "STREAK_10", icon: "🌟", title: "10 Streak", desc: "Got 10 correct answers in a row", earned: false },
    { type: "BLOCKCHAIN_EXPERT", icon: "⛓️", title: "Chain Expert", desc: "Top 3 in 5 blockchain quizzes", earned: false },
    { type: "TOURNAMENT_WINNER", icon: "🏆", title: "Tournament Winner", desc: "Won a tournament", earned: false },
    { type: "COMMUNITY_STAR", icon: "⭐", title: "Community Star", desc: "Played in 50+ different rooms", earned: false },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {achievements.map((a) => (
        <div
          key={a.type}
          className={`glass rounded-2xl p-4 text-center border transition-all ${
            a.earned
              ? "border-violet-500/30 bg-violet-500/5"
              : "border-slate-800 opacity-50 grayscale"
          }`}
        >
          <div className="text-4xl mb-2">{a.icon}</div>
          <h3 className="text-sm font-bold text-white mb-1">{a.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">{a.desc}</p>
          {a.earned && (
            <div className="mt-2 text-xs font-semibold text-violet-400">✓ Earned</div>
          )}
        </div>
      ))}
    </div>
  );
}
