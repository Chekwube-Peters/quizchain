"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import {
  Play,
  Users,
  Copy,
  Check,
  SkipForward,
  StopCircle,
  Trophy,
  Share2,
  QrCode,
} from "lucide-react";
import { Player, LeaderboardEntry } from "@/types";
import { formatScore } from "@/lib/utils";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

type GamePhase = "waiting" | "question" | "question-end" | "ended";

function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const code = (params.code as string).toUpperCase();
  const isHost = searchParams.get("host") === "true";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [phase, setPhase] = useState<GamePhase>("waiting");
  const [currentQuestion, setCurrentQuestion] = useState<{
    id: string;
    text: string;
    options: string[];
    timeLimit: number;
    questionIndex: number;
    totalQuestions: number;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [answerStats, setAnswerStats] = useState<{ answered: number; total: number }>({ answered: 0, total: 0 });
  const [copied, setCopied] = useState(false);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz_${code}`);

    const s = io(window.location.origin, { transports: ["websocket", "polling"] });
    setSocket(s);

    s.on("connect", () => {
      if (isHost && stored) {
        const quiz = JSON.parse(stored);
        s.emit("room:host", { code, quiz });
      }
    });

    s.on("room:host-joined", ({ room }) => {
      setPlayers(room.players || []);
    });

    s.on("room:players-update", (updatedPlayers) => {
      setPlayers(updatedPlayers);
      setAnswerStats((a) => ({ ...a, total: updatedPlayers.length }));
    });

    s.on("player:joined", (player) => {
      setPlayers((prev) => {
        if (prev.find((p) => p.id === player.id)) return prev;
        return [...prev, player];
      });
    });

    s.on("player:left", (playerId) => {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
    });

    s.on("quiz:question", ({ question, questionIndex, totalQuestions, timeLimit }) => {
      setPhase("question");
      setCurrentQuestion({ ...question, questionIndex, totalQuestions, timeLimit });
      setTimeLeft(timeLimit);
      setCorrectIndex(null);
      setAnswerStats({ answered: 0, total: players.length });
    });

    s.on("quiz:question-end", ({ correctIndex, scores }) => {
      setPhase("question-end");
      setCorrectIndex(correctIndex);
      setLeaderboard(scores);
    });

    s.on("quiz:scores", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    s.on("quiz:end", ({ leaderboard }) => {
      setPhase("ended");
      setLeaderboard(leaderboard);
      sessionStorage.setItem(`results_${code}`, JSON.stringify(leaderboard));
      setTimeout(() => {
        window.location.href = `/results/${code}`;
      }, 3000);
    });

    s.on("room:error", (msg) => {
      console.error("Room error:", msg);
    });

    return () => {
      s.disconnect();
    };
  }, [code, isHost]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "question" || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const handleStart = () => {
    if (!socket) return;
    socket.emit("host:start", { roomCode: code });
  };

  const handleNext = () => {
    if (!socket) return;
    socket.emit("host:next", { roomCode: code });
  };

  const handleEnd = () => {
    if (!socket) return;
    if (confirm("End the quiz now?")) {
      socket.emit("host:end", { roomCode: code });
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const url = `${window.location.origin}/play/${code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timerPct = currentQuestion
    ? (timeLeft / currentQuestion.timeLimit) * 100
    : 100;
  const timerColor =
    timerPct > 50 ? "#8B5CF6" : timerPct > 25 ? "#F59E0B" : "#EF4444";

  if (!isHost) {
    return (
      <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="glass rounded-3xl p-8 text-center max-w-sm border border-slate-700">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">Host Access Only</h2>
          <p className="text-slate-400 text-sm mb-4">
            Players should use the Play page to join.
          </p>
          <Link href={`/play/${code}`} className="btn-primary text-sm py-2 px-6">
            Join as Player
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="status-dot-live" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {phase === "waiting" ? "Waiting Room" : phase === "ended" ? "Ended" : "Live"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Host Dashboard{" "}
              <span className="gradient-text font-mono">#{code}</span>
            </h1>
          </div>

          {phase === "question" && (
            <div className="flex items-center gap-3">
              <button onClick={handleNext} className="btn-secondary py-2 px-4 text-sm gap-2">
                <SkipForward className="w-4 h-4" />
                Next
              </button>
              <button
                onClick={handleEnd}
                className="py-2 px-4 text-sm rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <StopCircle className="w-4 h-4" />
                End Quiz
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Main panel */}
          <div className="lg:col-span-2 space-y-6">
            {phase === "waiting" && (
              <WaitingPanel
                code={code}
                players={players}
                onStart={handleStart}
                onCopyCode={copyCode}
                onShareLink={shareLink}
                copied={copied}
                onShowQR={() => setShowQR(true)}
              />
            )}
            {(phase === "question" || phase === "question-end") && currentQuestion && (
              <QuestionPanel
                question={currentQuestion}
                timeLeft={timeLeft}
                timerPct={timerPct}
                timerColor={timerColor}
                phase={phase}
                correctIndex={correctIndex}
                answerStats={answerStats}
                onNext={handleNext}
              />
            )}
            {phase === "ended" && (
              <div className="glass rounded-3xl p-8 text-center border border-violet-500/20">
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="text-2xl font-black text-white mb-2">Quiz Ended!</h2>
                <p className="text-slate-400">Redirecting to results...</p>
              </div>
            )}
          </div>

          {/* Right: Leaderboard */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Leaderboard
                </h3>
                <span className="text-xs text-slate-500">
                  {players.length} players
                </span>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {(leaderboard.length > 0
                  ? leaderboard
                  : players
                      .sort((a, b) => b.score - a.score)
                      .map((p, i) => ({ ...p, rank: i + 1, correctAnswers: 0 }))
                ).map((entry, i) => (
                  <div key={entry.id || i} className="lb-row">
                    <span className="w-6 text-center text-sm font-bold">
                      {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}
                    </span>
                    <img
                      src={
                        entry.avatar ||
                        `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${entry.nickname}&backgroundColor=0f172a`
                      }
                      alt={entry.nickname}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="flex-1 text-sm font-medium text-white truncate">
                      {entry.nickname}
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {formatScore(entry.score)}
                    </span>
                  </div>
                ))}
                {players.length === 0 && (
                  <p className="text-center text-slate-500 text-sm py-4">
                    Waiting for players...
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3 text-center border border-slate-700/50">
                <div className="text-2xl font-black text-white">{players.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Players</div>
              </div>
              {currentQuestion && (
                <div className="glass rounded-xl p-3 text-center border border-slate-700/50">
                  <div className="text-2xl font-black gradient-text">
                    {currentQuestion.questionIndex + 1}/{currentQuestion.totalQuestions}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Question</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="glass rounded-3xl p-6 border border-violet-500/30 text-center max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-white mb-1">Scan to Join</h3>
            <p className="text-slate-400 text-sm mb-4">
              Point your phone camera at this QR code
            </p>
            <div className="rounded-2xl overflow-hidden bg-white p-3 mx-auto w-fit mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  typeof window !== "undefined"
                    ? `${window.location.origin}/play/${code}`
                    : `/play/${code}`
                )}&margin=0`}
                alt="QR code"
                width={180}
                height={180}
              />
            </div>
            <p className="font-mono text-violet-300 font-bold tracking-widest text-lg mb-4">
              {code}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="btn-secondary py-2 px-6 text-sm w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoomPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <RoomPage />
    </Suspense>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function WaitingPanel({
  code,
  players,
  onStart,
  onCopyCode,
  onShareLink,
  copied,
  onShowQR,
}: {
  code: string;
  players: Player[];
  onStart: () => void;
  onCopyCode: () => void;
  onShareLink: () => void;
  copied: boolean;
  onShowQR: () => void;
}) {
  return (
    <div className="glass rounded-3xl p-6 border border-violet-500/20 space-y-6">
      {/* Room code display */}
      <div className="text-center">
        <p className="text-sm text-slate-400 mb-2">Share this code with players</p>
        <div className="inline-flex items-center gap-3 bg-dark-600 rounded-2xl px-6 py-4 border border-violet-500/30">
          <span className="text-4xl font-black tracking-[0.4em] text-white font-mono">
            {code}
          </span>
          <button
            onClick={onCopyCode}
            className="p-2 rounded-xl hover:bg-violet-500/20 transition-colors text-violet-400"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Share options */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onShareLink}
          className="btn-secondary py-2 px-4 text-sm gap-2"
        >
          <Share2 className="w-4 h-4" />
          Copy Link
        </button>
        <button onClick={onShowQR} className="btn-secondary py-2 px-4 text-sm gap-2">
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>

      {/* Players grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Players joined ({players.length})
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[60px]">
          {players.map((p) => (
            <div key={p.id} className="player-chip">
              <img
                src={
                  p.avatar ||
                  `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${p.nickname}&backgroundColor=0f172a`
                }
                alt={p.nickname}
                className="w-5 h-5 rounded-full"
              />
              <span className="text-white text-xs font-medium">{p.nickname}</span>
            </div>
          ))}
          {players.length === 0 && (
            <p className="text-slate-500 text-sm italic w-full text-center py-3">
              Share the code — players will appear here
            </p>
          )}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        disabled={players.length === 0}
        className="btn-primary w-full py-4 text-base gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Play className="w-5 h-5" fill="currentColor" />
        Start Quiz
        {players.length > 0 && (
          <span className="ml-1 text-sm opacity-80">
            ({players.length} player{players.length !== 1 ? "s" : ""})
          </span>
        )}
      </button>
    </div>
  );
}

function QuestionPanel({
  question,
  timeLeft,
  timerPct,
  timerColor,
  phase,
  correctIndex,
  answerStats,
  onNext,
}: {
  question: {
    id: string;
    text: string;
    options: string[];
    timeLimit: number;
    questionIndex: number;
    totalQuestions: number;
  };
  timeLeft: number;
  timerPct: number;
  timerColor: string;
  phase: GamePhase;
  correctIndex: number | null;
  answerStats: { answered: number; total: number };
  onNext: () => void;
}) {
  const circumference = 2 * Math.PI * 30;
  const dash = (timerPct / 100) * circumference;

  return (
    <div className="glass rounded-3xl p-6 border border-violet-500/20 space-y-5">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>
            Question {question.questionIndex + 1} of {question.totalQuestions}
          </span>
          <span>{answerStats.answered}/{answerStats.total} answered</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="progress-bar h-full transition-all duration-300"
            style={{
              width: `${((question.questionIndex + 1) / question.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Timer + Question */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0 w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 76 76">
            <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="4" />
            <circle
              cx="38"
              cy="38"
              r="30"
              fill="none"
              stroke={timerColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
            {timeLeft}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xl font-bold text-white leading-snug">{question.text}</p>
        </div>
      </div>

      {/* Answer options preview */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
              phase === "question-end" && i === correctIndex
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                : phase === "question-end"
                ? "border-slate-700 bg-slate-800/30 text-slate-500"
                : "border-slate-700 bg-dark-600/50 text-slate-300"
            }`}
          >
            <span className="text-xs font-bold text-slate-500 mr-2">
              {["A", "B", "C", "D"][i]}
            </span>
            {opt}
            {phase === "question-end" && i === correctIndex && (
              <span className="ml-2 text-emerald-400">✓</span>
            )}
          </div>
        ))}
      </div>

      {phase === "question-end" && (
        <button onClick={onNext} className="btn-primary w-full py-3 gap-2">
          <SkipForward className="w-4 h-4" />
          Next Question
        </button>
      )}
    </div>
  );
}
