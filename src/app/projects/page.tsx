'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Plus,
  Search,
  Filter,
  Clock,
  Sparkles,
  ArrowUpRight,
  SlidersHorizontal,
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
  Calendar,
  MoreVertical,
  BarChart2,
  Scissors,
  CheckSquare
} from 'lucide-react';

interface ProjectCardData {
  id: string;
  title: string;
  campaignTitle: string;
  kind: 'campaign' | 'original' | 'practice';
  status: 'active' | 'in_review' | 'planned' | 'completed';
  progress: number;
  deadlineDate: string;
  deadlineDays: number;
  aspectRatio: string;
  clipsCount: number;
  clipsApproved: number;
  estPayout: string;
  lastEdited: string;
  primaryColor: string;
}

const INITIAL_PROJECTS: ProjectCardData[] = [
  {
    id: 'proj-01',
    title: 'NeonPulse AI Glitch Cuts Pack',
    campaignTitle: 'NeonPulse AI Video Synthesizer Launch',
    kind: 'campaign',
    status: 'active',
    progress: 72,
    deadlineDate: 'Nov 28, 2026',
    deadlineDays: 4,
    aspectRatio: '9:16 Vertical',
    clipsCount: 3,
    clipsApproved: 2,
    estPayout: '$420.00',
    lastEdited: '18 mins ago',
    primaryColor: '#cebdff',
  },
  {
    id: 'proj-02',
    title: 'Apex Esports Finals Round 4 Clutch',
    campaignTitle: 'Apex Esports Global Championship Highlights',
    kind: 'campaign',
    status: 'in_review',
    progress: 90,
    deadlineDate: 'Dec 01, 2026',
    deadlineDays: 7,
    aspectRatio: '9:16 Vertical',
    clipsCount: 2,
    clipsApproved: 1,
    estPayout: '$250.00',
    lastEdited: '2 hours ago',
    primaryColor: '#4edea3',
  },
  {
    id: 'proj-03',
    title: 'Minimalist Tech Setup POV Series',
    campaignTitle: 'AuraFocus Binaural Spatial App Review',
    kind: 'campaign',
    status: 'planned',
    progress: 25,
    deadlineDate: 'Nov 27, 2026',
    deadlineDays: 3,
    aspectRatio: '9:16 Vertical',
    clipsCount: 2,
    clipsApproved: 0,
    estPayout: '$220.00',
    lastEdited: '1 day ago',
    primaryColor: '#cebdff',
  },
  {
    id: 'proj-04',
    title: 'Personal Davinci Macro Tutorial',
    campaignTitle: 'Independent Creator Practice',
    kind: 'practice',
    status: 'completed',
    progress: 100,
    deadlineDate: 'Completed',
    deadlineDays: 0,
    aspectRatio: '16:9 Landscape',
    clipsCount: 1,
    clipsApproved: 1,
    estPayout: '$0.00',
    lastEdited: '4 days ago',
    primaryColor: '#9496a1',
  },
];

