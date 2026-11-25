'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Save,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProjectPlanPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [projectTitle, setProjectTitle] = useState('Project Plan');
  const [hookIdea, setHookIdea] = useState('');
  const [scriptNotes, setScriptNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadPlan() {
      if (!projectId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const p = json.data;
          if (p) {
            setProjectTitle(p.title || 'Project Plan');
            setHookIdea(p.conceptHook || '');
            setScriptNotes(
              p.scriptNotes ||
                '0:00 - 0:03 | Pattern Interrupt Hook:\n[Visual]: Fast zoom + glitch SFX\n[Voiceover]: ...\n\n0:03 - 0:15 | Pain Point vs Solution:\n...\n\n0:15 - 0:45 | Walkthrough & CTA:\n...'
            );
          }
        }
      } catch (err) {
        console.error('Failed to load project plan:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [projectId]);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptHook: hookIdea,
          scriptNotes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save plan');
      }
      setFeedback({ type: 'success', text: 'Script & hook plan saved to MongoDB Atlas!' });
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`HOOK:\n${hookIdea}\n\nSCRIPT:\n${scriptNotes}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        <span className="text-xs text-[#71717a] font-mono">Loading Script Plan...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[#818cf8]">Script & Hook Architect</span>
            <h1 className="text-base font-bold text-white tracking-tight truncate">{projectTitle}</h1>
          </div>
        </div>

        <Link
          href={`/projects/${projectId}/tasks`}
          className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.08] transition-colors shrink-0"
        >
          Go to Tasks →
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-headline">Content Plan & Script</h2>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Refine your 0–3s retention hook and beat-by-beat script cues. Saved directly to your project document.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08] transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Full Script'}</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981]'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSavePlan} className="space-y-5">
          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>0–3 Second Retention Hook</span>
            </label>
            <textarea
              rows={2}
              value={hookIdea}
              onChange={(e) => setHookIdea(e.target.value)}
              placeholder="Write your scroll-stopping opening hook..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Beat-Sheet & Dialogue Script</span>
            </label>
            <textarea
              rows={10}
              value={scriptNotes}
              onChange={(e) => setScriptNotes(e.target.value)}
              placeholder="Write your timestamped dialogue and visual cues..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white font-mono leading-relaxed placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-[#6366f1]/20 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Content Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
