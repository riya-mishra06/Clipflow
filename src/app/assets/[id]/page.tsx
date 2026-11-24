'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Share2,
  Trash2,
  Volume2,
  Film,
  Music,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = (params?.id as string) || 'ast-01';

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-[white/[0.08]]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/assets"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#cebdff]/20 text-[#cebdff]">
                Asset Inspector
              </span>
              <span className="text-xs text-[#9496a1] font-mono">{assetId}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              neonpulse_synth_broll_raw.mp4
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-xs font-medium text-[#9496a1] hover:text-white transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] font-bold text-xs transition-all shadow-md shadow-[#cebdff]/10">
            <Download className="w-3.5 h-3.5" />
            <span>Download Master (842 MB)</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Viewport (65% Preview & Waveform / 35% Metadata & Technical Specs) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Media Player & Waveform Inspector */}
        <div className="lg:col-span-8 space-y-6">
          {/* Media Player Frame */}
          <div className="rounded-2xl bg-[#09090b] border border-[white/[0.08]] overflow-hidden flex flex-col items-center justify-center p-6 relative group">
            <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#161821] to-[#121215] border border-[white/[0.08]] relative flex flex-col justify-between p-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
                alt="Video Asset Frame"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />

              <div className="z-10 flex justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/70 text-white font-mono">
                  1080x1920 (9:16 Ingested)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-bold">
                  60.00 FPS Locked
                </span>
              </div>

              {/* Center Play Button */}
              <div className="z-10 flex justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#cebdff] text-[#121215] flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              <div className="z-10 flex justify-between items-center text-xs text-white font-mono">
                <span>00:14.20 / 02:45.00</span>
                <span>ProRes 422 HQ</span>
              </div>
            </div>

            {/* Audio Waveform Track */}
            <div className="w-full mt-4 p-4 rounded-xl bg-[#121215] border border-[white/[0.08]] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#9496a1]">
                <span className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px]">
                  <Volume2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>Integrated Audio Waveform (-14.2 LUFS)</span>
                </span>
                <span className="font-mono text-[10px]">Stereo 48kHz</span>
              </div>

              {/* Simulated Waveform SVG */}
              <svg className="w-full h-10 text-[#cebdff]" preserveAspectRatio="none" viewBox="0 0 100 25">
                <path
                  d="M0,12 Q3,1 6,12 T12,12 T18,3 T24,22 T30,7 T36,19 T42,9 T48,16 T54,5 T60,20 T66,8 T72,17 T78,11 T84,21 T90,4 T96,12 T100,12"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Linked Projects Strip */}
          <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
              Active Project Timeline Attachments
            </h3>

            <div className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">NeonPulse AI Glitch Cuts Pack</div>
                <div className="text-[11px] text-[#9496a1]">Timeline Track: V1 (Scene 01 - 03)</div>
              </div>

              <Link
                href="/projects/proj-01"
                className="px-3 py-1.5 rounded-lg bg-[white/[0.04]] hover:bg-[white/[0.08]] text-[#cebdff] text-xs font-semibold border border-[white/[0.08]] flex items-center gap-1"
              >
                <span>Open in Studio</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detailed Metadata Specs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
              Technical Specifications
            </h3>

            <div className="space-y-3 text-xs divide-y divide-[white/[0.08]]/50">
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Container & Codec:</span>
                <span className="text-white font-mono font-medium">MP4 / ProRes 422</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Resolution:</span>
                <span className="text-white font-mono font-medium">1080 x 1920 (9:16)</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Frame Rate:</span>
                <span className="text-[#4edea3] font-mono font-medium">60.00 fps</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Total Duration:</span>
                <span className="text-white font-mono font-medium">02:45.00</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Raw File Size:</span>
                <span className="text-white font-mono font-medium">842.6 MB</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Color Space:</span>
                <span className="text-white font-mono font-medium">Rec.709 10-bit</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#9496a1]">Audio Bitrate:</span>
                <span className="text-white font-mono font-medium">1536 kbps Linear PCM</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[white/[0.08]]">
              <span className="text-xs font-semibold text-white block mb-2">Metadata Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {['#RawFootage', '#FastPaced', '#NeonPulse', '#60fps', '#B-Roll'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[white/[0.04]] text-[#cebdff] border border-[white/[0.08]]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
