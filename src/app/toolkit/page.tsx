'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Film,
  Volume2,
  Maximize2,
  Calculator,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function EditingToolkitPage() {
  // Tool 1: Aspect Ratio Calculator
  const [sourceWidth, setSourceWidth] = useState(3840);
  const [sourceHeight, setSourceHeight] = useState(2160);
  const target916Width = Math.round((sourceHeight * 9) / 16);

  // Tool 2: Audio Loudness LUFS target
  const [currentLufs, setCurrentLufs] = useState(-18.5);
  const lufsDifference = (-14.0 - currentLufs).toFixed(1);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Creator Editing Toolkit
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
            Real-time calculation utilities for vertical crop aspect ratios, audio LUFS normalization, and platform safe-zones.
          </p>
        </div>

        {/* 2 Utility Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1: 9:16 Crop Calculator */}
          <div className="p-6 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-[#818cf8]" />
              <span>9:16 Vertical Crop Resolution</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#a1a1aa] block mb-1">Source Footage Height (Pixels)</label>
                <input
                  type="number"
                  value={sourceHeight}
                  onChange={(e) => setSourceHeight(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-white/[0.06] space-y-1">
                <div className="text-[10px] text-[#71717a] uppercase font-bold">Optimal 9:16 Crop Window</div>
                <div className="text-lg font-mono font-bold text-[#10b981]">
                  {target916Width} x {sourceHeight} px
                </div>
                <p className="text-[11px] text-[#71717a]">
                  Crop horizontally from center (X offset: {Math.round((sourceWidth - target916Width) / 2)}px).
                </p>
              </div>
            </div>
          </div>

          {/* Tool 2: Audio LUFS Normalizer */}
          <div className="p-6 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-[#10b981]" />
              <span>Social Audio Loudness (LUFS)</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#a1a1aa] block mb-1">Current Master Audio (LUFS)</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentLufs}
                  onChange={(e) => setCurrentLufs(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-[#0c0c0e] border border-white/[0.06] space-y-1">
                <div className="text-[10px] text-[#71717a] uppercase font-bold">Recommended Gain Adjustment</div>
                <div className="text-lg font-mono font-bold text-[#818cf8]">
                  {Number(lufsDifference) > 0 ? `+${lufsDifference} dB` : `${lufsDifference} dB`}
                </div>
                <p className="text-[11px] text-[#71717a]">
                  Target standard for Reels & TikTok is <span className="text-white font-bold">-14.0 LUFS</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
