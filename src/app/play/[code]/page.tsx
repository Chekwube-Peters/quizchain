"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Trophy, Flame } from "lucide-react";
import { formatScore, getRankIcon } from "@/lib/utils";

type GamePhase = "joining" | "waiting" | "question" | "answer-feedback" | "question-end" | "ended";

interface QuestionData {
  id: string;
  text: string;
  options: string[];
  timeLimit: number;
  questionIndex: number;
  totalQuestions: number;
  points: number;
}

interface AnswerFeedback {
  isCorrect: boolean;
  correctIndex: number;
  selectedIndex: number;
  pointsEarned: number;
  newScore: number;
  streakBonus: number;
  explanation?: string;
}

interface ScoreEntry {
  rank: number;
  nickname: string;
  score: number;
  correctAnswers: number;
}

function PlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();
  const nickname = searchParams.get("nickname") || "Player";

  const [socket, setSocket] = useState<Socket | null>(null);
  const [phase, setPhase] = useState<GamePhase>("joining");
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myStreak, setMyStreak] = useState(0);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [roomInfo, setRoomInfo] = useState<{ title: string; totalQuestions: number } | null>(null);
  const [playerCount, setPlayerCount] = useState(0);
  const [error, setError] = useState("");
  const [showScorePop, setShowScorePop] = useState(false);
  const answerTimeRef = useRef<number>(0);

  useEffect(() => {
    const s = io(window.location.origin, { transports: ["websocket", "polling"] });
    setSocket(s);

    let retries = 0;
    const MAX_RETRIES = 6;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const attemptJoin = () => {
      s.emit("room:join", { code, nickname, walletAddress: undefined });
    };

    s.on("connect", () => {
      attemptJoin();
    });

    s.on("room:joined", ({ room }) => {
      if (retryTimer) clearTimeout(retryTimer);
      setPhase("waiting");
      setRoomInfo({
        title: room.quiz?.title || `Quiz #${code}`,
        totalQuestions: room.quiz?.totalQuestions || 0,
      });
    });

    s.on("room:players-update", (players) => {
      setPlayerCount(players.length);
    });

    s.on("player:joined", () => {
      setPlayerCount((n) => n + 1);
    });

    s.on("player:left", () => {
      setPlayerCount((n) => Math.max(0, n - 1));
    });

    s.on("quiz:question", ({ question, questionIndex, totalQuestions, timeLimit }) => {
      setQuestion({ ...question, questionIndex, totalQuestions, timeLimit });
      setTimeLeft(timeLimit);
      setSelectedAnswer(null);
      setFeedback(null);
      setPhase("question");
      setShowScorePop(false);
      answerTimeRef.current = Date.now();
    });

    s.on("quiz:answer-result", (result) => {
      setFeedback(result);
      setMyScore(result.newScore);
      if (result.isCorrect) {
        setMyStreak((s) => s + 1);
      } else {
        setMyStreak(0);
      }
      setPhase("answer-feedback");
      if (result.pointsEarned > 0) {
        setShowScorePop(true);
        setTimeout(() => setShowScorePop(false), 1000);
      }
    });

    s.on("quiz:question-end", ({ correctIndex, explanation, scores }) => {
      setPhase("question-end");
      setFeedback((f) =>
        f ? { ...f, correctIndex, explanation: explanation || f.explanation } : null
      );
      setScores(scores);
      // Update my rank
      const myEntry = scores.find((e: ScoreEntry & { nickname: string }) => e.nickname === nickname);
      if (myEntry) setMyRank(myEntry.rank);
    });

    s.on("quiz:end", ({ leaderboard }) => {
      setPhase("ended");
      setScores(leaderboard);
      sessionStorage.setItem(`results_${code}`, JSON.stringify(leaderboard));
      setTimeout(() => {
        router.push(`/results/${code}?nickname=${encodeURIComponent(nickname)}`);
      }, 3000);
    });

    s.on("room:error", (msg) => {
      if (msg.toLowerCase().includes("not found") && retries < MAX_RETRIES) {
        retries++;
        setError(`Room not ready yet — retrying (${retries}/${MAX_RETRIES})...`);
        retryTimer = setTimeout(() => {
          if (s.connected) attemptJoin();
        }, 2000);
      } else {
        setError(msg);
        setPhase("joining");
      }
    });

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      s.disconnect();
    };
  }, [code, nickname]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "question" || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null || phase !== "question" || !question || !socket) return;
      setSelectedAnswer(index);
      const timeSpent = Date.now() - answerTimeRef.current;
      socket.emit("quiz:answer", {
        questionId: question.id,
        selectedIndex: index,
        timeSpent,
      });
    },
    [selectedAnswer, phase, question, socket]
  );

  const timerPct = question ? (timeLeft / question.timeLimit) * 100 : 100;
  const timerColor = timerPct > 50 ? "#8B5CF6" : timerPct > 25 ? "#F59E0B" : "#EF4444";
  const circumference = 2 * Math.PI * 38;
  const dash = (timerPct / 100) * circumference;

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col select-none overflow-hidden">
      {/* Top HUD */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-dark-800/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${nickname}&backgroundColor=0f172a`}
            alt={nickname}
            className="w-8 h-8 rounded-full border border-violet-500/40"
          />
          <div>
            <p className="text-sm font-bold text-white leading-none">{nickname}</p>
            {myRank && (
              <p className="text-xs text-slate-500 mt-0.5">
                {getRankIcon(myRank)} Rank {myRank}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {myStreak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">{myStreak}x</span>
            </div>
          )}
          <div className="text-right">
            <div className="relative">
              <p className="text-lg font-black gradient-text">{formatScore(myScore)}</p>
              {showScorePop && feedback && (
                <span className="absolute -top-2 right-0 text-xs font-bold text-emerald-400 score-pop">
                  +{feedback.pointsEarned}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">points</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Error state — only for final, non-retrying errors */}
        {error && !error.includes("retrying") && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-8 text-center max-w-sm border border-red-500/20">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-xl font-bold text-white mb-2">Can&apos;t join room</h2>
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <a href="/play" className="btn-primary py-2 px-6 text-sm">
                Try Again
              </a>
            </div>
          </div>
        )}

        {/* Joining / retrying */}
        {phase === "joining" && !error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-violet-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-slate-400">Connecting to room {code}...</p>
            </div>
          </div>
        )}
        {phase === "joining" && error && error.includes("retrying") && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
              <p className="text-amber-400 text-sm">{error}</p>
              <p className="text-slate-500 text-xs">The host may still be setting up the room</p>
            </div>
          </div>
        )}

        {/* Waiting for host */}
        {phase === "waiting" && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-sm w-full">
              <div className="glass rounded-3xl p-8 border border-violet-500/20">
                <div className="text-5xl mb-4 animate-bounce">🎯</div>
                <h2 className="text-2xl font-black text-white mb-2">You&apos;re in!</h2>
                <p className="text-slate-400 mb-1">
                  Room: <span className="font-mono font-bold text-violet-300">{code}</span>
                </p>
                <p className="text-slate-400 text-sm">
                  Waiting for the host to start...
                </p>
                {roomInfo && (
                  <div className="mt-4 p-3 rounded-xl bg-dark-600/50 border border-slate-700">
                    <p className="text-white font-semibold text-sm">{roomInfo.title}</p>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <div className="status-dot-live" />
                  {playerCount} player{playerCount !== 1 ? "s" : ""} joined
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>⚡ Speed = more points</p>
                <p>🔥 Streaks give +10% bonus</p>
                <p>🏆 Fastest total time breaks ties</p>
              </div>
            </div>
          </div>
        )}

        {/* Active question */}
        {(phase === "question" || phase === "answer-feedback") && question && (
          <div className="flex-1 flex flex-col px-4 py-4 max-w-2xl mx-auto w-full">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                {question.questionIndex + 1} / {question.totalQuestions}
              </span>

              {/* Circular timer */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="5" />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    fill="none"
                    stroke={timerColor}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-2xl font-black"
                  style={{ color: timerColor }}
                >
                  {timeLeft}
                </span>
              </div>

              <span className="text-sm text-slate-400">
                {question.points} pts
              </span>
            </div>

            {/* Question text */}
            <div className="glass rounded-2xl p-5 mb-5 border border-slate-700/50">
              <p className="text-lg sm:text-xl font-bold text-white text-center leading-snug">
                {question.text}
              </p>
            </div>

            {/* Answer options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {question.options.map((opt, i) => {
                const isSelected = selectedAnswer === i;
                const isAnswered = selectedAnswer !== null;
                const fb = feedback;

                let className = `answer-btn border-2 `;

                if (!isAnswered) {
                  className += `border-${["violet", "cyan", "pink", "amber"][i]}-500/40 bg-${["violet", "cyan", "pink", "amber"][i]}-500/10 text-white hover:border-${["violet", "cyan", "pink", "amber"][i]}-400 hover:bg-${["violet", "cyan", "pink", "amber"][i]}-500/20`;
                } else if (fb) {
                  if (i === fb.correctIndex) {
                    className += "border-emerald-400 bg-emerald-500/20 text-emerald-100";
                  } else if (isSelected && !fb.isCorrect) {
                    className += "border-red-400/60 bg-red-500/15 text-red-200";
                  } else {
                    className += "border-slate-700 bg-slate-800/30 text-slate-500";
                  }
                } else {
                  className += isSelected
                    ? "border-violet-400 bg-violet-500/20 text-white"
                    : "border-slate-700 bg-slate-800/30 text-slate-500 opacity-60";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                    className={className}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                        i === 0
                          ? "bg-violet-600"
                          : i === 1
                          ? "bg-cyan-600"
                          : i === 2
                          ? "bg-pink-600"
                          : "bg-amber-600"
                      } ${!isAnswered ? "text-white" : "opacity-70"}`}
                    >
                      {["A", "B", "C", "D"][i]}
                    </span>
                    <span className="font-semibold text-sm sm:text-base leading-snug">
                      {opt}
                    </span>
                    {fb && i === fb.correctIndex && (
                      <span className="ml-auto text-emerald-400 text-lg">✓</span>
                    )}
                    {fb && isSelected && !fb.isCorrect && i === selectedAnswer && (
                      <span className="ml-auto text-red-400 text-lg">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback banner */}
            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl border text-center text-sm font-semibold ${
                  feedback.isCorrect
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/20 text-red-300"
                }`}
              >
                {feedback.isCorrect ? (
                  <span>
                    ✓ Correct! +{feedback.pointsEarned} pts
                    {feedback.streakBonus > 0 && (
                      <span className="text-amber-400 ml-1">
                        (🔥 +{feedback.streakBonus} streak)
                      </span>
                    )}
                  </span>
                ) : (
                  <span>✗ Incorrect — waiting for next question</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Between questions - leaderboard */}
        {phase === "question-end" && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-3">
              <h3 className="text-center font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Live Rankings
              </h3>
              {scores.slice(0, 5).map((entry, i) => (
                <div
                  key={entry.nickname}
                  className={`lb-row ${entry.nickname === nickname ? "current-player" : ""}`}
                >
                  <span className="w-6 text-center font-bold">
                    {i < 3 ? ["🥇", "🥈", "🥉"][i] : `${i + 1}`}
                  </span>
                  <span className="flex-1 text-sm font-medium text-white">
                    {entry.nickname}
                    {entry.nickname === nickname && (
                      <span className="ml-2 text-xs text-violet-400">(you)</span>
                    )}
                  </span>
                  <span className="text-sm font-bold gradient-text">
                    {formatScore(entry.score)}
                  </span>
                </div>
              ))}
              {feedback?.explanation && (
                <div className="mt-3 glass rounded-xl p-3 border border-slate-700/50 text-xs text-slate-400 text-center">
                  💡 {feedback.explanation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ended */}
        {phase === "ended" && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🏆</div>
              <h2 className="text-2xl font-black text-white">Quiz Over!</h2>
              <p className="text-slate-400">
                Final score: <span className="gradient-text font-bold">{formatScore(myScore)}</span>
              </p>
              <p className="text-sm text-slate-500">Loading results...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <PlayPage />
    </Suspense>
  );
}
