'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Search,
  ArrowUpRight,
  Compass,
  Loader2
} from 'lucide-react';

interface SavedCampaign {
  _id: string;
  title: string;
  brand: string;
  category: string;
  source: string;
  baseRate: number;
  ratePer1kViews?: number;
  aspectRatio: string;
  deadlineDays?: number;
}

export default function SavedCampaignsPage() {
  const [savedList, setSavedList] = useState<SavedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadSaved() {
      setLoading(true);
      try {
        const res = await fetch('/api/campaigns/saved', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSavedList(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load saved campaigns:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, []);

  const handleUnsave = async (campaignId: string) => {
    try {
      const res = await fetch('/api/campaigns/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
      if (res.ok) {
        setSavedList((prev) => prev.filter((item) => item._id !== campaignId));
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return savedList;
    const q = search.toLowerCase();
    return savedList.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [savedList, search]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#818cf8]">Opportunities Vault</span>
            <h1 className="text-sm font-bold text-white tracking-tight">Saved Campaigns</h1>
          </div>
        </div>

        <Link
          href="/campaigns"
          className="px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
        >
          Explore Bounties
        </Link>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-headline">Bookmarked Opportunities</h2>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Campaign briefs you have saved to review or cut later.
            </p>
          </div>
          <div className="text-xs font-mono text-[#71717a]">
            {savedList.length} Saved
          </div>
        </div>

        {savedList.length > 0 && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter saved campaigns..."
              className="w-full bg-[#121215] border border-white/[0.08] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
            />
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <span className="text-xs text-[#71717a] font-mono">Loading Saved Campaigns...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Bookmark className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No saved campaigns yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              When you find a brief or bounty you want to cut later, click the bookmark icon in the Campaign Explorer.
            </p>
            <div className="pt-2">
              <Link
                href="/campaigns"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#818cf8]" />
                <span>Open Campaign Explorer</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-[#71717a]">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#a1a1aa] uppercase font-bold text-[10px]">
                      {item.source}
                    </span>
                    <span>• {item.category}</span>
                    <span>• {item.aspectRatio}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate">
                    <Link href={`/campaigns/${item._id}`} className="hover:text-[#818cf8] transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-[#71717a]">
                    by <span className="text-[#a1a1aa]">{item.brand}</span>
                    {item.deadlineDays ? ` • ${item.deadlineDays}d left` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-sm font-extrabold text-[#10b981] font-mono mr-2">
                    ${item.baseRate}
                    {item.ratePer1kViews ? ` + $${item.ratePer1kViews}/k` : ''}
                  </div>

                  <button
                    onClick={() => handleUnsave(item._id)}
                    title="Remove bookmark"
                    className="p-1.5 rounded-lg bg-[#10b981]/10 hover:bg-red-500/15 text-[#10b981] hover:text-red-400 border border-[#10b981]/30 hover:border-red-500/30 transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                  </button>

                  <Link
                    href={`/campaigns/${item._id}`}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] flex items-center gap-1 transition-colors"
                  >
                    <span>View Specs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
