'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowUpRight,
  Clock,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Film,
  FolderPlus,
  Flame,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

interface CampaignItem {
  id: string;
  title: string;
  brand: string;
  category: 'Tech' | 'Gaming' | 'Fintech' | 'AI' | 'Lifestyle' | 'Entertainment';
  source: 'Content Rewards' | 'Whop' | 'Manual' | 'TikTok Pulse' | 'X Clip';
  payoutModel: 'Fixed Per Clip' | 'CPM / Performance' | 'Hybrid';
  rate: string;
  estPool: string;
  deadlineDays: number;
  deadlineDate: string;
  aspectRatio: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Elite Pro';
  tags: string[];
  featured?: boolean;
  description: string;
  submissionRequirements: string;
  spotsLeft: number;
  totalSubmissions: number;
  isSaved?: boolean;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'camp-01',
    title: 'NeonPulse AI Video Synthesizer Launch',
    brand: 'NeonPulse Labs',
    category: 'AI',
    source: 'Content Rewards',
    payoutModel: 'Fixed Per Clip',
    rate: '$140.00 / approved cut',
    estPool: '$12,500 Pool',
    deadlineDays: 4,
    deadlineDate: '2026-11-28',
    aspectRatio: '9:16 Vertical',
    difficulty: 'Intermediate',
    tags: ['AI Tech', 'Fast Paced', 'Motion Graphics'],
    featured: true,
    description: 'Create fast-paced 45-60s dynamic shorts showcasing AI generative face tracking and audio reactive glitch filters. Raw B-roll stems provided in studio.',
    submissionRequirements: 'Min 1080x1920 @ 60fps, dynamic kinetic typography, CTA at 0:52 mark.',
    spotsLeft: 8,
    totalSubmissions: 34,
  },
  {
    id: 'camp-02',
    title: 'Apex Esports Global Championship Highlights',
    brand: 'Apex League Global',
    category: 'Gaming',
    source: 'Whop',
    payoutModel: 'CPM / Performance',
    rate: '$6.50 CPM ($250 Cap)',
    estPool: '$18,000 Pool',
    deadlineDays: 7,
    deadlineDate: '2026-12-01',
    aspectRatio: '9:16 Vertical',
    difficulty: 'Elite Pro',
    tags: ['Gaming', 'Viral Hook', 'Beat-Synced'],
    featured: true,
    description: 'Transform 6-hour tournament streams into 30s punchy clutch round edits. Heavy sound design, beat drop sync, and tension build up.',
    submissionRequirements: 'No copyright audio (use Whop stems), custom thumbnail overlay included.',
    spotsLeft: 12,
    totalSubmissions: 89,
  },
  {
    id: 'camp-03',
    title: 'FlowVault Crypto Cold Storage Explainer',
    brand: 'FlowVault Core',
    category: 'Fintech',
    source: 'Manual',
    payoutModel: 'Fixed Per Clip',
    rate: '$95.00 / clip',
    estPool: '$4,200 Pool',
    deadlineDays: 11,
    deadlineDate: '2026-12-05',
    aspectRatio: '9:16 Vertical',
    difficulty: 'Beginner',
    tags: ['Fintech', 'Explainer', 'Clean UI'],
    featured: false,
    description: 'Break down physical seed phrase backup vulnerabilities into a simple 40-second animated story. Clear 3-step solution format.',
    submissionRequirements: 'Brand color kit `#4edea3` accents required. Audio voiceover must be clean.',
    spotsLeft: 20,
    totalSubmissions: 15,
  },
  {
    id: 'camp-04',
    title: 'AuraFocus Binaural Spatial App Review',
    brand: 'Aura Soundworks',
    category: 'Lifestyle',
    source: 'Content Rewards',
    payoutModel: 'Hybrid',
    rate: '$110 + $4.00 CPM',
    estPool: '$9,000 Pool',
    deadlineDays: 3,
    deadlineDate: '2026-11-27',
    aspectRatio: '9:16 Vertical',
    difficulty: 'Intermediate',
    tags: ['Wellness', 'Audio Reactive', 'POV'],
    featured: false,
    description: 'Day-in-the-life desk setup aesthetic. Creator working with ambient binaural beats cutting background distractions.',
    submissionRequirements: 'High quality headphone wear B-roll required. Subtitles in Plus Jakarta Sans.',
    spotsLeft: 4,
    totalSubmissions: 52,
  },
  {
    id: 'camp-05',
    title: 'HyperDrive SSD 8K Raw Workflow Stress Test',
    brand: 'HyperDrive Hardware',
    category: 'Tech',
    source: 'Whop',
    payoutModel: 'Fixed Per Clip',
    rate: '$160.00 / approved cut',
    estPool: '$15,000 Pool',
    deadlineDays: 9,
    deadlineDate: '2026-12-03',
    aspectRatio: '16:9 & 9:16',
    difficulty: 'Elite Pro',
    tags: ['Hardware', 'Speed Test', 'Motion Track'],
    featured: false,
    description: 'Side-by-side benchmark comparison rendering ProRes 422 HQ vs standard SATA. Emphasize zero dropped frames in timeline scrubbing.',
    submissionRequirements: 'Must show raw Premiere/DaVinci playback counter. High-res delivery.',
    spotsLeft: 6,
    totalSubmissions: 27,
  },
  {
    id: 'camp-06',
    title: 'EchoStream Live VTuber Clip Pack',
    brand: 'EchoStream Interactive',
    category: 'Entertainment',
    source: 'TikTok Pulse',
    payoutModel: 'CPM / Performance',
    rate: '$8.00 CPM ($300 Cap)',
    estPool: '$6,500 Pool',
    deadlineDays: 14,
    deadlineDate: '2026-12-08',
    aspectRatio: '9:16 Vertical',
    difficulty: 'Beginner',
    tags: ['Anime', 'Funny Moments', 'Captions'],
    featured: false,
    description: 'Funny and awkward moments cut from Friday 8-hour live charity stream. Add expressive sound SFX, zooms, and colorful captions.',
    submissionRequirements: 'Highlight clip length 25s - 45s. Fast paced humor.',
    spotsLeft: 25,
    totalSubmissions: 41,
  },
];

