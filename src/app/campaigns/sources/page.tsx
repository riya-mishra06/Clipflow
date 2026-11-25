'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  Upload
} from 'lucide-react';

interface AdapterSource {
  _id: string;
  name: string;
  provider: 'whop' | 'content_rewards' | 'cuelinks' | 'youtube' | 'custom_json';
  feedUrl?: string;
  status: 'operational' | 'idle' | 'error';
  lastSyncedAt?: string;
  syncedCount: number;
  lastError?: string;
}

const SAMPLE_JSON = `[
  {
    "externalId": "whop-101",
    "title": "Myntra Summer Fashion Haul Reels",
    "brand": "Myntra Affiliate",
    "category": "Lifestyle & Fitness",
    "baseRate": 85,
    "aspectRatio": "9:16",
    "tags": ["fashion", "myntra", "ugc"]
  }
]`;

export default function CampaignSourcesPage() {
  const [sources, setSources] = useState<AdapterSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Source Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<AdapterSource['provider']>('cuelinks');
  const [feedUrl, setFeedUrl] = useState('');
  const [creating, setCreating] = useState(false);

  // Bulk JSON Import / Sync Modal
  const [syncModalSource, setSyncModalSource] = useState<AdapterSource | null>(null);
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);

  useEffect(() => {
    async function loadSources() {
      setLoading(true);
      try {
        const res = await fetch('/api/campaigns/sources', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSources(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load sources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setBanner(null);

    try {
      const res = await fetch('/api/campaigns/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), provider, feedUrl: feedUrl.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add source');

      setSources((prev) => [json.data, ...prev]);
      setShowAddModal(false);
      setName('');
      setFeedUrl('');
    } catch (err: any) {
      setBanner({ type: 'error', text: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleSyncUrl = async (source: AdapterSource) => {
    if (!source.feedUrl) {
      setSyncModalSource(source);
      return;
    }

    setSyncingId(source._id);
    setBanner(null);
    try {
      const res = await fetch('/api/campaigns/sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: source._id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Sync failed');

      setSources((prev) =>
        prev.map((s) => (s._id === source._id ? json.source : s))
      );
      setBanner({
        type: 'success',
        text: `Synced ${source.name}: ${json.result.inserted} new, ${json.result.updated} updated (duplicate-free)!`,
      });
    } catch (err: any) {
      setBanner({ type: 'error', text: err.message });
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncJsonPayload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncModalSource) return;

    setSyncingId(syncModalSource._id);
    setBanner(null);
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('JSON must be an array of campaign objects');
      }

      const res = await fetch('/api/campaigns/sources/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: syncModalSource._id, rawItems: parsed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Import failed');

      setSources((prev) =>
        prev.map((s) => (s._id === syncModalSource._id ? json.source : s))
      );
      setSyncModalSource(null);
      setBanner({
        type: 'success',
        text: `Upserted via ${syncModalSource.name}: ${json.result.inserted} new, ${json.result.updated} updated!`,
      });
    } catch (err: any) {
      setBanner({ type: 'error', text: err.message || 'Invalid JSON format' });
    } finally {
      setSyncingId(null);
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/sources?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSources((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error('Delete source failed:', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#818cf8]">Multi-Source Adapter Engine</span>
            <h1 className="text-base font-bold text-white tracking-tight">Ingest Sources & Upsert Sync</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Source</span>
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-6">
        {banner && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              banner.type === 'success'
                ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981]'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}
          >
            {banner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{banner.text}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <span className="text-xs text-[#71717a] font-mono">Loading Ingest Sources...</span>
          </div>
        ) : sources.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Layers className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No ingest sources configured</div>
            <p className="text-xs text-[#71717a] max-w-md mx-auto leading-relaxed">
              Add a source adapter (Whop, Content Rewards, Cuelinks Affiliate, or Custom JSON Feed) to normalize and upsert external campaigns without duplicates.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Adapter Source</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-[#a1a1aa] border border-white/[0.08]">
                          {src.provider.replace(/_/g, ' ')}
                        </span>
                        {src.status === 'error' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-mono">
                            <AlertTriangle className="w-3 h-3" /> Error
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#10b981] font-mono">
                            <CheckCircle2 className="w-3 h-3" /> {src.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1.5">{src.name}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteSource(src._id)}
                      title="Delete source"
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-[#71717a] hover:text-red-400 border border-white/[0.08]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {src.feedUrl && (
                    <div className="text-[11px] text-[#71717a] font-mono truncate bg-white/[0.02] px-2.5 py-1.5 rounded-lg border border-white/[0.05]">
                      Feed: {src.feedUrl}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#71717a] pt-2 border-t border-white/[0.06]">
                    <span>Imported: <strong className="text-white font-mono">{src.syncedCount}</strong></span>
                    <span className="font-mono">
                      {src.lastSyncedAt ? `Synced ${new Date(src.lastSyncedAt).toLocaleDateString()}` : 'Never synced'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSyncModalSource(src)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white border border-white/[0.08] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#818cf8]" />
                    <span>Import JSON</span>
                  </button>

                  {src.feedUrl && (
                    <button
                      onClick={() => handleSyncUrl(src)}
                      disabled={syncingId === src._id}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === src._id ? 'animate-spin' : ''}`} />
                      <span>{syncingId === src._id ? 'Syncing...' : 'Sync Feed URL'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">Add Ingest Source</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#71717a] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Source Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cuelinks Myntra UGC Feed"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Adapter Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="cuelinks">Cuelinks Affiliate (Myntra / Fashion)</option>
                  <option value="whop">Whop Bounty Gateway</option>
                  <option value="content_rewards">Content Rewards</option>
                  <option value="youtube">YouTube Data API</option>
                  <option value="custom_json">Custom JSON Feed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">JSON Feed Endpoint URL (Optional)</label>
                <input
                  type="url"
                  value={feedUrl}
                  onChange={(e) => setFeedUrl(e.target.value)}
                  placeholder="https://api.example.com/campaigns.json"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] text-xs font-semibold text-[#a1a1aa] border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import JSON Payload Modal */}
      {syncModalSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">
                Upsert Campaigns via {syncModalSource.name}
              </h3>
              <button onClick={() => setSyncModalSource(null)} className="text-[#71717a] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#a1a1aa]">
              Paste external JSON items below. Our adapter normalizes them and upserts into MongoDB without creating duplicates.
            </p>

            <form onSubmit={handleSyncJsonPayload} className="space-y-4">
              <textarea
                rows={9}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#6366f1]"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSyncModalSource(null)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] text-xs font-semibold text-[#a1a1aa] border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={syncingId === syncModalSource._id}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white disabled:opacity-50"
                >
                  {syncingId === syncModalSource._id ? 'Upserting...' : 'Run Adapter & Upsert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
