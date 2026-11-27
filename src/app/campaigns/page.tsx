'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Bookmark,
  BookmarkCheck,
  Plus,
  ArrowUpRight,
  Layers,
  Loader2
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface CampaignItem {
  _id: string;
  title: string;
  brand: string;
  category: string;
  source: string;
  payoutModel: string;
  baseRate: number;
  ratePer1kViews?: number;
  estPool?: string;
  deadlineDays?: number;
  deadlineDate?: string;
  aspectRatio: string;
  difficulty: string;
  tags: string[];
  brief?: string;
  spotsRemaining?: number;
}

export default function CampaignExplorerPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Reusable custom hook for clean debounced search
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    async function loadSavedIds() {
      try {
        const res = await fetch('/api/campaigns/saved', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSavedIds(new Set(json.savedIds || []));
        }
      } catch {
        // Non-blocking
      }
    }
    loadSavedIds();
  }, []);

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.set('category', category);
        if (debouncedSearch.trim()) queryParams.set('search', debouncedSearch.trim());

        const res = await fetch(`/api/campaigns?${queryParams.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setCampaigns(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load campaigns:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, [category, debouncedSearch]);

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/campaigns/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: id }),
      });
      if (res.ok) {
        const json = await res.json();
        setSavedIds(new Set(json.savedIds || []));
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Campaign Explorer
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Discover verified short-form video briefs and creator bounties from Whop, Content Rewards, and brand sponsors.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/campaigns/saved"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.06] border border-white/[0.08] text-white font-semibold transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Saved ({savedIds.size})</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[#a1a1aa]">Active Ingestion:</span>
              <span className="font-bold text-white font-mono">Live MongoDB Atlas</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search briefs by brand, hashtag (#gaming), or topic..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['All', 'Tech & AI', 'Gaming', 'Fintech & Crypto', 'SaaS & Productivity', 'Lifestyle & Fitness'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">Querying Atlas Cluster...</div>
          </div>
        ) : campaigns.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Compass className="w-12 h-12 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-base font-semibold text-white">No campaigns imported yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Import a bounty program via URL from Whop or Content Rewards, or create a custom brand campaign brief.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <Link
                href="/campaigns/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Import First Campaign</span>
              </Link>
              <Link
                href="/campaigns/sources"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[#a1a1aa] hover:text-white text-xs font-semibold border border-white/[0.08] transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ingest Sources & Health</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Real Data Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-5 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-[#a1a1aa] border border-white/[0.08]">
                          {camp.source}
                        </span>
                        <span className="text-xs text-[#71717a]">• {camp.category}</span>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-[#818cf8] transition-colors leading-snug">
                        <Link href={`/campaigns/${camp._id}`}>{camp.title}</Link>
                      </h3>

                      <div className="text-xs text-[#71717a]">
                        by <span className="text-white font-medium">{camp.brand}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(camp._id, e)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#71717a] hover:text-white border border-white/[0.08] transition-colors"
                      title="Bookmark campaign"
                    >
                      {savedIds.has(camp._id) ? (
                        <BookmarkCheck className="w-3.5 h-3.5 text-[#10b981]" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed">
                    {camp.brief || 'No summary brief provided for this campaign yet.'}
                  </p>

                  <div className="space-y-1.5 py-2.5 border-y border-white/[0.06] text-[11px] text-[#71717a]">
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-mono text-white">{camp.aspectRatio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty / Payout:</span>
                      <span className="text-white font-mono">{camp.difficulty} • {camp.payoutModel}</span>
                    </div>
                    {camp.deadlineDays && (
                      <div className="flex justify-between">
                        <span>Deadline:</span>
                        <span className="text-[#f59e0b] font-medium">{camp.deadlineDays} days remaining</span>
                      </div>
                    )}
                  </div>

                  {camp.tags && camp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {camp.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/[0.03] text-[#71717a] font-mono border border-white/[0.05]"
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] mt-4">
                  <div>
                    <div className="text-[10px] text-[#71717a] uppercase font-bold">Compensation</div>
                    <div className="text-sm font-extrabold text-[#10b981] font-mono">
                      ${camp.baseRate}
                      {camp.ratePer1kViews ? ` + $${camp.ratePer1kViews}/k` : ''}
                    </div>
                  </div>

                  <Link
                    href={`/campaigns/${camp._id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors flex items-center gap-1"
                  >
                    <span>View Specs</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
