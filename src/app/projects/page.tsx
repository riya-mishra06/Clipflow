'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  ArrowUpRight,
  Folder,
  Loader2
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface ProjectCardData {
  _id: string;
  title: string;
  campaignTitle?: string;
  kind: 'campaign' | 'original' | 'practice';
  status: 'active' | 'in_review' | 'planned' | 'completed';
  aspectRatio: string;
  resolution?: string;
  targetDuration?: string;
  estPayout?: string;
  createdAt: string;
}

export default function ProjectsHubPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Reusable custom hook for debounced search
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter !== 'all') queryParams.set('status', statusFilter);
        if (debouncedSearch.trim()) queryParams.set('search', debouncedSearch.trim());

        const res = await fetch(`/api/projects?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setProjects(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [statusFilter, debouncedSearch]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Active Video Projects
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Production cuts staged in editor timeline with QC checks and export status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-xs font-mono text-[#a1a1aa] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>{projects.length} Active Cuts in Timeline</span>
            </div>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Cut</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cuts by title or linked campaign..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'active', 'in_review', 'completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">Syncing timeline cuts from Atlas...</div>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Folder className="w-12 h-12 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-base font-semibold text-white">No video projects yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Create your first project cut or attach a verified brief from the Campaign Explorer.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Initialize Project</span>
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
          /* Real Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20">
                          {proj.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-[#71717a] font-mono">{proj.aspectRatio}</span>
                        {proj.resolution && (
                          <span className="text-xs text-[#71717a] font-mono">• {proj.resolution}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-[#818cf8] transition-colors">
                        <Link href={`/projects/${proj._id}`}>{proj.title}</Link>
                      </h3>
                      <div className="text-xs text-[#71717a]">
                        Attached to: <span className="text-[#a1a1aa]">{proj.campaignTitle || 'Direct Cut'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-[#71717a] uppercase font-bold">Est. Yield</div>
                      <div className="text-sm font-extrabold text-[#10b981] font-mono">
                        {proj.estPayout || '$140.00'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717a]">
                    <span className="font-mono">{proj.targetDuration || '45s cut'}</span>
                    <Link
                      href={`/projects/${proj._id}`}
                      className="text-[#818cf8] hover:text-white flex items-center gap-1 font-medium"
                    >
                      <span>Open Workspace</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
