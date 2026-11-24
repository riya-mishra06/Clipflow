'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Flame,
  Music,
  Share2,
  Film,
  ExternalLink,
  Search,
  Filter,
  BarChart2,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface TrendItem {
  id: string;
  name: string;
  platform: 'TikTok' | 'Instagram Reels' | 'YouTube Shorts';
  velocity: '+184% this week' | '+92% this week' | '+310% breakout';
  audioTrack: string;
  videoCategory: string;
  averageWatchTime: string;
  status: 'Surging' | 'Peak' | 'Early Momentum';
}

const TRENDS: TrendItem[] = [
  {
    id: 'tr-01',
    name: '0-to-1 Unexpected AI Morph Cut',
    platform: 'Instagram Reels',
    velocity: '+310% breakout',
    audioTrack: 'Synthwave_Bass_Drop_Transients.wav',
    videoCategory: 'Tech & AI',
    averageWatchTime: '88% Retention',
    status: 'Surging',
  },
  {
    id: 'tr-02',
    name: 'Lo-Fi Desk POV Speed Ramp',
    platform: 'TikTok',
    velocity: '+184% this week',
    audioTrack: 'Ambient_Chillhop_Binaural_Loop.wav',
    videoCategory: 'Lifestyle & Productivity',
    averageWatchTime: '82% Retention',
    status: 'Surging',
  },
  {
    id: 'tr-03',
    name: 'Clutch Round Split-Screen Reaction',
    platform: 'YouTube Shorts',
    velocity: '+92% this week',
    audioTrack: 'Apex_Bass_Hit_Sub_Drop.wav',
    videoCategory: 'Gaming',
    averageWatchTime: '79% Retention',
    status: 'Peak',
  },
];

export default function TrendDiscoveryPage() {
  const [platformFilter, setPlatformFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = TRENDS.filter((t) => {
    const matchPlatform = platformFilter === 'All' || t.platform === platformFilter;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.videoCategory.toLowerCase().includes(search.toLowerCase());
    return matchPlatform && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#10b981] font-semibold mb-2">
            <Flame className="w-4 h-4" />
            <span>Algorithm Momentum Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Viral Trend Discovery Radar
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
            Real-time viral audio tracks, pacing structures, and visual hooks gaining exponential velocity on short-form platforms.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['All', 'Instagram Reels', 'TikTok', 'YouTube Shorts'].map((p) => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  platformFilter === p
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Trends List */}
        <div className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981]">
                    {t.velocity}
                  </span>
                  <span className="text-xs text-[#71717a]">{t.platform} • {t.videoCategory}</span>
                </div>

                <h3 className="text-base font-bold text-white">{t.name}</h3>
                <div className="text-xs text-[#818cf8] font-mono flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Trending Audio: {t.audioTrack}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-[#71717a] uppercase font-bold">Watch Time Retention</div>
                  <div className="font-mono font-bold text-white text-sm">{t.averageWatchTime}</div>
                </div>

                <Link
                  href="/projects/new"
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Cut with this Trend</span>
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
