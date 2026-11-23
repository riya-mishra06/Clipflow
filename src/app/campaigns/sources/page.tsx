'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  KeyRound,
  Radio
} from 'lucide-react';

interface AdapterSource {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'degraded' | 'syncing';
  latencyMs: number;
  lastSync: string;
  activeCampaigns: number;
  autoSyncInterval: string;
  authMethod: 'OAuth 2.0 Token' | 'Webhook Push' | 'REST Poller';
}

const SOURCES_DATA: AdapterSource[] = [
  {
    id: 'src-cr',
    name: 'Content Rewards Aggregator',
    category: 'Direct Creator Network',
    status: 'operational',
    latencyMs: 142,
    lastSync: '2 minutes ago',
    activeCampaigns: 24,
    autoSyncInterval: 'Every 15 min',
    authMethod: 'OAuth 2.0 Token',
  },
  {
    id: 'src-whop',
    name: 'Whop Bounty Gateway',
    category: 'Marketplace Stems',
    status: 'operational',
    latencyMs: 198,
    lastSync: '6 minutes ago',
    activeCampaigns: 18,
    autoSyncInterval: 'Every 30 min',
    authMethod: 'OAuth 2.0 Token',
  },
  {
    id: 'src-tiktok',
    name: 'TikTok Pulse Creator Bridge',
    category: 'Social Ingest',
    status: 'syncing',
    latencyMs: 310,
    lastSync: 'Just now',
    activeCampaigns: 9,
    autoSyncInterval: 'Every 60 min',
    authMethod: 'Webhook Push',
  },
  {
    id: 'src-manual',
    name: 'ClipFlow Private Ingest Feed',
    category: 'Custom Brand CRM',
    status: 'operational',
    latencyMs: 45,
    lastSync: 'Continuous',
    activeCampaigns: 14,
    autoSyncInterval: 'Real-time',
    authMethod: 'REST Poller',
  },
];

export default function CampaignSourcesPage() {
  const [sources, setSources] = useState<AdapterSource[]>(SOURCES_DATA);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Header */}
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
              <span className="text-xs font-semibold text-[#cebdff]">Ingest Diagnostics</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Campaign Source Status</h1>
          </div>
        </div>

        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] hover:text-white text-xs font-semibold border border-[#2d2f39] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Checking...' : 'Ping All Adapters'}</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#9496a1]">
              <span>Active Feed Sources</span>
              <Radio className="w-4 h-4 text-[#4edea3]" />
            </div>
            <div className="text-2xl font-bold text-white font-headline">4 / 4 Online</div>
            <div className="text-[11px] text-[#4edea3] font-medium">99.98% ingestion uptime</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#9496a1]">
              <span>Synchronized Bounties</span>
              <Zap className="w-4 h-4 text-[#cebdff]" />
            </div>
            <div className="text-2xl font-bold text-white font-headline">65 Briefs</div>
            <div className="text-[11px] text-[#cebdff] font-medium">+12 incoming today</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-1">
            <div className="flex items-center justify-between text-xs text-[#9496a1]">
              <span>Average API Latency</span>
              <Activity className="w-4 h-4 text-[#cebdff]" />
            </div>
            <div className="text-2xl font-bold text-white font-headline font-mono">173 ms</div>
            <div className="text-[11px] text-[#9496a1]">Within optimal threshold</div>
          </div>
        </div>

        {/* Adapters Directory */}
        <div className="rounded-2xl bg-[#111318] border border-[#2d2f39] overflow-hidden">
          <div className="p-5 border-b border-[#2d2f39] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-headline">Connected Ingest Adapters</h2>
              <p className="text-xs text-[#9496a1] mt-0.5">
                Real-time scraping endpoints and external API sync agents.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#2d2f39]">
            {sources.map((src) => (
              <div key={src.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{src.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        src.status === 'operational'
                          ? 'bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20'
                          : 'bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          src.status === 'operational' ? 'bg-[#4edea3]' : 'bg-[#ffb4ab]'
                        }`}
                      />
                      <span className="capitalize">{src.status}</span>
                    </span>
                  </div>

                  <div className="text-xs text-[#9496a1] flex items-center gap-3">
                    <span>{src.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-[#cebdff]" />
                      <span>{src.authMethod}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-xs text-right">
                  <div>
                    <div className="text-[#9496a1] text-[10px] uppercase font-semibold">Latency</div>
                    <div className="text-white font-mono font-medium">{src.latencyMs} ms</div>
                  </div>

                  <div>
                    <div className="text-[#9496a1] text-[10px] uppercase font-semibold">Active Cuts</div>
                    <div className="text-[#cebdff] font-bold">{src.activeCampaigns} active</div>
                  </div>

                  <div>
                    <div className="text-[#9496a1] text-[10px] uppercase font-semibold">Last Ingest</div>
                    <div className="text-[#9496a1]">{src.lastSync}</div>
                  </div>

                  <button className="px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] hover:text-white text-xs font-medium border border-[#2d2f39] transition-colors">
                    Re-sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Webhook info */}
        <div className="p-4 rounded-xl bg-[#161821] border border-[#2d2f39] flex items-center justify-between text-xs text-[#9496a1]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
            <span>All incoming payload signatures verified with HMAC-SHA256 tokens.</span>
          </div>
          <Link href="/settings" className="text-[#cebdff] hover:underline">
            Manage Ingest Keys →
          </Link>
        </div>
      </main>
    </div>
  );
}
