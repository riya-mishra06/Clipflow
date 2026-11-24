'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Play,
  Share2,
  ExternalLink,
  Search,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface ViralReference {
  id: string;
  title: string;
  creator: string;
  views: string;
  retentionPercent: string;
  hookTechnique: string;
  breakdown: string;
  thumbnailUrl: string;
}

const REFERENCES: ViralReference[] = [
  {
    id: 'ref-01',
    title: 'The Reverse Zoom Speed-Ramp Loop',
    creator: '@fintech.viral',
    views: '2.4M Views',
    retentionPercent: '86% through 0:03',
    hookTechnique: 'Visual Pattern Interrupt + Instant Hook',
    breakdown: 'Opens with a 0.8s backward speed ramp that makes the viewer stop scrolling. Subtitles animate at 150ms per word.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ref-02',
    title: 'The Curiosity Gap Price Challenge',
    creator: '@gadget.breakdowns',
    views: '1.8M Views',
    retentionPercent: '81% through 0:03',
    hookTechnique: 'Psychological Tension Hook',
    breakdown: 'Shows product being smashed in first 0.5s with "This $1,000 SSD survived..." text placed exactly within safe zones.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
];

export default function ReferenceLibraryPage() {
  const [search, setSearch] = useState('');

  const filtered = REFERENCES.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.hookTechnique.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Viral Reference Library
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
            Frame-by-frame breakdowns of top-performing vertical shorts with retention metrics and hook analysis.
          </p>
        </div>

        {/* References Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((ref) => (
            <div
              key={ref.id}
              className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video bg-[#0c0c0e] overflow-hidden">
                  <img
                    src={ref.thumbnailUrl}
                    alt={ref.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[#10b981] font-mono text-[10px] font-bold">
                    {ref.views}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-xs">
                    {ref.retentionPercent}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-white">{ref.title}</h3>
                  <div className="text-xs text-[#71717a]">
                    Creator: <span className="text-[#a1a1aa]">{ref.creator}</span> • Technique: <span className="text-[#818cf8]">{ref.hookTechnique}</span>
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed pt-1">
                    {ref.breakdown}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <Link
                  href="/projects/new"
                  className="text-xs text-[#818cf8] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Use this Hook Template in Project</span>
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
