'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Film,
  Trash2,
  ExternalLink,
  Loader2,
  X,
  Send
} from 'lucide-react';

interface DraftExport {
  id: string;
  version: string;
  filename: string;
  videoUrl: string;
  notes?: string;
  status: 'Ready' | 'In Review' | 'Approved';
  createdAt: string;
}

export default function ProjectDraftsPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [projectTitle, setProjectTitle] = useState('Drafts & Renders');
  const [drafts, setDrafts] = useState<DraftExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Add Draft Modal
  const [showModal, setShowModal] = useState(false);
  const [version, setVersion] = useState('v1.0');
  const [filename, setFilename] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadDrafts() {
      if (!projectId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setProjectTitle(json.data.title || 'Drafts & Renders');
            setDrafts(json.data.drafts || []);
          }
        }
      } catch (err) {
        console.error('Failed to load project drafts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDrafts();
  }, [projectId]);

  const persistDrafts = async (nextDrafts: DraftExport[]) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drafts: nextDrafts }),
      });
      if (res.ok) {
        setDrafts(nextDrafts);
      }
    } catch (err) {
      console.error('Failed to save drafts:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim()) return;

    const newDraft: DraftExport = {
      id: `d-${Date.now()}`,
      version: version.trim() || `v${drafts.length + 1}.0`,
      filename: filename.trim(),
      videoUrl: videoUrl.trim(),
      notes: notes.trim(),
      status: 'Ready',
      createdAt: new Date().toISOString(),
    };

    const nextDrafts = [newDraft, ...drafts];
    await persistDrafts(nextDrafts);
    setShowModal(false);
    setVersion(`v${nextDrafts.length + 1}.0`);
    setFilename('');
    setVideoUrl('');
    setNotes('');
  };

  const handleDeleteDraft = async (id: string) => {
    const next = drafts.filter((d) => d.id !== id);
    await persistDrafts(next);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[#818cf8]">Export Vault</span>
            <h1 className="text-sm font-bold text-white tracking-tight truncate">{projectTitle}</h1>
          </div>
        </div>

        <button
          onClick={() => {
            setVersion(`v${drafts.length + 1}.0`);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-all shadow-sm shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Add Draft Export</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-headline">Exported Timeline Versions</h2>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Track versioned render exports, preview links, and deliver approved cuts to bounties.
            </p>
          </div>
          <div className="text-xs font-mono text-[#71717a]">
            {saving ? 'Syncing...' : `${drafts.length} Version(s)`}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <span className="text-xs text-[#71717a] font-mono">Loading Export Versions...</span>
          </div>
        ) : drafts.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Film className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No draft exports yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Log your rendered `.mp4` version or Drive/Frame.io preview link to keep track of every revision.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Log First Draft Export</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30 text-[10px] font-bold font-mono">
                      {d.version}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#10b981]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{d.status}</span>
                    </span>
                    <span className="text-xs text-[#71717a] font-mono">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white truncate">{d.filename}</div>
                  {d.notes && <p className="text-xs text-[#a1a1aa]">{d.notes}</p>}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {d.videoUrl && (
                    <a
                      href={d.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <Link
                    href={`/submissions?projectId=${projectId}`}
                    className="px-3 py-1.5 rounded-lg bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-[#818cf8] text-xs font-semibold border border-[#6366f1]/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteDraft(d.id)}
                    title="Delete draft"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-[#71717a] hover:text-red-400 border border-white/[0.08] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Draft Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">Log New Draft Export</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDraft} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Version</label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-white">Render Filename *</label>
                  <input
                    type="text"
                    required
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="Cut01_60fps_Master.mp4"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Preview Link (Optional)</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Revision Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Updated intro hook pacing and color LUT..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

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
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
