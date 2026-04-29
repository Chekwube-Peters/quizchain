"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Trophy, Share2, RotateCcw, Home, Medal, Zap, Clock } from "lucide-react";
import { formatScore, formatTime } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  nickname: string;
  score: number;
  totalTime: number;
  correctAnswers: number;
  walletAddress?: string;
}

// Confetti particle
function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      angle: number;
      spin: number;
    }[] = [];

    const colors = ["#8B5CF6", "#06B6D4", "#10B981", "#EC4899", "#F59E0B", "#EF4444"];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
      });
    }

    let frame: number;
    let opacity = 1;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = opacity;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.angle += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      });

      opacity -= 0.003;
      if (opacity > 0) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 1 }}
    />
  );
}

function ResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const myNickname = searchParams.get("nickname") || "";

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`results_${code}`);
    if (stored) {
      const data = JSON.parse(stored);
      setLeaderboard(data);
      setTimeout(() => setShowConfetti(true), 500);
      setTimeout(() => setRevealed(true), 800);
    }
  }, [code]);

  const myEntry = leaderboard.find((e) => e.nickname === myNickname);
  const top3 = leaderboard.slice(0, 3);

  const shareText = myEntry
    ? `I ranked #${myEntry.rank} with ${formatScore(myEntry.score)} points in a QuizChain quiz! Can you beat me? 🧠⚡`
    : "Just finished an epic quiz on QuizChain! 🏆";

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {showConfetti && <Confetti />}

      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="glow-orb w-[600px] h-[600px] bg-violet-600/15"
        style={{ top: "-100px", left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-4xl sm:text-5xl font-black text-white">
            Quiz <span className="gradient-text">Complete!</span>
          </h1>
          {myEntry && (
            <p className="text-slate-400 text-lg">
              You finished{" "}
              <span className="text-white font-bold">
                {myEntry.rank === 1 ? "1st 🥇" : myEntry.rank === 2 ? "2nd 🥈" : myEntry.rank === 3 ? "3rd 🥉" : `#${myEntry.rank}`}
              </span>{" "}
              with{" "}
              <span className="gradient-text font-bold">
                {formatScore(myEntry.score)}
              </span>{" "}
              points
            </p>
          )}
        </div>

        {/* Podium — Top 3 */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-10">
            {/* 2nd */}
            <PodiumCard entry={top3[1]} place={2} revealed={revealed} />
            {/* 1st */}
            <PodiumCard entry={top3[0]} place={1} revealed={revealed} />
            {/* 3rd */}
            <PodiumCard entry={top3[2]} place={3} revealed={revealed} />
          </div>
        )}

        {/* My result card */}
        {myEntry && (
          <div className="glass rounded-3xl p-6 border border-violet-500/30 shadow-glow-purple mb-6">
            <h3 className="text-sm font-semibold text-violet-300 mb-4 flex items-center gap-2">
              <Medal className="w-4 h-4" />
              Your Performance
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <StatBlock
                icon={<Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />}
                value={`#${myEntry.rank}`}
                label="Rank"
              />
              <StatBlock
                icon={<Zap className="w-5 h-5 text-violet-400 mx-auto mb-1" />}
                value={formatScore(myEntry.score)}
                label="Score"
              />
              <StatBlock
                icon={<Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" />}
                value={formatTime(myEntry.totalTime)}
                label="Total Time"
              />
            </div>
          </div>
        )}

        {/* Full leaderboard */}
        <div className="glass rounded-3xl p-5 border border-slate-700/50 mb-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Final Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.nickname}
                className={`lb-row ${entry.nickname === myNickname ? "current-player" : ""}`}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateX(0)" : "translateX(-20px)",
                  transition: `all 0.4s ease ${i * 0.05}s`,
                }}
              >
                <span className="w-7 text-center text-sm font-bold">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <img
                  src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${entry.nickname}&backgroundColor=0f172a`}
                  alt={entry.nickname}
                  className="w-7 h-7 rounded-full"
                />
                <span className="flex-1 text-sm font-medium text-white truncate">
                  {entry.nickname}
                  {entry.nickname === myNickname && (
                    <span className="ml-1.5 text-xs text-violet-400">(you)</span>
                  )}
                </span>
                <div className="text-right">
                  <div className="text-sm font-bold gradient-text">
                    {formatScore(entry.score)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {entry.correctAnswers} correct
                  </div>
                </div>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-center text-slate-500 py-4">Loading results...</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              navigator.share?.({ text: shareText, url: window.location.href }) ||
                navigator.clipboard.writeText(shareText);
            }}
            className="btn-secondary flex-1 gap-2 py-3"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </button>
          <Link href="/play" className="btn-secondary flex-1 gap-2 py-3 text-center">
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Link>
          <Link href="/" className="btn-primary flex-1 gap-2 py-3 text-center justify-center">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* Web3 CTA */}
        <div className="mt-6 glass rounded-2xl p-5 border border-amber-500/20 text-center">
          <p className="text-sm text-amber-300 font-semibold mb-1">🏆 Claim your NFT Badge</p>
          <p className="text-xs text-slate-400 mb-3">
            Connect your wallet to receive your achievement badge on Rootstock
          </p>
          <button className="btn-primary py-2.5 px-8 text-sm gap-2">
            <Zap className="w-4 h-4" />
            Connect Wallet & Claim
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <ResultsPage />
    </Suspense>
  );
}

function PodiumCard({
  entry,
  place,
  revealed,
}: {
  entry: LeaderboardEntry;
  place: number;
  revealed: boolean;
}) {
  const heights = { 1: "h-28", 2: "h-20", 3: "h-16" };
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  const colors = {
    1: "border-yellow-400/50 bg-yellow-500/10 shadow-[0_0_30px_rgba(234,179,8,0.3)]",
    2: "border-slate-400/50 bg-slate-500/10",
    3: "border-amber-600/50 bg-amber-700/10",
  };

  return (
    <div
      className="flex flex-col items-center gap-2 flex-1 max-w-[130px]"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.6s ease ${place * 0.15}s`,
      }}
    >
      <img
        src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${entry.nickname}&backgroundColor=0f172a`}
        alt={entry.nickname}
        className={`rounded-full border-2 ${place === 1 ? "w-16 h-16 border-yellow-400" : "w-12 h-12 border-slate-600"}`}
      />
      <p className="text-xs font-bold text-white text-center truncate w-full px-1">
        {entry.nickname}
      </p>
      <p className="text-xs gradient-text font-bold">{formatScore(entry.score)}</p>
      <div
        className={`w-full rounded-t-xl border-t-2 border-x-2 flex items-center justify-center font-black text-2xl ${heights[place as 1 | 2 | 3]} ${colors[place as 1 | 2 | 3]}`}
      >
        {medals[place as 1 | 2 | 3]}
      </div>
    </div>
  );
}

function StatBlock({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div>
      {icon}
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}
