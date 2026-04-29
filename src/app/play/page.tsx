"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Play, User, Wallet, ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function JoinPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin?callbackUrl=/play");
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) setNickname(session.user.name.split(" ")[0]);
  }, [session]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return setError("Enter a room code");
    if (!nickname.trim()) return setError("Enter a nickname");
    if (code.trim().length !== 6) return setError("Room code must be 6 characters");
    router.push(`/play/${code.toUpperCase().trim()}?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mx-auto shadow-glow-purple">
              <Play className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-white">
              Join a <span className="gradient-text">Quiz</span>
            </h1>
            <p className="text-slate-400">Enter the room code from your host</p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="glass rounded-3xl p-6 border border-slate-700/50 space-y-4">
            {/* Room code */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().slice(0, 6));
                  setError("");
                }}
                placeholder="e.g. ABC123"
                className="input-field text-center text-2xl font-black tracking-[0.3em] uppercase"
                maxLength={6}
                autoComplete="off"
                autoFocus
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Your Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value.slice(0, 20));
                  setError("");
                }}
                placeholder="CryptoWizard42"
                className="input-field"
                maxLength={20}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 flex items-center gap-1.5">
                <span>⚠️</span> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!code || !nickname}
              className="btn-primary w-full py-4 text-base gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" fill="currentColor" />
              Join Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Web3 hint */}
          <div className="glass rounded-2xl p-4 border border-amber-500/20 flex items-start gap-3">
            <Wallet className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-300 font-medium mb-0.5">Connect wallet for Web3 perks</p>
              <p className="text-slate-400">
                Earn NFT badges, receive RBTC prizes, and build your on-chain reputation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
