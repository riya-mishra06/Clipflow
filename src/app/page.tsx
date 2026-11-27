'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Folder,
  Plus,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

interface DashboardProject {
  _id: string;
  title: string;
  campaignTitle?: string;
  aspectRatio: string;
  targetDuration?: string;
  estPayout?: string;
  status: string;
  deadlineDays?: number;
}

interface DashboardCampaign {
  _id: string;
  title: string;
  brand: string;
  category: string;
  baseRate: number;
  ratePer1kViews?: number;
  aspectRatio: string;
}

interface DashboardStats {
  pipelineValue: number;
  activeProjectsCount: number;
  openCampaignsCount: number;
  vaultAssetsCount: number;
}

export default function StudioDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    pipelineValue: 0,
    activeProjectsCount: 0,
    openCampaignsCount: 0,
    vaultAssetsCount: 0,
  });
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [campaigns, setCampaigns] = useState<DashboardCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch('/api/dashboard', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.stats) setStats(json.stats);
          setProjects(json.recentProjects || []);
          setCampaigns(json.recentCampaigns || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Production Control Center
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Real-time overview of active video project cuts, vault assets, and verified bounties.
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

        {/* 4 Live Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Pipeline Value
            </div>
            <div className="font-extrabold text-2xl text-[#10b981] font-mono mt-0.5">
              ${stats.pipelineValue.toFixed(2)}
            </div>
            <div className="text-[11px] text-[#71717a]">
              {stats.activeProjectsCount === 0
                ? 'No active project payouts yet'
                : `Across ${stats.activeProjectsCount} staged cuts`}
            </div>
          </div>

          <Link
            href="/projects"
            className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-colors space-y-1 block"
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Active Cuts
            </div>
            <div className="font-extrabold text-2xl text-white font-mono mt-0.5">
              {stats.activeProjectsCount}
            </div>
            <div className="text-[11px] text-[#71717a]">
              {stats.activeProjectsCount === 0
                ? 'No active timeline cuts'
                : `${stats.activeProjectsCount} in production`}
            </div>
          </Link>

          <Link
            href="/campaigns"
            className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-colors space-y-1 block"
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Open Bounties
            </div>
            <div className="font-extrabold text-2xl text-white font-mono mt-0.5">
              {stats.openCampaignsCount}
            </div>
            <div className="text-[11px] text-[#71717a]">
              Live in Campaign Explorer
            </div>
          </Link>

          <Link
            href="/assets"
            className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-colors space-y-1 block"
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Vault Assets
            </div>
            <div className="font-extrabold text-2xl text-white font-mono mt-0.5">
              {stats.vaultAssetsCount}
            </div>
            <div className="text-[11px] text-[#71717a]">
              Active media files & links
            </div>
          </Link>
        </section>

        {/* Active Projects Table */}
        <section className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white font-headline">Active Video Cuts</h2>
              <p className="text-xs text-[#71717a]">Your latest projects staged in timeline</p>
            </div>

            <Link
              href="/projects/new"
              className="text-xs font-semibold text-[#818cf8] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>+ Start Project</span>
            </Link>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
              <span className="text-xs text-[#71717a] font-mono">Syncing Studio Overview...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center space-y-3 px-4">
              <Folder className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
              <div className="text-sm font-semibold text-white">No active project cuts</div>
              <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                Start your first video edit, import a brand brief, or stage media in your Asset Vault.
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
                <div
                  key={proj._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#6366f1]/15 text-[#818cf8]">
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-[#71717a] font-mono">{proj.aspectRatio}</span>
                      {proj.targetDuration && (
                        <span className="text-xs text-[#71717a] font-mono">• {proj.targetDuration}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-white hover:text-[#818cf8] transition-colors truncate">
                      <Link href={`/projects/${proj._id}`}>{proj.title}</Link>
                    </h3>
                    <div className="text-xs text-[#71717a]">
                      Attached to:{' '}
                      <span className="text-[#a1a1aa]">{proj.campaignTitle || 'Direct Cut'}</span>
                      {proj.deadlineDays && (
                        <>
                          {' '}
                          • <span className="text-[#f59e0b]">{proj.deadlineDays}d remaining</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#71717a]">Target Yield</div>
                      <div className="font-extrabold text-sm text-[#10b981] font-mono">
                        {proj.estPayout || '$140.00'}
                      </div>
                    </div>

                    <Link
                      href={`/projects/${proj._id}`}
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

        {/* Latest Open Campaigns Quick-Pick */}
        {campaigns.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-headline">Latest Open Bounties</h2>
              <Link
                href="/campaigns"
                className="text-xs text-[#818cf8] hover:text-white flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((camp) => (
                <Link
                  key={camp._id}
                  href={`/campaigns/${camp._id}`}
                  className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all space-y-2 block group"
                >
                  <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                    <span className="font-mono">{camp.category}</span>
                    <span className="text-[#10b981] font-mono font-bold">
                      ${camp.baseRate}{camp.ratePer1kViews ? ` + $${camp.ratePer1kViews}/k` : ''}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-[#818cf8] transition-colors truncate">
                    {camp.title}
                  </div>
                  <div className="text-[11px] text-[#71717a]">
                    by <span className="text-[#a1a1aa]">{camp.brand}</span> • {camp.aspectRatio}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
