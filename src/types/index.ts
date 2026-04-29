export type QuizCategory =
  | "BLOCKCHAIN"
  | "ROOTSTOCK"
  | "BITCOIN"
  | "BIOLOGY"
  | "SPORTS"
  | "HISTORY"
  | "MOVIES"
  | "RELIGION"
  | "CUSTOM";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuizMode = "AI_GENERATED" | "MANUAL";
export type RoomStatus = "WAITING" | "ACTIVE" | "PAUSED" | "ENDED";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  points: number;
  timeLimit: number;
  order: number;
}

export interface QuestionForPlayer extends Omit<Question, "correctIndex" | "explanation"> {}

export interface Player {
  id: string;
  nickname: string;
  avatar?: string;
  score: number;
  totalTime: number;
  streakCount: number;
  rank?: number;
  isConnected: boolean;
  walletAddress?: string;
}

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  currentQuestion: number;
  maxPlayers: number;
  isPublic: boolean;
  quiz: {
    id: string;
    title: string;
    category: QuizCategory;
    difficulty: Difficulty;
    questions: Question[];
  };
  participants: Player[];
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface AnswerResult {
  participantId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  correctIndex: number;
  pointsEarned: number;
  streakBonus: number;
  newScore: number;
  timeSpent: number;
  explanation?: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  nickname: string;
  avatar?: string;
  score: number;
  totalTime: number;
  streakCount: number;
  correctAnswers: number;
  walletAddress?: string;
}

export interface QuizConfig {
  title: string;
  category: QuizCategory;
  difficulty: Difficulty;
  mode: QuizMode;
  questionCount: 10 | 20 | 50;
  customTopic?: string;
  timeLimit: number;
  entryFee?: number;
  prizePool?: number;
  maxPlayers?: number;
}

export interface GameState {
  roomCode: string;
  status: RoomStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion?: QuestionForPlayer;
  timeLeft: number;
  players: Player[];
  hostId: string;
}

// Socket event types
export interface ServerToClientEvents {
  "room:players-update": (players: Player[]) => void;
  "room:status": (status: RoomStatus) => void;
  "quiz:question": (data: {
    question: QuestionForPlayer;
    questionIndex: number;
    totalQuestions: number;
    timeLimit: number;
  }) => void;
  "quiz:timer": (timeLeft: number) => void;
  "quiz:answer-result": (result: AnswerResult) => void;
  "quiz:scores": (players: Player[]) => void;
  "quiz:question-end": (data: {
    correctIndex: number;
    explanation?: string;
    scores: Player[];
  }) => void;
  "quiz:end": (data: { leaderboard: LeaderboardEntry[]; roomCode: string }) => void;
  "room:error": (message: string) => void;
  "room:joined": (data: { participantId: string; player: Player; room: Partial<Room> }) => void;
  "room:host-joined": (data: { room: Room }) => void;
  "player:joined": (player: Player) => void;
  "player:left": (playerId: string) => void;
}

export interface ClientToServerEvents {
  "room:join": (data: { code: string; nickname: string; walletAddress?: string }) => void;
  "room:host": (data: { code: string; hostToken: string }) => void;
  "room:leave": () => void;
  "quiz:answer": (data: {
    questionId: string;
    selectedIndex: number;
    timeSpent: number;
  }) => void;
  "host:start": (data: { roomCode: string }) => void;
  "host:next": (data: { roomCode: string }) => void;
  "host:pause": (data: { roomCode: string }) => void;
  "host:resume": (data: { roomCode: string }) => void;
  "host:end": (data: { roomCode: string }) => void;
}

export interface CategoryInfo {
  id: QuizCategory;
  label: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "BLOCKCHAIN",
    label: "Blockchain",
    emoji: "⛓️",
    description: "DeFi, consensus, protocols",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "ROOTSTOCK",
    label: "Rootstock",
    emoji: "🔗",
    description: "RSK, RBTC, smart contracts",
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "BITCOIN",
    label: "Bitcoin",
    emoji: "₿",
    description: "BTC, Lightning, mining",
    color: "#F97316",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "BIOLOGY",
    label: "Biology",
    emoji: "🧬",
    description: "Cells, genetics, evolution",
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "SPORTS",
    label: "Sports",
    emoji: "⚽",
    description: "Football, basketball, more",
    color: "#3B82F6",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "HISTORY",
    label: "History",
    emoji: "📜",
    description: "World events & civilizations",
    color: "#B45309",
    gradient: "from-yellow-600 to-amber-700",
  },
  {
    id: "MOVIES",
    label: "Movies",
    emoji: "🎬",
    description: "Cinema, directors, characters",
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "RELIGION",
    label: "Religion",
    emoji: "✨",
    description: "Faith, philosophy, culture",
    color: "#8B5CF6",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: "CUSTOM",
    label: "Custom",
    emoji: "🎯",
    description: "Your own topic",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-600",
  },
];
