"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Zap, Users, Trophy, Brain } from "lucide-react";

const DEMO_QUESTIONS = [
  { text: "What is the native currency of Rootstock?", correct: "RBTC" },
  { text: "Which consensus does Bitcoin use?", correct: "Proof of Work" },
  { text: "How many Satoshis equal 1 BTC?", correct: "100,000,000" },
];

const TICKER_ITEMS = [
  "🏆 CryptoDAO won $2,400 RBTC",
  "🔥 24,891 players online",
  "⚡ Bitcoin Basics Quiz LIVE",
  "🎯 New: Rootstock Deep Dive",
  "🥇 Speed record: 0.8s answer",
  "💎 NFT badges earned today: 342",
  "🌍 Players from 47 countries",
];

export default function Hero() {
  const [activeQ, setActiveQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(4200);
  const [timeLeft, setTimeLeft] = useState(22);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQ((q) => (q + 1) % DEMO_QUESTIONS.length);
      setSelectedAnswer(null);
      setTimeLeft(22);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleAnswer = (i: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(i);
    if (i === 0) setScore((s) => s + 850);
  };

  const q = DEMO_QUESTIONS[activeQ];
  const timerPct = (timeLeft / 22) * 100;
  const circumference = 2 * Math.PI * 22;
  const dash = (timerPct / 100) * circumference;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900 grid-bg" />
      <div
        className="glow-orb w-[600px] h-[600px] bg-violet-600/20"
        style={{ top: "-100px", left: "-100px" }}
      />
      <div
        className="glow-orb w-[500px] h-[500px] bg-cyan-500/15"
        style={{ top: "200px", right: "-100px" }}
      />

      {/* Live ticker */}
      <div className="relative z-10 w-full bg-dark-800/80 border-b border-violet-500/10 overflow-hidden">
        <div className="flex items-center h-9">
          <div className="flex-shrink-0 flex items-center px-4 gap-2 h-full bg-violet-600/20 border-r border-violet-500/20">
            <div className="status-dot-live" />
            <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">LIVE</span>
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-12 animate-ticker whitespace-nowrap py-2 px-4">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="text-xs text-slate-400 flex-shrink-0">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
                <Zap className="w-3.5 h-3.5" fill="currentColor" />
                Web2 + Web3 Quiz Infrastructure
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                  <span className="text-white">Quiz your</span>
                  <br />
                  <span className="gradient-text">Community</span>
                  <br />
                  <span className="text-white">to the</span>{" "}
                  <span className="gradient-text-gold">Top</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                  AI-generated questions, live multiplayer battles, NFT achievement badges,
                  and BTC rewards on Rootstock. The only quiz platform your DAO needs.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                <Stat icon="⚡" value="10K+" label="Quizzes" />
                <Stat icon="👥" value="500+" label="Communities" />
                <Stat icon="₿" value="$50K+" label="Rewarded" />
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/create"
                  className="btn-primary py-4 px-8 text-base gap-2 group"
                >
                  <Brain className="w-5 h-5" />
                  Create with AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/play" className="btn-secondary py-4 px-8 text-base gap-2">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Join a Quiz
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["alex", "sam", "jordan", "kai", "morgan"].map((n) => (
                    <img
                      key={n}
                      src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${n}&backgroundColor=0f172a`}
                      alt={n}
                      className="w-8 h-8 rounded-full border-2 border-dark-900"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-white font-semibold">2,400+ players</span> joined today
                </p>
              </div>
            </div>

            {/* Right: Live demo card */}
            <div className="relative flex justify-center">
              {/* Floating badges */}
              <FloatingBadge
                className="top-0 -left-4 lg:-left-8"
                delay="0s"
                content={
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-white">+850 pts</span>
                  </div>
                }
              />
              <FloatingBadge
                className="bottom-8 -right-4 lg:-right-8"
                delay="1s"
                content={
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">247 playing</span>
                  </div>
                }
              />

              {/* Quiz mockup */}
              <div className="w-full max-w-md glass rounded-3xl p-6 shadow-[0_0_60px_rgba(139,92,246,0.2)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-slate-400">Bitcoin Fundamentals</span>
                  </div>
                  {/* Timer ring */}
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="3" />
                      <circle
                        cx="28"
                        cy="28"
                        r="22"
                        fill="none"
                        stroke={timeLeft > 10 ? "#8B5CF6" : timeLeft > 5 ? "#F59E0B" : "#EF4444"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circumference}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                      {timeLeft}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <div className="text-xs text-slate-500 mb-2">
                    Question {activeQ + 1} of 3
                  </div>
                  <p className="text-white font-semibold text-lg leading-snug">
                    {q.text}
                  </p>
                </div>

                {/* Answers */}
                <div className="space-y-3">
                  {[q.correct, "ETH", "BNB", "ADA"].map((opt, i) => (
                    <button
                      key={`${activeQ}-${i}`}
                      onClick={() => handleAnswer(i)}
                      className={`answer-btn border-2 text-sm ${
                        selectedAnswer === null
                          ? i === 0
                            ? "border-violet-500/40 bg-violet-500/10 text-white hover:border-violet-400 hover:bg-violet-500/20"
                            : i === 1
                            ? "border-cyan-500/40 bg-cyan-500/10 text-white hover:border-cyan-400"
                            : i === 2
                            ? "border-pink-500/40 bg-pink-500/10 text-white hover:border-pink-400"
                            : "border-amber-500/40 bg-amber-500/10 text-white hover:border-amber-400"
                          : i === 0
                          ? "selected-correct"
                          : "opacity-40 border-slate-700 bg-slate-800/50 text-slate-400"
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          i === 0
                            ? "bg-violet-600"
                            : i === 1
                            ? "bg-cyan-600"
                            : i === 2
                            ? "bg-pink-600"
                            : "bg-amber-600"
                        }`}
                      >
                        {["A", "B", "C", "D"][i]}
                      </span>
                      <span className="font-medium">{opt}</span>
                    </button>
                  ))}
                </div>

                {/* Score */}
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=you&backgroundColor=0f172a"
                      className="w-6 h-6 rounded-full"
                      alt="You"
                    />
                    <span className="text-sm text-slate-400">Your score</span>
                  </div>
                  <div className="text-lg font-black gradient-text">
                    {score.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="relative z-10">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60V40C240 10 480 -10 720 20C960 50 1200 50 1440 30V60H0Z"
            fill="#0D0D1A"
          />
        </svg>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black text-white">
        {icon} {value}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function FloatingBadge({
  className,
  content,
  delay,
}: {
  className: string;
  content: React.ReactNode;
  delay: string;
}) {
  return (
    <div
      className={`absolute z-20 glass px-3 py-2 rounded-2xl shadow-card animate-float ${className}`}
      style={{ animationDelay: delay }}
    >
      {content}
    </div>
  );
}
