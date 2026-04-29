"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Brain,
  PenLine,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Zap,
  ArrowRight,
  Check,
  Loader2,
  Settings,
  DollarSign,
  Users,
  Clock,
  X,
  Calendar,
  Gift,
} from "lucide-react";
import { CATEGORIES, QuizCategory, Difficulty } from "@/types";
import Navbar from "@/components/shared/Navbar";

type Step = "mode" | "category" | "config" | "questions" | "review";
type PrizeType = "NONE" | "CASH" | "CRYPTO" | "BRANDED_GIFT";
type ScheduleType = "INSTANT" | "SCHEDULED";

const CRYPTO_CURRENCIES = ["RBTC", "BTC", "ETH", "RIF", "USDT0", "USDT", "USDC", "SOL", "BNB", "MATIC", "AVAX", "DOT"];

interface ManualQuestion {
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  timeLimit: number;
}

export default function CreatePage() {
  const router = useRouter();
  const { status } = useSession();
  const [step, setStep] = useState<Step>("mode");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin?callbackUrl=/create");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }
  const [mode, setMode] = useState<"AI_GENERATED" | "MANUAL">("AI_GENERATED");
  const [category, setCategory] = useState<QuizCategory>("BLOCKCHAIN");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [questionCount, setQuestionCount] = useState<10 | 20 | 50>(10);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [maxPlayers, setMaxPlayers] = useState(100);
  const [entryFee, setEntryFee] = useState("");
  const [prizePool, setPrizePool] = useState("");

  // Prize settings
  const [prizeType, setPrizeType] = useState<PrizeType>("NONE");
  const [prizeCurrency, setPrizeCurrency] = useState("RBTC");
  const [prizeDescription, setPrizeDescription] = useState("");

  // Scheduling
  const [scheduleType, setScheduleType] = useState<ScheduleType>("INSTANT");
  const [scheduledAt, setScheduledAt] = useState("");

  const [manualQuestions, setManualQuestions] = useState<ManualQuestion[]>([
    { text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", timeLimit: 30 },
  ]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const STEPS: Step[] = ["mode", "category", "config", "questions", "review"];
  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };
  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const addQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      { text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", timeLimit: 30 },
    ]);
  };

  const updateQuestion = (i: number, updates: Partial<ManualQuestion>) => {
    setManualQuestions((qs: ManualQuestion[]) =>
      qs.map((q: ManualQuestion, idx: number) => (idx === i ? { ...q, ...updates } : q))
    );
  };

  const removeQuestion = (i: number) => {
    if (manualQuestions.length <= 1) return;
    setManualQuestions((qs: ManualQuestion[]) => qs.filter((_q: ManualQuestion, idx: number) => idx !== i));
  };

  const handleCreate = async () => {
    setGenerating(true);
    setError("");
    try {
      const payload = {
        mode,
        category,
        customTopic: category === "CUSTOM" ? customTopic : undefined,
        difficulty,
        questionCount,
        title: title || `${category} Quiz — ${difficulty}`,
        description,
        timeLimit,
        maxPlayers,
        entryFee: entryFee ? parseFloat(entryFee) : undefined,
        prizePool: prizePool ? parseFloat(prizePool) : undefined,
        prizeType,
        prizeCurrency: prizeType === "CRYPTO" ? prizeCurrency : undefined,
        prizeDescription: prizeType === "BRANDED_GIFT" ? prizeDescription : undefined,
        scheduledAt: scheduleType === "SCHEDULED" && scheduledAt ? scheduledAt : undefined,
        questions: mode === "MANUAL" ? manualQuestions : undefined,
      };

      const res = await fetch("/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create quiz");

      sessionStorage.setItem(`quiz_${data.roomCode}`, JSON.stringify(data.quiz));
      router.push(`/room/${data.roomCode}?host=true`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Create Your <span className="gradient-text">Quiz</span>
          </h1>
          <p className="text-slate-400">AI-powered or fully custom. Takes less than 2 minutes.</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`capitalize ${i <= stepIndex ? "text-violet-400 font-semibold" : ""}`}
              >
                {s}
              </span>
            ))}
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-700/50 min-h-[400px] flex flex-col">
          {step === "mode" && (
            <ModeStep mode={mode} setMode={setMode} />
          )}
          {step === "category" && (
            <CategoryStep
              mode={mode}
              category={category}
              setCategory={setCategory}
              customTopic={customTopic}
              setCustomTopic={setCustomTopic}
            />
          )}
          {step === "config" && (
            <ConfigStep
              mode={mode}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
              title={title}
              setTitle={setTitle}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              maxPlayers={maxPlayers}
              setMaxPlayers={setMaxPlayers}
              prizeType={prizeType}
              setPrizeType={setPrizeType}
              prizeCurrency={prizeCurrency}
              setPrizeCurrency={setPrizeCurrency}
              prizePool={prizePool}
              setPrizePool={setPrizePool}
              prizeDescription={prizeDescription}
              setPrizeDescription={setPrizeDescription}
              scheduleType={scheduleType}
              setScheduleType={setScheduleType}
              scheduledAt={scheduledAt}
              setScheduledAt={setScheduledAt}
            />
          )}
          {step === "questions" && mode === "MANUAL" && (
            <ManualQuestionsStep
              questions={manualQuestions}
              onAdd={addQuestion}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
            />
          )}
          {step === "questions" && mode === "AI_GENERATED" && (
            <AIPreviewStep
              category={category}
              difficulty={difficulty}
              questionCount={questionCount}
              timeLimit={timeLimit}
              entryFee={entryFee}
              setEntryFee={setEntryFee}
            />
          )}
          {step === "review" && (
            <ReviewStep
              mode={mode}
              category={category}
              difficulty={difficulty}
              questionCount={mode === "MANUAL" ? manualQuestions.length : questionCount}
              title={title}
              timeLimit={timeLimit}
              maxPlayers={maxPlayers}
              entryFee={entryFee}
              prizePool={prizePool}
              prizeType={prizeType}
              prizeCurrency={prizeCurrency}
              prizeDescription={prizeDescription}
              scheduleType={scheduleType}
              scheduledAt={scheduledAt}
            />
          )}

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <X className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-auto pt-6 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={stepIndex === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step === "review" ? (
              <button
                onClick={handleCreate}
                disabled={generating}
                className="btn-primary py-3 px-8 text-sm gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === "AI_GENERATED" ? "Generating Questions..." : "Creating Room..."}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Create & Get Room Code
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (step === "config") {
                    setStep("questions");
                  } else {
                    goNext();
                  }
                }}
                className="btn-primary py-2.5 px-6 text-sm gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP COMPONENTS ──────────────────────────────────────────────────────────

