'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  Film,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MilestoneItem {
  day: string;
  title: string;
  type: string;
  time: string;
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState('November 2026');
  // Real empty state: starts with 0 scheduled deadlines until user attaches projects
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-headline">Production Schedule & Deadlines</h1>
            <p className="text-xs text-[#a1a1aa] mt-1">Calendar tracking for escrow submission windows and sponsor cutoffs.</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white px-2">{currentMonth}</span>
            <button className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {milestones.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <CalendarIcon className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No scheduled deadlines</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              When you start cutting projects with target completion dates, they will automatically populate on your calendar.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Real milestones */}
          </div>
        )}
      </main>
    </div>
  );
}
