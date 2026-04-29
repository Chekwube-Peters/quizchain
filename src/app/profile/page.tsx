"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Trophy,
  Zap,
  Copy,
  Check,
  ExternalLink,
  Medal,
  Flame,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import { formatScore, truncateAddress } from "@/lib/utils";

const MOCK_ACHIEVEMENTS = [
  { id: 1, title: "First Quiz", icon: "🎯", desc: "Completed your first quiz", earned: true, rarity: "Common" },
  { id: 2, title: "Speed Demon", icon: "⚡", desc: "Answer in under 2 seconds", earned: true, rarity: "Rare" },
  { id: 3, title: "On Fire", icon: "🔥", desc: "Get a 5x streak", earned: true, rarity: "Rare" },
  { id: 4, title: "Podium Finish", icon: "🥇", desc: "Finish top 3 in a quiz", earned: false, rarity: "Epic" },
  { id: 5, title: "Perfect Score", icon: "💯", desc: "Answer all questions correctly", earned: false, rarity: "Epic" },
  { id: 6, title: "Web3 Native", icon: "🔗", desc: "Connect your wallet", earned: false, rarity: "Legendary" },
  { id: 7, title: "Tournament King", icon: "👑", desc: "Win a tournament", earned: false, rarity: "Legendary" },
  { id: 8, title: "Quiz Creator", icon: "🧠", desc: "Create 10 quizzes", earned: false, rarity: "Common" },
];

const MOCK_HISTORY = [
  { id: 1, title: "Bitcoin Fundamentals", category: "Bitcoin", rank: 2, score: 8450, players: 24, date: "2025-04-24" },
  { id: 2, title: "Rootstock Deep Dive", category: "Rootstock", rank: 1, score: 9200, players: 18, date: "2025-04-22" },
  { id: 3, title: "Blockchain Basics", category: "Blockchain", rank: 5, score: 6100, players: 31, date: "2025-04-20" },
  { id: 4, title: "Crypto History", category: "Blockchain", rank: 3, score: 7300, players: 15, date: "2025-04-18" },
];

const RARITY_COLORS: Record<string, string> = {
  Common: "text-slate-400 border-slate-600",
  Rare: "text-blue-400 border-blue-600",
  Epic: "text-violet-400 border-violet-600",
  Legendary: "text-amber-400 border-amber-600",
};