function ModeStep({
  mode,
  setMode,
}: {
  mode: string;
  setMode: (m: "AI_GENERATED" | "MANUAL") => void;
}) {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-bold text-white mb-1">Choose quiz mode</h2>
      <p className="text-slate-400 text-sm mb-6">
        AI generates professional questions instantly, or build your own.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <ModeCard
          icon={<Brain className="w-8 h-8" />}
          title="AI Generated"
          desc="Pick a category and AI instantly creates 10–50 professionally crafted questions with correct answers and explanations."
          badge="Recommended"
          badgeColor="bg-violet-500/20 text-violet-300 border-violet-500/30"
          selected={mode === "AI_GENERATED"}
          onClick={() => setMode("AI_GENERATED")}
          gradient="from-violet-500 to-cyan-500"
        />
        <ModeCard
          icon={<PenLine className="w-8 h-8" />}
          title="Manual"
          desc="Write your own questions and answers. Perfect for custom AMAs, product quizzes, and highly specific topics."
          selected={mode === "MANUAL"}
          onClick={() => setMode("MANUAL")}
          gradient="from-pink-500 to-rose-500"
        />
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  desc,
  badge,
  badgeColor,
  selected,
  onClick,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  selected: boolean;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
        selected
          ? "border-violet-500 bg-violet-500/10 shadow-glow-purple"
          : "border-slate-700 hover:border-slate-600 bg-dark-700/50"
      }`}
    >
      {badge && (
        <span
          className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full border font-semibold ${badgeColor}`}
        >
          {badge}
        </span>
      )}
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      {selected && (
        <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

function CategoryStep({
  mode,
  category,
  setCategory,
  customTopic,
  setCustomTopic,
}: {
  mode: string;
  category: QuizCategory;
  setCategory: (c: QuizCategory) => void;
  customTopic: string;
  setCustomTopic: (t: string) => void;
}) {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-bold text-white mb-1">Select category</h2>
      <p className="text-slate-400 text-sm mb-6">
        {mode === "AI_GENERATED"
          ? "AI will generate questions tailored to this topic."
          : "Choose the subject of your quiz."}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`category-card text-center p-3 ${category === cat.id ? "selected" : ""}`}
          >
            <div className="text-2xl mb-1">{cat.emoji}</div>
            <div className="text-xs font-semibold text-white leading-tight">{cat.label}</div>
          </button>
        ))}
      </div>
      {category === "CUSTOM" && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Custom Topic
          </label>
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="e.g. Ethereum DeFi protocols, African History, React.js..."
            className="input-field"
          />
        </div>
      )}
    </div>
  );
}

