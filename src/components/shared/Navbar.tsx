"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Zap, Menu, X, Trophy, LayoutDashboard, Plus, User, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-800/90 backdrop-blur-xl border-b border-violet-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-glow-purple group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-lg font-bold gradient-text">QuizChain</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/tournaments" icon={<Trophy className="w-4 h-4" />}>
              Tournaments
            </NavLink>
            <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
              Dashboard
            </NavLink>
            <NavLink href="/profile" icon={<User className="w-4 h-4" />}>
              Profile
            </NavLink>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/play" className="btn-secondary text-sm px-4 py-2">
              Join Quiz
            </Link>
            <Link href="/create" className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Create Quiz
            </Link>

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-slate-700 hover:border-violet-500/50 transition-colors bg-slate-800/50 hover:bg-slate-800"
                >
                  <Avatar src={session.user.image} name={session.user.name} size={28} />
                  <span className="text-sm font-medium text-slate-200 max-w-[100px] truncate">
                    {session.user.username ?? session.user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700/50">
                      <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white border border-violet-500/50 hover:border-violet-400 hover:bg-violet-500/10 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-xl border-b border-violet-500/10">
          <div className="px-4 py-4 space-y-2">
            {session && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <Avatar src={session.user.image} name={session.user.name} size={36} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                </div>
              </div>
            )}
            <MobileLink href="/tournaments" onClick={() => setMobileOpen(false)}>
              🏆 Tournaments
            </MobileLink>
            <MobileLink href="/dashboard" onClick={() => setMobileOpen(false)}>
              📊 Dashboard
            </MobileLink>
            <MobileLink href="/profile" onClick={() => setMobileOpen(false)}>
              👤 Profile
            </MobileLink>
            <div className="pt-2 space-y-2">
              <Link
                href="/play"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center btn-secondary py-2.5 text-sm"
              >
                Join Quiz
              </Link>
              <Link
                href="/create"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center btn-primary py-2.5 text-sm"
              >
                + Create Quiz
              </Link>
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="block w-full text-center py-2.5 text-sm text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-2.5 text-sm font-semibold text-white border border-violet-500/50 rounded-xl hover:bg-violet-500/10 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function Avatar({ src, name, size }: { src?: string | null; name?: string | null; size: number }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (src) {
    return (
      <Image
        src={src}
        alt={name ?? "User"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all duration-200"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm"
    >
      {children}
    </Link>
  );
}
