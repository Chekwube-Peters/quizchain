"use client";

import { Brain, Zap, Trophy, Shield, Globe, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Quiz Generation",
    desc: "Powered by Claude & GPT-4. Pick a category, set difficulty, and get 10–50 professionally crafted questions in seconds.",
    gradient: "from-violet-500 to-purple-600",
    glow: "group-hover:shadow-glow-purple",
    badge: "Instant",
  },
  {
    icon: Zap,
    title: "Live Multiplayer",
    desc: "Real-time gameplay via WebSockets. Speed matters — fastest correct answers score more. Tie broken by total response time.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-glow-cyan",
    badge: "Real-Time",
  },
  {
    icon: Trophy,
    title: "On-Chain Rewards",
    desc: "Prize pools in RBTC, NFT achievement badges, POAP certificates, and tournament results hashed on Rootstock — zero cheating claims.",
    gradient: "from-amber-500 to-orange-600",
    glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
    badge: "Web3",
  },
  {
    icon: Shield,
    title: "DAO-Ready Tools",
    desc: "Governance learning quizzes, community trust scores, soulbound achievements, and wallet-connected rep that follows players everywhere.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-glow-green",
    badge: "Governance",
  },
  {
    icon: Globe,
    title: "Every Community",
    desc: "Discord/Telegram embedded links, custom branding, sponsor integrations, and public join codes. Built for viral campaigns.",
    gradient: "from-pink-500 to-rose-600",
    glow: "group-hover:shadow-glow-pink",
    badge: "Viral",
  },
  {
    icon: Users,
    title: "Custom Categories",
    desc: "Beyond crypto: Sports, History, Movies, Biology, and fully custom topics. Your community, your questions, your brand.",
    gradient: "from-indigo-500 to-violet-600",
    glow: "group-hover:shadow-glow-purple",
    badge: "Flexible",
  },
];

export default function Features() {
  return (
    <section className="relative bg-dark-800 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="glow-orb w-[400px] h-[400px] bg-violet-600/10"
        style={{ bottom: "-100px", right: "-100px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            Everything you need
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Built for{" "}
            <span className="gradient-text">modern communities</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            From a student learning Bitcoin basics to a DAO running a $50K tournament —
            QuizChain scales with every use case.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  gradient,
  glow,
  badge,
}: (typeof FEATURES)[0]) {
  return (
    <div
      className={`group glass-hover rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${glow}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-slate-500 px-2 py-1 rounded-full border border-slate-700 bg-slate-800/50">
          {badge}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