function ConfigStep({
  mode,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  title,
  setTitle,
  timeLimit,
  setTimeLimit,
  maxPlayers,
  setMaxPlayers,
  prizeType,
  setPrizeType,
  prizeCurrency,
  setPrizeCurrency,
  prizePool,
  setPrizePool,
  prizeDescription,
  setPrizeDescription,
  scheduleType,
  setScheduleType,
  scheduledAt,
  setScheduledAt,
}: {
  mode: string;
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  questionCount: 10 | 20 | 50;
  setQuestionCount: (n: 10 | 20 | 50) => void;
  title: string;
  setTitle: (t: string) => void;
  timeLimit: number;
  setTimeLimit: (t: number) => void;
  maxPlayers: number;
  setMaxPlayers: (n: number) => void;
  prizeType: PrizeType;
  setPrizeType: (p: PrizeType) => void;
  prizeCurrency: string;
  setPrizeCurrency: (c: string) => void;
  prizePool: string;
  setPrizePool: (v: string) => void;
  prizeDescription: string;
  setPrizeDescription: (d: string) => void;
  scheduleType: ScheduleType;
  setScheduleType: (s: ScheduleType) => void;
  scheduledAt: string;
  setScheduledAt: (d: string) => void;
}) {
  const minDateTime = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="flex-1 space-y-6 overflow-y-auto pr-1">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Configure settings</h2>
        <p className="text-slate-400 text-sm">Fine-tune your quiz experience.</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Bitcoin Basics Challenge"
          className="input-field"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
        <div className="grid grid-cols-3 gap-3">
          {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                difficulty === d
                  ? d === "EASY"
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                    : d === "MEDIUM"
                    ? "border-amber-400 bg-amber-500/10 text-amber-300"
                    : "border-red-400 bg-red-500/10 text-red-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              {d === "EASY" ? "😊 Easy" : d === "MEDIUM" ? "🔥 Medium" : "💀 Hard"}
            </button>
          ))}
        </div>
      </div>

      {/* Question count (AI only) */}
      {mode === "AI_GENERATED" && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Questions
          </label>
          <div className="flex gap-3">
            {([10, 20, 50] as const).map((n) => (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                  questionCount === n
                    ? "border-violet-400 bg-violet-500/10 text-violet-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time limit & max players */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Time per Q (sec)
          </label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="input-field"
          >
            {[10, 15, 20, 25, 30, 45, 60].map((t) => (
              <option key={t} value={t}>
                {t}s
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Max Players
          </label>
          <input
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Math.max(2, parseInt(e.target.value) || 2))}
            min={2}
            max={1000}
            className="input-field"
          />
        </div>
      </div>

      {/* Scheduling */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Quiz Schedule
        </label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => setScheduleType("INSTANT")}
            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              scheduleType === "INSTANT"
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            <Zap className="w-4 h-4" /> Instant
          </button>
          <button
            onClick={() => setScheduleType("SCHEDULED")}
            className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              scheduleType === "SCHEDULED"
                ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            <Calendar className="w-4 h-4" /> Tournament
          </button>
        </div>
        {scheduleType === "SCHEDULED" && (
          <input
            type="datetime-local"
            value={scheduledAt}
            min={minDateTime}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="input-field"
          />
        )}
      </div>

      {/* Prize Type */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-amber-400" /> Prize Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {([
            { type: "NONE", label: "No Prize", icon: "🚫" },
            { type: "CASH", label: "Cash (USD)", icon: "💵" },
            { type: "CRYPTO", label: "Crypto", icon: "🪙" },
            { type: "BRANDED_GIFT", label: "Branded Gift", icon: "🎁" },
          ] as { type: PrizeType; label: string; icon: string }[]).map((p) => (
            <button
              key={p.type}
              onClick={() => setPrizeType(p.type)}
              className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                prizeType === p.type
                  ? "border-amber-400 bg-amber-500/10 text-amber-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="text-xl">{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {prizeType === "CASH" && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <input
              type="number"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              placeholder="Prize amount in USD"
              min="0"
              step="1"
              className="input-field flex-1"
            />
          </div>
        )}

        {prizeType === "CRYPTO" && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={prizeCurrency}
                onChange={(e) => setPrizeCurrency(e.target.value)}
                className="input-field"
              >
                {CRYPTO_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                value={prizePool}
                onChange={(e) => setPrizePool(e.target.value)}
                placeholder="Amount"
                min="0"
                step="0.001"
                className="input-field"
              />
            </div>
            <p className="text-xs text-slate-500">Prize amount in {prizeCurrency}. Wallet connection required for distribution.</p>
          </div>
        )}

        {prizeType === "BRANDED_GIFT" && (
          <textarea
            value={prizeDescription}
            onChange={(e) => setPrizeDescription(e.target.value)}
            placeholder="Describe the prize (e.g. 'Winner gets a QuizChain hoodie and exclusive NFT badge')"
            rows={2}
            className="input-field resize-none"
          />
        )}
      </div>
    </div>
  );
}

function AIPreviewStep({
  category,
  difficulty,
  questionCount,
  timeLimit,
  entryFee,
  setEntryFee,
}: {
  category: QuizCategory;
  difficulty: Difficulty;
  questionCount: number;
  timeLimit: number;
  entryFee: string;
  setEntryFee: (v: string) => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === category);
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Web3 Settings</h2>
        <p className="text-slate-400 text-sm">Optional — add on-chain entry fees.</p>
      </div>

      {/* AI summary */}
      <div className="glass rounded-2xl p-4 border border-violet-500/20">
        <h3 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI will generate for you:
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Category</span>
            <span className="text-white font-medium">{cat?.emoji} {cat?.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Difficulty</span>
            <span className="text-white font-medium">{difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Questions</span>
            <span className="text-white font-medium">{questionCount} questions</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Time per Q</span>
            <span className="text-white font-medium">{timeLimit}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Includes</span>
            <span className="text-emerald-400 font-medium">✓ Explanations</span>
          </div>
        </div>
      </div>

      {/* Entry fee */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          Entry Fee (RBTC) — optional
        </label>
        <input
          type="number"
          value={entryFee}
          onChange={(e) => setEntryFee(e.target.value)}
          placeholder="0.001"
          min="0"
          step="0.001"
          className="input-field"
        />
        <p className="text-xs text-slate-500 mt-1">
          Requires wallet connection. 90% goes to prize pool, 10% platform fee.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-violet-400" />
          Description — optional
        </label>
        <input
          type="text"
          placeholder="Brief description of your quiz..."
          className="input-field"
        />
      </div>
    </div>
  );
}

function ManualQuestionsStep({
  questions,
  onAdd,
  onUpdate,
  onRemove,
}: {
  questions: ManualQuestion[];
  onAdd: () => void;
  onUpdate: (i: number, updates: Partial<ManualQuestion>) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Your Questions</h2>
          <p className="text-slate-400 text-sm">{questions.length} question(s) added</p>
        </div>
        <button onClick={onAdd} className="btn-primary py-2 px-4 text-xs gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add Question
        </button>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {questions.map((q, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-400">Q{i + 1}</span>
              <button
                onClick={() => onRemove(i)}
                className="p-1 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={q.text}
              onChange={(e) => onUpdate(i, { text: e.target.value })}
              placeholder="Question text..."
              className="input-field text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, j) => (
                <div key={j} className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdate(i, { correctIndex: j })}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                      q.correctIndex === j
                        ? "border-emerald-400 bg-emerald-500"
                        : "border-slate-600"
                    }`}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...q.options] as [string, string, string, string];
                      newOptions[j] = e.target.value;
                      onUpdate(i, { options: newOptions });
                    }}
                    placeholder={`Option ${["A", "B", "C", "D"][j]}`}
                    className="input-field text-xs py-1.5 flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({
  mode,
  category,
  difficulty,
  questionCount,
  title,
  timeLimit,
  maxPlayers,
  entryFee,
  prizePool,
  prizeType,
  prizeCurrency,
  prizeDescription,
  scheduleType,
  scheduledAt,
}: {
  mode: string;
  category: QuizCategory;
  difficulty: Difficulty;
  questionCount: number;
  title: string;
  timeLimit: number;
  maxPlayers: number;
  entryFee: string;
  prizePool: string;
  prizeType: PrizeType;
  prizeCurrency: string;
  prizeDescription: string;
  scheduleType: ScheduleType;
  scheduledAt: string;
}) {
  const cat = CATEGORIES.find((c) => c.id === category);

  const prizeLabel = () => {
    if (prizeType === "NONE") return "None";
    if (prizeType === "CASH") return prizePool ? `$${prizePool} USD` : "Cash (amount TBD)";
    if (prizeType === "CRYPTO") return prizePool ? `${prizePool} ${prizeCurrency}` : `Crypto (${prizeCurrency})`;
    if (prizeType === "BRANDED_GIFT") return prizeDescription || "Branded Gift";
    return "None";
  };

  const scheduleLabel = () => {
    if (scheduleType === "INSTANT") return "⚡ Start immediately";
    if (scheduledAt) return `📅 ${new Date(scheduledAt).toLocaleString()}`;
    return "📅 Scheduled (date not set)";
  };

  return (
    <div className="flex-1 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Review & Launch</h2>
        <p className="text-slate-400 text-sm">Everything looks good? Hit create to get your room code.</p>
      </div>

      <div className="glass rounded-2xl p-5 border border-violet-500/20 space-y-3">
        <ReviewRow label="Title" value={title || `${cat?.label} Quiz — ${difficulty}`} />
        <ReviewRow label="Mode" value={mode === "AI_GENERATED" ? "🤖 AI Generated" : "✏️ Manual"} />
        <ReviewRow label="Category" value={`${cat?.emoji} ${cat?.label}`} />
        <ReviewRow
          label="Difficulty"
          value={difficulty === "EASY" ? "😊 Easy" : difficulty === "MEDIUM" ? "🔥 Medium" : "💀 Hard"}
        />
        <ReviewRow label="Questions" value={`${questionCount} questions`} />
        <ReviewRow label="Time per Q" value={`${timeLimit}s`} />
        <ReviewRow label="Max Players" value={maxPlayers.toString()} />
        <ReviewRow label="Schedule" value={scheduleLabel()} />
        <ReviewRow label="Prize" value={prizeLabel()} />
        {entryFee && <ReviewRow label="Entry Fee" value={`${entryFee} RBTC`} />}
      </div>

      <div className="glass rounded-2xl p-4 border border-emerald-500/20 text-sm text-emerald-300 flex items-start gap-3">
        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold mb-1">What happens next</div>
          <div className="text-emerald-400/70 space-y-0.5">
            {mode === "AI_GENERATED" && <p>• AI generates your questions (~10–20 seconds)</p>}
            <p>• You get a 6-character room code</p>
            <p>• Share it with players to join</p>
            <p>• Start the quiz when ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