export default function CampaignExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedPayout, setSelectedPayout] = useState<string>('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['camp-01']));
  const [sortBy, setSortBy] = useState<'deadline' | 'rate' | 'popular'>('deadline');

  const categories = ['All', 'AI', 'Tech', 'Gaming', 'Fintech', 'Lifestyle', 'Entertainment'];
  const sources = ['All', 'Content Rewards', 'Whop', 'Manual', 'TikTok Pulse'];
  const payoutTypes = ['All', 'Fixed Per Clip', 'CPM / Performance', 'Hybrid'];

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCampaigns = useMemo(() => {
    return INITIAL_CAMPAIGNS.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
      const matchesSource = selectedSource === 'All' || c.source === selectedSource;
      const matchesPayout = selectedPayout === 'All' || c.payoutModel === selectedPayout;

      return matchesSearch && matchesCategory && matchesSource && matchesPayout;
    }).sort((a, b) => {
      if (sortBy === 'deadline') return a.deadlineDays - b.deadlineDays;
      if (sortBy === 'rate') return b.totalSubmissions - a.totalSubmissions;
      return b.totalSubmissions - a.totalSubmissions;
    });
  }, [searchQuery, selectedCategory, selectedSource, selectedPayout, sortBy]);

  const featuredCampaigns = INITIAL_CAMPAIGNS.filter((c) => c.featured);

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/85 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#9d4edd] to-[#d0bcff] flex items-center justify-center shadow-lg shadow-[#9d4edd]/20">
              <Film className="w-4 h-4 text-[#1a0033]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white font-headline">ClipFlow</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e2029] text-[#cebdff] border border-[#2d2f39]">
              Studio 2.0
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
              className="px-3 py-1.5 rounded-lg text-white bg-[#1e2029] font-semibold border border-[#3b3d4a]/50"
            >
              Campaigns
            </Link>
            <Link
              href="/projects"
              className="px-3 py-1.5 rounded-lg text-[#9496a1] hover:text-white hover:bg-[#1e2029]/60 transition-colors"
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

        <div className="flex items-center gap-3">
          <Link
            href="/campaigns/saved"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-xs font-medium text-[#cebdff] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({savedIds.size})</span>
          </Link>
          <Link
            href="/campaigns/sources"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-xs font-medium text-[#9496a1] hover:text-white transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sources</span>
          </Link>
          <Link
            href="/campaigns/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d0bcff] hover:bg-[#cebdff] text-[#111318] font-semibold text-xs transition-colors shadow-md shadow-[#d0bcff]/10"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Import Campaign</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        {/* Hero Headline Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cebdff]/10 border border-[#cebdff]/20 text-[#cebdff] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#cebdff]" />
              <span>Creator Opportunity Feed</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight font-headline">
              Campaign Explorer
            </h1>
            <p className="text-[#9496a1] text-sm mt-1 max-w-2xl">
              Discover verified short-form video bounties, brand briefs, and clip challenges. Synchronized from Content Rewards, Whop, and private creator networks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#111318] border border-[#2d2f39] flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
              <span className="text-[#9496a1]">Total Available Pool:</span>
              <span className="font-bold text-[#4edea3]">$65,200 USD</span>
            </div>
          </div>
        </div>

        {/* Featured Opportunities Mosaic */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ffb4ab]" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-headline">
                High-Yield Featured Bounties
              </h2>
            </div>
            <span className="text-xs text-[#9496a1]">Closing within 7 days</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="group relative rounded-2xl bg-gradient-to-br from-[#161821] to-[#111318] border border-[#2d2f39]/80 hover:border-[#cebdff]/60 transition-all duration-300 p-6 overflow-hidden flex flex-col justify-between"
              >
                {/* Ambient glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#cebdff]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#cebdff]/10 transition-colors" />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#cebdff]/15 text-[#cebdff] border border-[#cebdff]/30">
                          {camp.source}
                        </span>
                        <span className="text-xs text-[#9496a1]">• {camp.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#cebdff] transition-colors leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-[#9496a1]">by <span className="text-white font-medium">{camp.brand}</span></p>
                    </div>

                    <button
                      onClick={(e) => toggleSave(camp.id, e)}
                      className="p-2 rounded-xl bg-[#1e2029]/80 hover:bg-[#2d2f39] text-[#9496a1] hover:text-white border border-[#2d2f39] transition-colors"
                      title={savedIds.has(camp.id) ? 'Remove bookmark' : 'Save opportunity'}
                    >
                      {savedIds.has(camp.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-[#4edea3]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#9496a1] line-clamp-2 leading-relaxed mb-4">
                    {camp.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {camp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#1e2029] text-[#cebdff] border border-[#2d2f39]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2d2f39]/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-[#9496a1] uppercase font-semibold">Guaranteed Payout</div>
                    <div className="text-base font-extrabold text-[#4edea3] font-mono">{camp.rate}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] text-[#ffb4ab] font-medium flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{camp.deadlineDays}d left</span>
                      </div>
                      <div className="text-[10px] text-[#9496a1]">{camp.spotsLeft} spots available</div>
                    </div>

                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md hover:shadow-[#cebdff]/20"
                    >
                      <span>View Specs</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="p-4 rounded-2xl bg-[#111318] border border-[#2d2f39] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9496a1] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search briefs by brand, hashtag (#gaming), or topic..."
              className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#161821] border border-[#2d2f39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff] cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>

            {/* Source Select */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-[#161821] border border-[#2d2f39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff] cursor-pointer"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  Source: {s}
                </option>
              ))}
            </select>

            {/* Payout Select */}
            <select
              value={selectedPayout}
              onChange={(e) => setSelectedPayout(e.target.value)}
              className="bg-[#161821] border border-[#2d2f39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff] cursor-pointer"
            >
              {payoutTypes.map((p) => (
                <option key={p} value={p}>
                  Payout: {p}
                </option>
              ))}
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'deadline' ? 'rate' : 'deadline')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] border border-[#2d2f39] text-xs text-[#cebdff] font-medium transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort: {sortBy === 'deadline' ? 'Closing Soon' : 'High Volume'}</span>
            </button>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#9496a1]">
            <div>
              Showing <span className="text-white font-semibold">{filteredCampaigns.length}</span> active opportunities
            </div>
            {filteredCampaigns.length === 0 && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedSource('All');
                  setSelectedPayout('All');
                }}
                className="text-[#cebdff] hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredCampaigns.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#111318] border border-dashed border-[#2d2f39] space-y-3">
              <Compass className="w-10 h-10 text-[#9496a1] mx-auto opacity-40" />
              <div className="text-white font-semibold text-sm">No campaigns match your filters</div>
              <p className="text-xs text-[#9496a1] max-w-md mx-auto">
                Try widening your category or payout model criteria, or import a direct campaign link.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="rounded-2xl bg-[#111318] border border-[#2d2f39] hover:border-[#cebdff]/40 transition-all duration-200 p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1e2029] text-[#cebdff] border border-[#2d2f39]">
                            {camp.source}
                          </span>
                          <span className="text-[11px] text-[#9496a1]">{camp.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-[#cebdff] transition-colors leading-snug">
                          {camp.title}
                        </h4>
                        <div className="text-xs text-[#9496a1]">
                          by <span className="text-white font-medium">{camp.brand}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleSave(camp.id, e)}
                        className="p-1.5 rounded-lg bg-[#161821] hover:bg-[#1e2029] text-[#9496a1] hover:text-white border border-[#2d2f39] transition-colors"
                      >
                        {savedIds.has(camp.id) ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-[#4edea3]" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[#9496a1] line-clamp-2 leading-relaxed">
                      {camp.description}
                    </p>

                    <div className="space-y-1.5 py-2 border-y border-[#2d2f39]/40 text-[11px]">
                      <div className="flex items-center justify-between text-[#9496a1]">
                        <span>Format / Aspect:</span>
                        <span className="text-white font-mono">{camp.aspectRatio}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#9496a1]">
                        <span>Difficulty:</span>
                        <span className="text-[#cebdff] font-medium">{camp.difficulty}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#9496a1]">
                        <span>Est. Total Pool:</span>
                        <span className="text-white font-mono">{camp.estPool}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Compensation</div>
                      <div className="text-sm font-extrabold text-[#4edea3] font-mono">{camp.rate}</div>
                    </div>

                    <Link
                      href={`/campaigns/${camp.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#cebdff] text-white hover:text-[#111318] text-xs font-semibold transition-all border border-[#2d2f39] flex items-center gap-1"
                    >
                      <span>Brief</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer info bar */}
      <footer className="mt-auto border-t border-[#2d2f39]/50 py-4 px-6 text-center text-xs text-[#9496a1]">
        ClipFlow Studio • Automated Creator Opportunity Aggregator • Connected to Content Rewards API & Whop Gateway
      </footer>
    </div>
  );
}
