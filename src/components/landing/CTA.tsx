"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative bg-dark-900 py-24 overflow-hidden">
      <div
        className="glow-orb w-[600px] h-[600px] bg-violet-600/20"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass rounded-3xl p-10 md:p-16 border border-violet-500/20 shadow-[0_0_80px_rgba(139,92,246,0.15)]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" fill="currentColor" />
            Free to start
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Ready to energize
            <br />
            <span className="gradient-text">your community?</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Create your first AI-powered quiz in under 60 seconds. No credit card required.
            Web3 features available with wallet connect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="btn-primary py-4 px-10 text-base gap-2 group"
            >
              <Zap className="w-5 h-5" fill="currentColor" />
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/play" className="btn-secondary py-4 px-10 text-base">
              Join a Live Quiz
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span>✓ No credit card</span>
            <span>✓ AI-generated questions</span>
            <span>✓ Unlimited players</span>
            <span>✓ Web3 ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
