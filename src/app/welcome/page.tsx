'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Sparkles,
  ArrowRight,
  Compass,
  FolderPlus,
  Folder,
  ShieldCheck,
  Scissors,
  Send,
  Zap,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function WelcomePage() {
  const [userName, setUserName] = useState<string>('Creator');
  const [userEmail, setUserEmail] = useState<string>('');
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user?.displayName) {
            setUserName(data.user.displayName);
          }
          if (data.user?.email) {
            setUserEmail(data.user.email);
          }
        } else {
          window.location.href = '/login';
          return;
        }
      } catch {
        window.location.href = '/login';
        return;
      } finally {
        setCheckingAuth(false);
      }
    }
    fetchUser();
  }, []);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen bg-[#09090b] text-[#f4f4f5] flex flex-col items-center justify-center space-y-3 overflow-hidden">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        <p className="text-xs text-[#71717a] font-mono">Initializing ClipFlow Studio...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Colorful Layered Ambient Mesh Glows */}
      <div className="absolute -top-32 -left-24 w-[480px] h-[480px] bg-[#6366f1]/25 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-36 -right-24 w-[480px] h-[480px] bg-[#10b981]/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[560px] h-[300px] bg-[#a855f7]/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle architectural grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />

      <div className="w-full max-w-[740px] relative z-10 space-y-4">
        {/* Top Studio Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/30 font-bold">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight font-headline">ClipFlow</div>
              <div className="text-[10px] text-[#a1a1aa] font-mono uppercase tracking-wider">
                Creator Production Studio
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215]/80 backdrop-blur-md border border-white/[0.1] text-[11px] font-mono text-[#e4e4e7]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Atlas Cloud Connected</span>
            {userEmail && <span className="text-[#71717a] hidden sm:inline">• {userEmail}</span>}
          </div>
        </div>

        {/* Main Studio Launchpad Card with subtle gradient border glow */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[#6366f1]/40 via-white/[0.08] to-[#10b981]/30 shadow-2xl shadow-black/80">
          <div className="rounded-2xl bg-[#121215]/95 backdrop-blur-xl p-5 sm:p-6 space-y-5">
            {/* Personalized Greeting Hero */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#a5b4fc] font-semibold">
                  <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>Workstation Session Ready</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
                  Welcome back,{' '}
                  <span className="bg-gradient-to-r from-[#818cf8] via-[#c084fc] to-[#34d399] bg-clip-text text-transparent">
                    {userName}
                  </span>
                </h1>
                <p className="text-xs text-[#a1a1aa] max-w-md leading-relaxed">
                  Your timeline, active campaign briefs, and creator vault are synced. Pick a shortcut or enter your dashboard.
                </p>
              </div>

              <Link
                href="/"
                className="shrink-0 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white font-bold text-xs transition-all shadow-lg shadow-[#6366f1]/30 flex items-center justify-center gap-2"
              >
                <span>Enter Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3-Step Creator Production Pipeline */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] font-bold">
                Studio Production Pipeline
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    step: '01',
                    title: 'Pick a Bounty',
                    desc: 'Browse verified sponsor briefs & rates',
                    icon: Compass,
                    color: 'text-[#818cf8]',
                    bg: 'bg-[#6366f1]/15 border-[#6366f1]/25',
                  },
                  {
                    step: '02',
                    title: 'Cut & Stage',
                    desc: 'Organize 9:16 cuts & timeline specs',
                    icon: Scissors,
                    color: 'text-[#34d399]',
                    bg: 'bg-[#10b981]/15 border-[#10b981]/25',
                  },
                  {
                    step: '03',
                    title: 'Submit & Earn',
                    desc: 'Deliver approved cuts & track payouts',
                    icon: Send,
                    color: 'text-[#fbbf24]',
                    bg: 'bg-[#f59e0b]/15 border-[#f59e0b]/25',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="p-3 rounded-xl bg-[#09090b]/80 border border-white/[0.06] flex items-start gap-2.5"
                    >
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${item.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <div>
                        <div className="text-[9px] font-mono text-[#71717a] font-bold">STEP {item.step}</div>
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-[#71717a] leading-snug">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Quick Launch Action Cards */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] font-bold">
                Quick Launch Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link
                  href="/campaigns"
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-[#6366f1]/10 border border-white/[0.08] hover:border-[#6366f1]/40 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#a5b4fc] transition-colors">
                        Campaign Explorer
                      </div>
                      <div className="text-[11px] text-[#71717a]">
                        Discover active bounties & rates
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/projects/new"
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-[#10b981]/10 border border-white/[0.08] hover:border-[#10b981]/40 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#10b981]/20 border border-[#10b981]/30 flex items-center justify-center text-[#34d399]">
                      <FolderPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#34d399] transition-colors">
                        Initialize New Cut
                      </div>
                      <div className="text-[11px] text-[#71717a]">
                        Launch 3-step 9:16 timeline wizard
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/projects"
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-[#a855f7]/10 border border-white/[0.08] hover:border-[#a855f7]/40 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#a855f7]/20 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc]">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
                        Active Projects
                      </div>
                      <div className="text-[11px] text-[#71717a]">
                        Resume cuts staged in workspace
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/ai-assistant"
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-[#f59e0b]/10 border border-white/[0.08] hover:border-[#f59e0b]/40 transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#fbbf24] transition-colors">
                        AI Script Lab
                      </div>
                      <div className="text-[11px] text-[#71717a]">
                        Draft viral hooks & pacing beats
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#52525b] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#71717a] px-1">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Authenticated via HttpOnly JWT Session</span>
          </div>
          <div>
            New to ClipFlow?{' '}
            <Link href="/learning" className="text-[#a1a1aa] hover:text-white underline">
              Explore the Learning Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
