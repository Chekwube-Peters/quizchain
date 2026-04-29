"use client";

import { Settings, Users, Trophy, ChevronRight } from "lucide-react";

const HOST_STEPS = [
  {
    step: "01",
    icon: Settings,
    title: "Configure Your Quiz",
    desc: "Pick AI generation or manual. Select category, difficulty (Easy/Medium/Hard), and question count (10/20/50). Add optional entry fee and prize pool.",
    color: "text-violet-400",
    border: "border-violet-500/30",
    bg: "bg-violet-500/10",
  },
  {
    step: "02",
    icon: Users,
    title: "Share & Fill the Room",
    desc: "Get a unique 6-character room code and shareable link. Share on Discord, Twitter, Telegram. Watch players flood in on your live dashboard.",
    color: "text-cyan-400",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Run & Reward",
    desc: "Launch the quiz, control pacing, view live stats. Auto-distribute RBTC rewards, mint NFT badges to winners, hash results on-chain.",
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
  },
];

const PLAYER_STEPS = [
  {
    icon: "🔗",
    title: "Enter Room Code",
    desc: "Type the 6-character code or click the link from Discord/Twitter. Pick your nickname.",
  },
  {
    icon: "⚡",
    title: "Answer Fast",
    desc: "Each question has a countdown. Correct + fast = max points. Streak of 3+ gives a 10% bonus.",
  },
  {
    icon: "🏆",
    title: "Claim Prizes",
    desc: "Top the leaderboard and earn RBTC, NFT badges, or POAPs directly to your connected wallet.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-dark-900 py-24 overflow-hidden">
      <div
        className="glow-orb w-[500px] h-[500px] bg-cyan-500/10"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            ✨ Simple process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            How it <span className="gradient-text">works</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* For Hosts */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                H
              </div>
              <h3 className="text-2xl font-bold text-white">For Hosts</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Communities & DAOs
              </span>
            </div>
            <div className="space-y-4">
              {HOST_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className={`glass rounded-2xl p-5 border ${s.border} hover:border-opacity-60 transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}
                        >
                          <Icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-600">
                            STEP {s.step}
                          </span>
                          <h4 className={`font-bold text-white`}>{s.title}</h4>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                    {i < HOST_STEPS.length - 1 && (
                      <div className="flex justify-center mt-4">
                        <ChevronRight className="w-4 h-4 text-slate-700 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Players */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                P
              </div>
              <h3 className="text-2xl font-bold text-white">For Players</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Community Members
              </span>
            </div>
            <div className="space-y-4">
              {PLAYER_STEPS.map((s, i) => (
                <div key={i} className="glass rounded-2xl p-5 hover:border-violet-500/20 border border-transparent transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-2xl">
                      {s.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">
                        <span className="text-slate-600 mr-2">0{i + 1}.</span>
                        {s.title}
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scoring system */}
            <div className="mt-6 glass rounded-2xl p-5 border border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 mb-3">
                ⚡ Speed Scoring System
              </h4>
              <div className="space-y-2 text-sm">
                <ScoreRow label="Max points (fastest)" value="1,000 pts" color="text-emerald-400" />
                <ScoreRow label="Correct answer" value="500+ pts" color="text-blue-400" />
                <ScoreRow label="Streak bonus (3+)" value="+10%" color="text-violet-400" />
                <ScoreRow label="Tiebreaker" value="Fastest total time" color="text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
