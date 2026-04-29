import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function calculatePoints(
  timeSpent: number,
  timeLimit: number,
  basePoints = 1000
): number {
  const timeRatio = Math.max(0, 1 - timeSpent / (timeLimit * 1000));
  const speedBonus = Math.round(basePoints * 0.5 * timeRatio);
  return Math.round(basePoints * 0.5 + speedBonus);
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  return `${remainingSeconds}s`;
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}

export function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getRankColor(rank: number): string {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-slate-300";
  if (rank === 3) return "text-amber-600";
  return "text-slate-400";
}

export function getRankIcon(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function generateAvatar(seed: string): string {
  return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f172a`;
}

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const ANSWER_COLORS = [
  {
    bg: "bg-violet-600 hover:bg-violet-500",
    border: "border-violet-400",
    glow: "shadow-glow-purple",
    correct: "bg-emerald-600 border-emerald-400",
    wrong: "bg-red-600/50 border-red-400/50",
    label: "A",
    labelBg: "bg-violet-700",
  },
  {
    bg: "bg-cyan-600 hover:bg-cyan-500",
    border: "border-cyan-400",
    glow: "shadow-glow-cyan",
    correct: "bg-emerald-600 border-emerald-400",
    wrong: "bg-red-600/50 border-red-400/50",
    label: "B",
    labelBg: "bg-cyan-700",
  },
  {
    bg: "bg-pink-600 hover:bg-pink-500",
    border: "border-pink-400",
    glow: "shadow-glow-pink",
    correct: "bg-emerald-600 border-emerald-400",
    wrong: "bg-red-600/50 border-red-400/50",
    label: "C",
    labelBg: "bg-pink-700",
  },
  {
    bg: "bg-amber-600 hover:bg-amber-500",
    border: "border-amber-400",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.4)]",
    correct: "bg-emerald-600 border-emerald-400",
    wrong: "bg-red-600/50 border-red-400/50",
    label: "D",
    labelBg: "bg-amber-700",
  },
];