export default function ProfilePage() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b8D4C9F4b27a3F1234");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"achievements" | "history" | "nfts">("achievements");

  const earnedCount = MOCK_ACHIEVEMENTS.filter((a) => a.earned).length;
  const totalScore = MOCK_HISTORY.reduce((s, h) => s + h.score, 0);
  const wins = MOCK_HISTORY.filter((h) => h.rank === 1).length;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="glass rounded-3xl p-6 sm:p-8 border border-violet-500/20 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=QuizMaster&backgroundColor=0f172a"
                alt="Profile"
                className="w-20 h-20 rounded-2xl border-2 border-violet-500/40"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-dark-900" />
            </div>

            {/* Name + stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-white">QuizMaster</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  PRO
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Joined April 2025 · {MOCK_HISTORY.length} quizzes played</p>
              <div className="flex flex-wrap gap-4">
                <MiniStat icon={<Trophy className="w-3.5 h-3.5 text-yellow-400" />} value={wins} label="Wins" />
                <MiniStat icon={<Zap className="w-3.5 h-3.5 text-violet-400" />} value={formatScore(totalScore)} label="Total Score" />
                <MiniStat icon={<Medal className="w-3.5 h-3.5 text-cyan-400" />} value={`${earnedCount}/${MOCK_ACHIEVEMENTS.length}`} label="Badges" />
                <MiniStat icon={<Flame className="w-3.5 h-3.5 text-orange-400" />} value="5x" label="Best Streak" />
              </div>
            </div>

            {/* Wallet block */}
            <div className="w-full sm:w-auto">
              {walletConnected ? (
                <div className="glass rounded-2xl p-4 border border-emerald-500/20 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Wallet Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-slate-300">
                      {truncateAddress(walletAddress)}
                    </span>
                    <button onClick={copyAddress} className="text-slate-500 hover:text-white transition-colors">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={`https://explorer.rootstock.io/address/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-violet-400 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">RBTC Balance</span>
                      <span className="text-white font-bold">0.042 RBTC</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setWalletConnected(true)}
                  className="btn-primary py-3 px-6 gap-2 text-sm"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-dark-800 p-1 rounded-2xl border border-slate-800 w-fit">
          {(["achievements", "history", "nfts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-glow-purple"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "nfts" ? "NFT Badges" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Achievements */}
        {activeTab === "achievements" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                <span className="text-white font-bold">{earnedCount}</span> of{" "}
                {MOCK_ACHIEVEMENTS.length} earned
              </p>
              <div className="h-2 w-40 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full progress-bar"
                  style={{ width: `${(earnedCount / MOCK_ACHIEVEMENTS.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_ACHIEVEMENTS.map((a) => (
                <div
                  key={a.id}
                  className={`glass rounded-2xl p-4 border transition-all ${
                    a.earned
                      ? "border-violet-500/30 hover:-translate-y-1 hover:shadow-glow-purple"
                      : "border-slate-800 opacity-50 grayscale"
                  }`}
                >
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <div className={`text-xs font-bold mb-1 ${RARITY_COLORS[a.rarity]?.split(" ")[0]}`}>
                    {a.rarity}
                  </div>
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

        {/* History */}
        {activeTab === "history" && (
          <div className="glass rounded-3xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-bold text-white">Quiz History</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {MOCK_HISTORY.map((h) => (
                <div key={h.id} className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="w-8 h-8 flex items-center justify-center rounded-xl text-lg bg-dark-700">
                    {h.rank === 1 ? "🥇" : h.rank === 2 ? "🥈" : h.rank === 3 ? "🥉" : `#${h.rank}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{h.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{h.category}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {h.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold gradient-text">{formatScore(h.score)}</div>
                    <div className="text-xs text-slate-500">{h.players} players</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFT Badges */}
        {activeTab === "nfts" && (
          <div>
            {walletConnected ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {MOCK_ACHIEVEMENTS.filter((a) => a.earned).map((a) => (
                  <div
                    key={a.id}
                    className="glass rounded-2xl border border-violet-500/20 overflow-hidden hover:-translate-y-1 transition-all hover:shadow-glow-purple"
                  >
                    <div className="h-32 bg-gradient-to-br from-violet-900/50 to-dark-800 flex items-center justify-center text-6xl">
                      {a.icon}
                    </div>
                    <div className="p-4">
                      <div className={`text-xs font-bold mb-1 ${RARITY_COLORS[a.rarity]?.split(" ")[0]}`}>
                        {a.rarity} · QuizChain NFT
                      </div>
                      <h4 className="font-bold text-white mb-1">{a.title}</h4>
                      <p className="text-xs text-slate-500">{a.desc}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-600 font-mono">
                          #000{a.id}
                        </span>
                        <a
                          href="#"
                          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                        >
                          View on chain
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                  Link your Rootstock wallet to view your NFT badges and claim rewards on-chain.
                </p>
                <button
                  onClick={() => setWalletConnected(true)}
                  className="btn-primary py-3 px-8 gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}

        {/* CTA if no wallet */}
        {!walletConnected && activeTab === "achievements" && (
          <div className="mt-6 glass rounded-2xl p-5 border border-amber-500/20 flex items-start gap-4">
            <Wallet className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-semibold text-sm mb-1">Unlock Web3 Achievements</p>
              <p className="text-slate-400 text-xs">
                Connect your wallet to mint NFT badges, receive RBTC prizes, and build your on-chain quiz reputation.
              </p>
            </div>
            <button
              onClick={() => setWalletConnected(true)}
              className="ml-auto btn-primary py-2 px-4 text-xs gap-1.5 flex-shrink-0"
            >
              <Wallet className="w-3.5 h-3.5" />
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-white font-bold text-sm">{value}</span>
      <span className="text-slate-500 text-xs">{label}</span>
    </div>
  );
}
