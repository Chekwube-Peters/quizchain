"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Plus, Trophy, Users, Zap, Brain, Play, Copy, Check, TrendingUp, Loader2,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { CATEGORIES } from "@/types";

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  status: string;
  questionCount: number;
  timesPlayed: number;
  createdAt: string;
  roomCode: string | null;
  roomStatus: string | null;
  playerCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quizzes" | "analytics">("quizzes");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin?callbackUrl=/dashboard");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/quiz/my-quizzes")
      .then((r) => r.json())
      .then((d) => setQuizzes(d.quizzes || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const totalPlayers = quizzes.reduce((s, q) => s + q.playerCount, 0);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">
              Host <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {session?.user?.name?.split(" ")[0] || "Host"}
            </p>
          </div>
          <Link href="/create" className="btn-primary py-3 px-6 gap-2 w-fit">
            <Plus className="w-4 h-4" />
            New Quiz
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Brain className="w-5 h-5" />} value={String(quizzes.length)} label="Quizzes Created" color="text-violet-400" bg="bg-violet-500/10" />
          <StatCard icon={<Users className="w-5 h-5" />} value={String(totalPlayers)} label="Total Players" color="text-cyan-400" bg="bg-cyan-500/10" />
          <StatCard icon={<Trophy className="w-5 h-5" />} value={String(quizzes.reduce((s, q) => s + q.timesPlayed, 0))} label="Times Played" color="text-amber-400" bg="bg-amber-500/10" />
          <StatCard icon={<Zap className="w-5 h-5" />} value={String(quizzes.filter((q) => q.status === "PUBLISHED").length)} label="Published" color="text-emerald-400" bg="bg-emerald-500/10" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-dark-700 rounded-2xl w-fit mb-6 border border-slate-800">
          {(["quizzes", "analytics"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? "bg-violet-600 text-white shadow-glow-purple" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "quizzes" && (
          <QuizzesTab quizzes={quizzes} loading={loading} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab quizzes={quizzes} />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }: {
  icon: React.ReactNode; value: string; label: string; color: string; bg: string;
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

function QuizzesTab({ quizzes, loading }: { quizzes: Quiz[]; loading: boolean }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [launching, setLaunching] = useState<string | null>(null);
  const router = useRouter();

  const copyCode = async (id: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const launchQuiz = async (quizId: string) => {
    setLaunching(quizId);
    try {
      const res = await fetch(`/api/quiz/${quizId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem(`quiz_${data.roomCode}`, JSON.stringify(data.quiz));
      router.push(`/room/${data.roomCode}?host=true`);
    } catch (e) {
      console.error(e);
      alert("Failed to launch quiz. Please try again.");
    } finally {
      setLaunching(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const cat = CATEGORIES.find((c) => c.id === quiz.category);
        const isLaunching = launching === quiz.id;
        return (
          <div key={quiz.id} className="glass rounded-2xl p-5 border border-slate-700/40 hover:border-violet-500/30 transition-colors group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat?.gradient || "from-violet-500 to-cyan-500"} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                  {cat?.emoji || "🧠"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-white truncate">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${
                      quiz.status === "PUBLISHED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                    }`}>
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
                    <span>{quiz.questionCount} questions</span>
                    <span>·</span>
                    <span>{quiz.timesPlayed} plays</span>
                    <span>·</span>
                    <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {quiz.roomCode && (
                  <button
                    onClick={() => copyCode(quiz.id, quiz.roomCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                  >
                    {copiedId === quiz.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === quiz.id ? "Copied!" : quiz.roomCode}
                  </button>
                )}
                <button
                  onClick={() => launchQuiz(quiz.id)}
                  disabled={isLaunching}
                  className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors disabled:opacity-50"
                >
                  {isLaunching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {quizzes.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold mb-2">No quizzes yet</p>
          <p className="text-sm mb-6">Create your first quiz to get started</p>
          <Link href="/create" className="btn-primary py-3 px-8 gap-2">
            <Plus className="w-4 h-4" />
            Create Quiz
          </Link>
        </div>
      )}

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

function AnalyticsTab({ quizzes }: { quizzes: Quiz[] }) {
  const byCategory = quizzes.reduce<Record<string, number>>((acc, q) => {
    acc[q.category] = (acc[q.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...categories.map(([, n]) => n), 1);

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 border border-slate-700/50">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Quizzes by Category
        </h3>
        {categories.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No data yet — create some quizzes first</p>
        ) : (
          <div className="space-y-3">
            {categories.map(([cat, count]) => {
              const info = CATEGORIES.find((c) => c.id === cat);
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg w-8">{info?.emoji || "🧠"}</span>
                  <span className="text-sm text-slate-300 w-28 truncate">{info?.label || cat}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar transition-all duration-700"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white w-4">{count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Total Questions Created", value: quizzes.reduce((s, q) => s + q.questionCount, 0) },
          { label: "Total Times Played", value: quizzes.reduce((s, q) => s + q.timesPlayed, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-2xl p-5 border border-slate-700/50 text-center">
            <div className="text-3xl font-black gradient-text mb-1">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
