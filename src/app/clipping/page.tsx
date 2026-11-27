'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Scissors,
  Plus,
  Film,
  Loader2,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Info,
} from 'lucide-react';
import UniversalInput from '@/components/UniversalInput';
import { UniversalInputItem } from '@/lib/inputDetector';

interface ClippingSessionSummary {
  _id: string;
  title: string;
  sourceAssetId: string;
  sourceMetadata?: { durationSec?: number; width?: number; height?: number };
  clips: Array<{ id: string; status: string }>;
  createdAt: string;
}

export default function ClippingStudioHubPage() {
  const router = useRouter();

  const [sessions, setSessions] = useState<ClippingSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  // UniversalInput items — the first video-kind item with assetId is the source video
  const [inputItems, setInputItems] = useState<UniversalInputItem[]>([]);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteSession = async (id: string, sessionTitle: string) => {
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/clipping/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || `Failed to remove "${sessionTitle}"`);
      setSessions((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to remove clipping project');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const sessRes = await fetch('/api/clipping', { cache: 'no-store' });
        if (sessRes.ok) {
          const sj = await sessRes.json();
          setSessions(sj.data || []);
        }
      } catch (err) {
        console.error('Failed to load Clipping Studio:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /** Find the first ready video input item that has been uploaded (assetId present) */
  const primaryVideoItem = inputItems.find(
    (it) =>
      it.kind === 'video' &&
      it.assetId &&
      (it.status === 'ready' || it.status === 'reference_only')
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError('Please enter a clipping project title.');
      return;
    }
    if (!primaryVideoItem) {
      setError('Please upload a video file or select an existing video asset as your source.');
      return;
    }

    setCreating(true);
    try {
      const sourceAssetId = primaryVideoItem.assetId!;

      // Supporting references (images, docs, audio, subtitles) — not the primary video
      const supportingAssetIds = inputItems
        .filter(
          (it) =>
            it.assetId &&
            it.id !== primaryVideoItem.id &&
            it.status === 'ready' &&
            ['image', 'document', 'audio', 'subtitle'].includes(it.kind)
        )
        .map((it) => it.assetId!);

      const res = await fetch('/api/clipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), sourceAssetId, supportingAssetIds }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create clipping project');
      router.push(`/clipping/${json.data._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start clipping project');
      setCreating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-1">
            <Scissors className="w-3.5 h-3.5" />
            <span>Local FFmpeg + faster-whisper</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            AI Clipping Studio
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Upload or pick a source video, transcribe locally, select multiple timestamps, and render 1080×1920 vertical clips.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── New Project Form ── */}
          <form
            onSubmit={handleCreate}
            className="lg:col-span-5 p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-5 h-fit"
          >
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#6366f1]" />
              <span>New Clipping Project</span>
            </h2>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#a1a1aa]">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Podcast Episode 42 Clips"
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            {/* Universal Input for source video + supporting references */}
            <div className="space-y-1.5">
              <UniversalInput
                items={inputItems}
                onChange={setInputItems}
                multiple={true}
                title="Source Video + Supporting References"
              />
              <p className="text-[11px] text-[#52525b] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#6366f1]" />
                The first uploaded video becomes the source. Images, PDFs, and audio files are attached as supporting references for AI analysis.
              </p>
            </div>

            {/* Primary video status pill */}
            {primaryVideoItem && (
              <div className="flex items-center gap-2 text-xs text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Source: <span className="font-semibold">{primaryVideoItem.label}</span></span>
              </div>
            )}

            {/* Warning when no video selected yet */}
            {inputItems.length > 0 && !primaryVideoItem && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Upload is in progress or no video detected yet. Please add a video file.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={creating || !primaryVideoItem}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
              <span>{creating ? 'Initializing Studio...' : 'Open Clipping Studio'}</span>
            </button>
          </form>

          {/* ── Existing Projects ── */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold text-white">Your Clipping Projects</h2>
            {loading ? (
              <div className="p-10 rounded-2xl bg-[#121215] border border-white/[0.08] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#121215] border border-white/[0.08] text-center space-y-2">
                <Film className="w-8 h-8 text-[#52525b] mx-auto" />
                <div className="text-sm font-semibold text-white">No Clipping Projects Yet</div>
                <p className="text-xs text-[#71717a]">
                  Create your first clipping project on the left to start extracting 9:16 clips.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => {
                  const readyCount = (s.clips || []).filter((c) => c.status === 'ready').length;
                  return (
                    <div
                      key={s._id}
                      className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] hover:border-[#6366f1]/50 transition-colors flex items-center justify-between gap-4"
                    >
                      <Link href={`/clipping/${s._id}`} className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white truncate">{s.title}</div>
                        <div className="text-xs text-[#71717a] font-mono mt-1 flex items-center gap-3">
                          <span>
                            {s.sourceMetadata?.durationSec
                              ? `${s.sourceMetadata.durationSec.toFixed(1)}s`
                              : 'Source ready'}
                          </span>
                          <span>•</span>
                          <span>{s.clips?.length || 0} clips</span>
                          {readyCount > 0 && (
                            <span className="text-[#10b981] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {readyCount} ready
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(s._id, s.title)}
                          disabled={deletingId === s._id}
                          aria-label={`Remove ${s.title}`}
                          title="Remove project"
                          className="p-2 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                        >
                          {deletingId === s._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/clipping/${s._id}`}
                          aria-label={`Open ${s.title}`}
                          className="p-2 rounded-lg text-[#818cf8] hover:bg-[#6366f1]/10 transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