export default function ProjectsHubPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [kindFilter, setKindFilter] = useState<string>('all');
  const [projects, setProjects] = useState<ProjectCardData[]>(INITIAL_PROJECTS);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.campaignTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchKind = kindFilter === 'all' || p.kind === kindFilter;
    return matchSearch && matchStatus && matchKind;
  });

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/85 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9d4edd] to-[#d0bcff] flex items-center justify-center shadow-lg shadow-[#9d4edd]/20">
              <Film className="w-4 h-4 text-[#1a0033]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-headline">ClipFlow</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e2029] text-[#cebdff] border border-[#2d2f39]">
              Projects Studio
            </span>
          </Link>

          <div className="h-4 w-px bg-[#2d2f39]" />

          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-[#9496a1] hover:text-white hover:bg-[#1e2029]/60 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/campaigns"
              className="px-3 py-1.5 rounded-lg text-[#9496a1] hover:text-white hover:bg-[#1e2029]/60 transition-colors"
            >
              Campaigns
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-lg text-white bg-[#1e2029] font-semibold border border-[#3b3d4a]/50"
            >
              Projects
            </Link>
            <Link
              href="/assets"
              className="px-3 py-1.5 rounded-lg text-[#9496a1] hover:text-white hover:bg-[#1e2029]/60 transition-colors"
            >
              Assets
            </Link>
            <Link
              href="/channels"
              className="px-3 py-1.5 rounded-lg text-[#9496a1] hover:text-white hover:bg-[#1e2029]/60 transition-colors"
            >
              Channels
            </Link>
          </nav>
        </div>

        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] font-bold text-xs transition-all shadow-md shadow-[#cebdff]/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Studio Project</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Header Stats Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cebdff]/10 border border-[#cebdff]/20 text-[#cebdff] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cebdff]" />
              <span>Production Workstation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-headline">
              Active Video Projects
            </h1>
            <p className="text-[#9496a1] text-sm mt-1 max-w-2xl">
              Track timeline cuts, script generation hooks, versioned exports, and approval pipelines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#111318] border border-[#2d2f39] flex items-center gap-3 text-xs">
              <div>
                <span className="text-[#9496a1]">In Pipeline: </span>
                <span className="font-bold text-white">4 Projects</span>
              </div>
              <div className="h-3 w-px bg-[#2d2f39]" />
              <div>
                <span className="text-[#9496a1]">Est. Pipeline Yield: </span>
                <span className="font-bold text-[#4edea3]">$890.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-[#111318] border border-[#2d2f39] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9496a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter projects by title or linked campaign..."
              className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#161821] border border-[#2d2f39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff] cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="active">Active Cutting</option>
              <option value="in_review">In Review</option>
              <option value="planned">Planned / Scripting</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value)}
              className="bg-[#161821] border border-[#2d2f39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff] cursor-pointer"
            >
              <option value="all">Type: All</option>
              <option value="campaign">Bounty Campaign</option>
              <option value="original">Original Content</option>
              <option value="practice">Creator Practice</option>
            </select>
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl bg-gradient-to-br from-[#161821] to-[#111318] border border-[#2d2f39] hover:border-[#cebdff]/50 transition-all duration-200 p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Details */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                          proj.status === 'active'
                            ? 'bg-[#cebdff]/20 text-[#cebdff] border border-[#cebdff]/30'
                            : proj.status === 'in_review'
                            ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30'
                            : proj.status === 'completed'
                            ? 'bg-[#9496a1]/20 text-[#9496a1] border border-[#2d2f39]'
                            : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                        }`}
                      >
                        {proj.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-[#9496a1]">
                        {proj.aspectRatio}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-[#cebdff] transition-colors leading-snug">
                      <Link href={`/projects/${proj.id}`}>{proj.title}</Link>
                    </h3>

                    <div className="text-xs text-[#9496a1]">
                      Linked: <span className="text-[#cebdff] font-medium">{proj.campaignTitle}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Bounty Target</div>
                    <div className="text-base font-extrabold text-[#4edea3] font-mono">{proj.estPayout}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#9496a1]">Production Milestone Progress</span>
                    <span className="text-white font-bold font-mono">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden border border-[#2d2f39]/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#9d4edd] to-[#cebdff] transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Quick stats pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0c0e13]/80 border border-[#2d2f39]/40 text-center">
                    <div className="text-[10px] text-[#9496a1]">Cuts Status</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {proj.clipsApproved}/{proj.clipsCount} Approved
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c0e13]/80 border border-[#2d2f39]/40 text-center">
                    <div className="text-[10px] text-[#9496a1]">Target Deadline</div>
                    <div className="text-xs font-bold text-[#ffb4ab] mt-0.5">
                      {proj.deadlineDays > 0 ? `${proj.deadlineDays}d remaining` : 'Complete'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c0e13]/80 border border-[#2d2f39]/40 text-center">
                    <div className="text-[10px] text-[#9496a1]">Last Timeline Cut</div>
                    <div className="text-xs font-bold text-[#9496a1] mt-0.5">{proj.lastEdited}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Action Buttons */}
              <div className="pt-5 mt-4 border-t border-[#2d2f39]/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${proj.id}/plan`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] text-xs font-medium border border-[#2d2f39] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Script Plan</span>
                  </Link>
                  <Link
                    href={`/projects/${proj.id}/tasks`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39] transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Tasks</span>
                  </Link>
                  <Link
                    href={`/projects/${proj.id}/drafts`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39] transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Drafts</span>
                  </Link>
                </div>

                <Link
                  href={`/projects/${proj.id}`}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10"
                >
                  <span>Open Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
