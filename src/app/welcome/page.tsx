'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Film,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Compass,
  FolderPlus,
  PlaySquare,
  ShieldCheck
} from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Creator');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.displayName) {
            setUserName(data.user.displayName);
          }
        } else {
          // If unauthenticated, redirect to login immediately
          window.location.href = '/login';
        }
      } catch {
        window.location.href = '/login';
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle hairline background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-[540px] relative z-10 flex flex-col items-center">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/20 font-bold">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight font-headline">ClipFlow</div>
            <div className="text-[10px] text-[#71717a] font-mono uppercase tracking-wider">Creator Studio</div>
          </div>
        </div>

        {/* Minimalist Pro Card */}
        <div className="w-full rounded-2xl bg-[#121215] border border-white/[0.08] p-8 shadow-2xl shadow-black/80 text-center">
          {/* Animated check badge */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/5">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-[#a1a1aa] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Workspace Active • Atlas Cloud Connected</span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight font-headline">
            Welcome back, <span className="text-[#818cf8]">{userName}</span>!
          </h1>
          <p className="text-xs text-[#71717a] mt-2 max-w-sm mx-auto leading-relaxed">
            Your studio workstation is active. Pick up where you left off or launch a new production task below.
          </p>

          {/* 3 Quick Action Launch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 text-left">
            <Link
              href="/campaigns"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all group block"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Compass className="w-4 h-4 text-[#818cf8]" />
                <ArrowRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors" />
              </div>
              <div className="text-xs font-semibold text-white">Explore Bounties</div>
              <div className="text-[11px] text-[#71717a] mt-0.5">Find active sponsor campaigns</div>
            </Link>

            <Link
              href="/projects/new"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] transition-all group block"
            >
              <div className="flex items-center justify-between mb-1.5">
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <ArrowRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-white transition-colors" />
              </div>
              <div className="text-xs font-semibold text-white">Create First Cut</div>
              <div className="text-[11px] text-[#71717a] mt-0.5">Stage 9:16 vertical edit</div>
            </Link>
          </div>

          {/* Primary CTA */}
          <Link
            href="/"
            className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all shadow-md shadow-[#6366f1]/20 flex items-center justify-center gap-2"
          >
            <span>Enter Studio Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-[11px] text-[#52525b] text-center">
          Need a quick tour? Check out the <Link href="/learning" className="text-[#a1a1aa] hover:text-white underline">Learning Hub</Link>
        </div>
      </div>
    </div>
  );
}
