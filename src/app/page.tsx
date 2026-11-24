'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Compass,
  Bookmark,
  Folder,
  Layers,
  Send,
  DollarSign,
  Calendar,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Play,
  Share2,
  HardDrive
} from 'lucide-react';

interface ProjectSummary {
  id: string;
  title: string;
  campaign: string;
  aspect: string;
  progress: number;
  deadline: string;
  payout: string;
  status: string;
}

export default function StudioDashboard() {
  // Real initial state: Empty by default until user creates or imports
  const [projects, setProjects] = useState<ProjectSummary[]>([]);

  return (
    <div className="flex-1 flex flex-col min-w-0">

        {/* Studio Content */}
        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
                Production Control Center
              </h1>
              <p className="text-xs text-[#a1a1aa] mt-1">
                Real-time overview of active video project cuts, escrow payouts, and verified bounties.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/campaigns"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white border border-white/[0.08] transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Explore Opportunities</span>
              </Link>
            </div>
          </div>

          {/* 4 Financial & Production Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Available Payouts</div>
              <div className="font-extrabold text-2xl text-[#10b981] font-mono mt-0.5">$0.00</div>
              <div className="text-[11px] text-[#71717a]">No settled payouts yet</div>
            </div>

            <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Active Cuts</div>
              <div className="font-extrabold text-2xl text-white font-mono mt-0.5">{projects.length}</div>
              <div className="text-[11px] text-[#71717a]">
                {projects.length === 0 ? 'No active timeline cuts' : `${projects.length} in production`}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Verified Views</div>
              <div className="font-extrabold text-2xl text-white font-mono mt-0.5">0</div>
              <div className="text-[11px] text-[#71717a]">Connect social accounts to track</div>
            </div>

            <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Total Submissions</div>
              <div className="font-extrabold text-2xl text-white font-mono mt-0.5">0</div>
              <div className="text-[11px] text-[#71717a]">Ready for first export submission</div>
            </div>
          </section>

          {/* Active Projects Table / Real Empty State */}
          <section className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white font-headline">Active Video Cuts</h2>
                <p className="text-xs text-[#71717a]">Projects currently staged in timeline</p>
              </div>

              <Link
                href="/projects/new"
                className="text-xs font-semibold text-[#818cf8] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>+ Start Project</span>
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="py-20 text-center space-y-3 px-4">
                <Folder className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
                <div className="text-sm font-semibold text-white">No active project cuts</div>
                <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                  Start your first video edit, import a brand brief, or link a social channel.
                </p>
                <div className="pt-3 flex items-center justify-center gap-3">
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Studio Cut</span>
                  </Link>
                  <Link
                    href="/campaigns"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white text-xs font-semibold border border-white/[0.08] transition-colors"
                  >
                    <span>Browse Campaigns</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#818cf8]">
                          {proj.status}
                        </span>
                        <span className="text-xs text-[#71717a] font-mono">{proj.aspect}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white hover:text-[#818cf8] transition-colors">
                        <Link href={`/projects/${proj.id}`}>{proj.title}</Link>
                      </h3>
                      <div className="text-xs text-[#71717a]">
                        Attached to: <span className="text-[#a1a1aa]">{proj.campaign}</span> • Deadline: <span className="text-[#f59e0b]">{proj.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-[#71717a]">Target Yield</div>
                        <div className="font-extrabold text-sm text-[#10b981] font-mono">{proj.payout}</div>
                      </div>

                      <Link
                        href={`/projects/${proj.id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
                      >
                        Open Cut
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
  );
}
