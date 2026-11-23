'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  ArrowLeft,
  Search,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Clock,
  DollarSign,
  FolderPlus,
  Filter,
  CheckCircle2,
  FolderCheck
} from 'lucide-react';

interface SavedCampaign {
  id: string;
  title: string;
  brand: string;
  source: string;
  status: 'considering' | 'in_progress' | 'ready_to_cut';
  rate: string;
  deadlineDays: number;
  deadlineDate: string;
  savedDate: string;
  tags: string[];
}

const INITIAL_SAVED: SavedCampaign[] = [
  {
    id: 'camp-01',
    title: 'NeonPulse AI Video Synthesizer Launch',
    brand: 'NeonPulse Labs',
    source: 'Content Rewards',
    status: 'in_progress',
    rate: '$140.00 / cut',
    deadlineDays: 4,
    deadlineDate: 'Nov 28, 2026',
    savedDate: 'Today',
    tags: ['AI Tech', 'Motion Graphics'],
  },
  {
    id: 'camp-02',
    title: 'Apex Esports Global Championship Highlights',
    brand: 'Apex League Global',
    source: 'Whop',
    status: 'considering',
    rate: '$6.50 CPM ($250 Cap)',
    deadlineDays: 7,
    deadlineDate: 'Dec 01, 2026',
    savedDate: 'Yesterday',
    tags: ['Gaming', 'Beat Sync'],
  },
  {
    id: 'camp-04',
    title: 'AuraFocus Binaural Spatial App Review',
    brand: 'Aura Soundworks',
    source: 'Content Rewards',
    status: 'ready_to_cut',
    rate: '$110 + $4 CPM',
    deadlineDays: 3,
    deadlineDate: 'Nov 27, 2026',
    savedDate: '2 days ago',
    tags: ['Wellness', 'Audio Reactive'],
  },
];

export default function SavedCampaignsPage() {
  const [savedList, setSavedList] = useState<SavedCampaign[]>(INITIAL_SAVED);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');

  const removeSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = savedList.filter((item) => {
    const matchStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/90 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-[#cebdff]" />
              <span className="text-xs font-semibold text-[#cebdff]">Creator Vault</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Saved Campaigns</h1>
          </div>
        </div>

        <Link
          href="/campaigns"
          className="px-3.5 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-white text-xs font-semibold border border-[#2d2f39] transition-colors"
        >
          Explore More Bounties
        </Link>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-headline">Bookmarked Opportunities</h2>
            <p className="text-xs text-[#9496a1] mt-1">
              Shortlisted briefs pending production or scriptwriting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9496a1]">Filter Status:</span>
            {['all', 'considering', 'ready_to_cut', 'in_progress'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors capitalize ${
                  filterStatus === st
                    ? 'bg-[#cebdff] text-[#111318]'
                    : 'bg-[#111318] text-[#9496a1] hover:text-white border border-[#2d2f39]'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#9496a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved briefs..."
            className="w-full bg-[#111318] border border-[#2d2f39] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
          />
        </div>

        {/* Saved Cards List */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-[#111318] border border-dashed border-[#2d2f39] space-y-3">
            <Bookmark className="w-8 h-8 text-[#9496a1] mx-auto opacity-40" />
            <div className="text-sm font-semibold text-white">No saved campaigns match your selection</div>
            <p className="text-xs text-[#9496a1]">Bookmark interesting campaigns from the Campaign Explorer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#111318] border border-[#2d2f39] hover:border-[#cebdff]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1e2029] text-[#cebdff] border border-[#2d2f39]">
                      {item.source}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'in_progress'
                          ? 'bg-[#cebdff]/20 text-[#cebdff]'
                          : item.status === 'ready_to_cut'
                          ? 'bg-[#4edea3]/20 text-[#4edea3]'
                          : 'bg-[#9496a1]/20 text-[#9496a1]'
                      }`}
                    >
                      {item.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-[#9496a1]">Saved {item.savedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white hover:text-[#cebdff] transition-colors">
                    <Link href={`/campaigns/${item.id}`}>{item.title}</Link>
                  </h3>
                  <div className="text-xs text-[#9496a1]">
                    Client: <span className="text-white">{item.brand}</span> • Deadline: <span className="text-[#ffb4ab]">{item.deadlineDate} ({item.deadlineDays}d)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Compensation</div>
                    <div className="text-sm font-extrabold text-[#4edea3] font-mono">{item.rate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/new?campaignId=${item.id}&campaignTitle=${encodeURIComponent(item.title)}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-colors"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Start Cut</span>
                    </Link>

                    <button
                      onClick={() => removeSaved(item.id)}
                      className="p-2 rounded-xl bg-[#161821] hover:bg-[#ffb4ab]/10 text-[#9496a1] hover:text-[#ffb4ab] border border-[#2d2f39] transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
