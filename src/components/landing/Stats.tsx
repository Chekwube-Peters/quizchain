"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 10482, suffix: "+", label: "Quizzes Created", icon: "🎯" },
  { value: 247891, suffix: "+", label: "Questions Answered", icon: "⚡" },
  { value: 583, suffix: "+", label: "Communities Onboarded", icon: "🌍" },
  { value: 50000, prefix: "$", suffix: "+", label: "Rewards Distributed", icon: "₿" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function StatCard({
  value,
  suffix,
  prefix,
  label,
  icon,
  animate,
}: (typeof STATS)[0] & { animate: boolean }) {
  const count = useCountUp(value, 2000, animate);
  return (
    <div className="text-center space-y-2">
      <div className="text-3xl">{icon}</div>
      <div className="text-4xl sm:text-5xl font-black text-white">
        {prefix}
        {count.toLocaleString()}
        <span className="gradient-text">{suffix}</span>
      </div>
      <div className="text-slate-400 font-medium">{label}</div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-dark-800 py-20 overflow-hidden">
      {/* Gradient border top/bottom */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} animate={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
