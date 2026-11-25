'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowUpRight,
  Loader2,
  Folder,
  Compass
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  kind: 'project' | 'campaign';
  title: string;
  subtitle: string;
  dueDate: string;
  daysLeft: number;
  urgency: 'urgent' | 'soon' | 'upcoming';
  href: string;
}

export default function CalendarPage() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'project' | 'campaign'>('all');

  const currentMonthLabel = new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      try {
        const res = await fetch('/api/calendar', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setMilestones(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load calendar:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return milestones;
    return milestones.filter((m) => m.kind === filter);
  }, [milestones, filter]);

  const getUrgencyBadge = (item: MilestoneItem) => {
    if (item.urgency === 'urgent') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30 font-mono">
          Urgent • {item.daysLeft}d left
        </span>
      );
    }
    if (item.urgency === 'soon') {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 font-mono">
          Due Soon • {item.daysLeft}d left
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30 font-mono">
        {item.daysLeft}d left
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-headline">
              Production Schedule & Deadlines
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Chronological tracking for your active project cutoffs and open bounty submission windows.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-xs font-mono text-white self-start sm:self-auto">
            <CalendarIcon className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>{currentMonthLabel}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-2.5 rounded-xl bg-[#121215] border border-white/[0.08] flex items-center gap-2">
          {(
            [
              { id: 'all', label: 'All Deadlines' },
              { id: 'project', label: 'My Projects' },
              { id: 'campaign', label: 'Open Bounties' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                  : 'text-[#71717a] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">Syncing Production Schedule...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <CalendarIcon className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No scheduled deadlines</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              When you start cutting projects or import campaigns, their deadlines will automatically populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const dateObj = new Date(item.dueDate);
              const monthShort = dateObj.toLocaleDateString('en-US', { month: 'short' });
              const dayNum = dateObj.getDate();

              return (
                <Link
                  key={`${item.kind}-${item.id}`}
                  href={item.href}
                  className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group block"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Date Box */}
                    <div className="w-12 h-12 rounded-xl bg-[#09090b] border border-white/[0.08] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono uppercase text-[#818cf8] font-bold leading-none">
                        {monthShort}
                      </span>
                      <span className="text-base font-extrabold text-white font-mono mt-0.5 leading-none">
                        {dayNum}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-[#a1a1aa] border border-white/[0.06]">
                          {item.kind === 'project' ? (
                            <Folder className="w-3 h-3 text-[#10b981]" />
                          ) : (
                            <Compass className="w-3 h-3 text-[#818cf8]" />
                          )}
                          <span>{item.kind}</span>
                        </span>
                        {getUrgencyBadge(item)}
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-[#818cf8] transition-colors truncate">
                        {item.title}
                      </h3>
                      <div className="text-xs text-[#71717a] truncate">{item.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#a1a1aa] group-hover:text-white shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                    <span>{dateObj.toLocaleDateString()}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
