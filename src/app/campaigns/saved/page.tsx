'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  ArrowLeft,
  Search,
  Plus,
  ArrowUpRight,
  Compass
} from 'lucide-react';

interface SavedCampaign {
  id: string;
  title: string;
  brand: string;
  source: string;
  status: string;
  rate: string;
  deadlineDate: string;
}

export default function SavedCampaignsPage() {
  // Real state: empty by default until user bookmarks in explorer
  const [savedList, setSavedList] = useState<SavedCampaign[]>([]);
  const [search, setSearch] = useState('');

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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#818cf8]">Opportunities Vault</span>
            </div>
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
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Bookmarked Opportunities</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Campaign briefs you have saved to review or cut later.
          </p>
        </div>

        {savedList.length === 0 ? (
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
            {savedList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-sm text-white">{item.title}</h3>
                  <div className="text-xs text-[#71717a]">{item.brand} • {item.deadlineDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
