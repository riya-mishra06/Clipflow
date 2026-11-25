'use client';

import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Youtube,
  Share2,
  Plus,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Radio,
  RefreshCw
} from 'lucide-react';

interface ChannelAccount {
  _id: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  category: 'clipping' | 'ugc' | 'brand' | 'personal';
  accountName: string;
  channelOrPageId?: string;
  status: 'connected' | 'expired' | 'revoked';
  settings?: {
    autoPublishEnabled: boolean;
  };
  stats?: {
    subscribers?: string;
    totalViews?: string;
    videoCount?: string;
    lastSyncedAt?: string;
  };
  createdAt: string;
}

export default function SocialChannelsPage() {
  const [channels, setChannels] = useState<ChannelAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncBanner, setSyncBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Connect Modal
  const [showModal, setShowModal] = useState(false);
  const [platform, setPlatform] = useState<'instagram' | 'youtube' | 'tiktok'>('youtube');
  const [category, setCategory] = useState<'clipping' | 'ugc' | 'brand' | 'personal'>('clipping');
  const [accountName, setAccountName] = useState('');
  const [channelOrPageId, setChannelOrPageId] = useState('');
  const [autoPublishEnabled, setAutoPublishEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Disconnect Modal
  const [disconnectTarget, setDisconnectTarget] = useState<ChannelAccount | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    async function loadChannels() {
      setLoading(true);
      try {
        const res = await fetch('/api/channels', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setChannels(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load channels:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          category,
          accountName: accountName.trim(),
          channelOrPageId: channelOrPageId.trim(),
          autoPublishEnabled,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to connect channel');
      }

      setChannels((prev) => [json.data, ...prev]);
      setShowModal(false);
      setAccountName('');
      setChannelOrPageId('');
      setAutoPublishEnabled(false);
    } catch (err: any) {
      setFormError(err.message || 'Connection failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSyncStats = async (ch: ChannelAccount) => {
    setSyncingId(ch._id);
    setSyncBanner(null);
    try {
      const res = await fetch('/api/channels/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: ch._id }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Sync failed');
      }

      setChannels((prev) =>
        prev.map((item) => (item._id === ch._id ? json.data : item))
      );
      setSyncBanner({
        type: 'success',
        text: `Synced live stats for ${ch.accountName} from YouTube Data API!`,
      });
    } catch (err: any) {
      setSyncBanner({
        type: 'error',
        text: err.message || 'Failed to sync stats',
      });
    } finally {
      setSyncingId(null);
    }
  };

  const toggleAutoPublish = async (ch: ChannelAccount) => {
    const nextVal = !(ch.settings?.autoPublishEnabled ?? false);
    try {
      const res = await fetch(`/api/channels/${ch._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPublishEnabled: nextVal }),
      });
      if (res.ok) {
        const json = await res.json();
        setChannels((prev) =>
          prev.map((item) => (item._id === ch._id ? json.data : item))
        );
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const confirmDisconnect = async () => {
    if (!disconnectTarget) return;
    setDisconnecting(true);
    try {
      const res = await fetch(`/api/channels/${disconnectTarget._id}`, { method: 'DELETE' });
      if (res.ok) {
        setChannels((prev) => prev.filter((item) => item._id !== disconnectTarget._id));
        setDisconnectTarget(null);
      }
    } catch (err) {
      console.error('Disconnect failed:', err);
    } finally {
      setDisconnecting(false);
    }
  };

  const getPlatformBadge = (p: ChannelAccount['platform']) => {
    switch (p) {
      case 'youtube':
        return (
          <div className="w-9 h-9 rounded-lg bg-red-500/15 border border-red-500/25 text-red-400 flex items-center justify-center shrink-0">
            <Youtube className="w-4 h-4" />
          </div>
        );
      case 'instagram':
        return (
          <div className="w-9 h-9 rounded-lg bg-pink-500/15 border border-pink-500/25 text-pink-400 flex items-center justify-center shrink-0">
            <Instagram className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Connected Creator Channels
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Link YouTube, Instagram, and TikTok channels and sync live YouTube Data API v3 channel metrics.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Account</span>
          </button>
        </div>

        {syncBanner && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              syncBanner.type === 'success'
                ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981]'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}
          >
            {syncBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{syncBanner.text}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">Loading Connected Channels...</div>
          </div>
        ) : channels.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Share2 className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No social accounts connected</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Connect your YouTube (@handle or UC... ID), Instagram, or TikTok channel to sync views and manage publishing targets.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Connect Account</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div
                key={ch._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {getPlatformBadge(ch.platform)}
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{ch.accountName}</h3>
                        <div className="text-[11px] text-[#71717a] font-mono uppercase">
                          {ch.platform} • {ch.category}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDisconnectTarget(ch)}
                      title="Disconnect channel"
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-[#a1a1aa] hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {ch.channelOrPageId && (
                    <div className="text-[11px] text-[#a1a1aa] bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1.5 font-mono truncate">
                      ID: {ch.channelOrPageId}
                    </div>
                  )}

                  {ch.stats?.subscribers && (
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#09090b] border border-white/[0.06] text-center">
                      <div>
                        <div className="text-[9px] text-[#71717a] uppercase font-mono">Subs</div>
                        <div className="text-xs font-bold text-white font-mono">{ch.stats.subscribers}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#71717a] uppercase font-mono">Views</div>
                        <div className="text-xs font-bold text-[#10b981] font-mono">{ch.stats.totalViews}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#71717a] uppercase font-mono">Videos</div>
                        <div className="text-xs font-bold text-white font-mono">{ch.stats.videoCount}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs">
                  {ch.platform === 'youtube' ? (
                    <button
                      onClick={() => handleSyncStats(ch)}
                      disabled={syncingId === ch._id}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white text-[11px] font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${syncingId === ch._id ? 'animate-spin' : ''}`} />
                      <span>{syncingId === ch._id ? 'Syncing...' : 'Sync Stats'}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#10b981] font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="capitalize">{ch.status}</span>
                    </span>
                  )}

                  <button
                    onClick={() => toggleAutoPublish(ch)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                      ch.settings?.autoPublishEnabled
                        ? 'bg-[#6366f1]/20 border-[#6366f1]/40 text-[#818cf8]'
                        : 'bg-white/[0.03] border-white/[0.08] text-[#71717a] hover:text-white'
                    }`}
                  >
                    Auto-Publish: {ch.settings?.autoPublishEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Connect Channel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">Connect Creator Channel</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['youtube', 'instagram', 'tiktok'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`py-2 rounded-xl border text-xs font-semibold capitalize transition-colors ${
                        platform === p
                          ? 'bg-[#6366f1]/20 border-[#6366f1] text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#71717a] hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Channel Handle / Name *</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. @mkbhd or @clipflow.edits"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Account Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="clipping">Clipping</option>
                    <option value="ugc">UGC</option>
                    <option value="brand">Brand</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Channel ID (Optional)</label>
                  <input
                    type="text"
                    value={channelOrPageId}
                    onChange={(e) => setChannelOrPageId(e.target.value)}
                    placeholder="UC_xyz123"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#09090b] border border-white/[0.08] text-xs cursor-pointer">
                <span className="text-[#e4e4e7]">Enable Auto-Publish when approved</span>
                <input
                  type="checkbox"
                  checked={autoPublishEnabled}
                  onChange={(e) => setAutoPublishEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#6366f1]"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Connecting...' : 'Connect Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disconnect Modal */}
      {disconnectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-headline">Disconnect channel?</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Are you sure you want to disconnect <span className="text-white font-semibold">{disconnectTarget.accountName}</span>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={disconnecting}
                onClick={() => setDisconnectTarget(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={disconnecting}
                onClick={confirmDisconnect}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                {disconnecting ? 'Disconnecting...' : 'Yes, Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
