'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  RefreshCw,
  FolderPlus,
  AlertCircle,
  Zap
} from 'lucide-react';

interface ViralHook {
  id: string;
  hook: string;
  score: number;
  retentionEstimate: string;
  pacingNote: string;
  visualCue?: string;
}

export default function AIAssistantPage() {
  const [topic, setTopic] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Instagram Reels & TikTok');
  const [tone, setTone] = useState('High Retention / Pattern Interrupt');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'gemini' | 'fallback' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hooks, setHooks] = useState<ViralHook[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: targetPlatform,
          tone,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Generation failed');
      }

      setMode(json.mode || 'fallback');
      setHooks(json.hooks || []);
    } catch (err: any) {
      setError(err.message || 'Failed to generate hooks');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyHook = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#818cf8]">Intelligence Engine</span>
            <h1 className="text-sm font-bold text-white tracking-tight">AI Script & Hook Lab</h1>
          </div>
        </div>

        {mode && (
          <span
            className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
              mode === 'gemini'
                ? 'bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]'
                : 'bg-[#6366f1]/15 border-[#6366f1]/30 text-[#a5b4fc]'
            }`}
          >
            {mode === 'gemini' ? 'Live Gemini AI' : 'Smart Template Mode (Set GEMINI_API_KEY for Live AI)'}
          </span>
        )}
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Viral Hook & Pacing Generator</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Generate scroll-stopping 0–3s hooks, retention estimates, and visual cues via our server-side AI proxy.
          </p>
        </div>

        {/* Prompt Input Card */}
        <form onSubmit={handleGenerate} className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Video Topic / Brand / Product *</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. AI Video Editing App, Myntra Summer Fashion Haul, Crypto Wallet..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Target Platform</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              >
                <option value="Instagram Reels & TikTok">Instagram Reels & TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="UGC Brand Ad">UGC Brand Ad</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Hook Style</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              >
                <option value="High Retention / Pattern Interrupt">High Retention / Pattern Interrupt</option>
                <option value="Curiosity Gap / Story">Curiosity Gap / Story</option>
                <option value="Problem vs Solution UGC">Problem vs Solution UGC</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Hooks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Viral Hooks</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results or Empty State */}
        {hooks.length === 0 ? (
          <div className="py-16 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-2 px-4">
            <Zap className="w-8 h-8 text-[#71717a] mx-auto opacity-30" />
            <div className="text-sm font-semibold text-white">Ready to architect your hook</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto">
              Enter a topic or sponsor product above to generate retention-optimized opening lines and visual cues.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {hooks.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-bold font-mono flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Score {h.score}/100</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#818cf8]">{h.retentionEstimate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyHook(h.hook, h.id)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-[#a1a1aa] hover:text-white border border-white/[0.08] flex items-center gap-1"
                    >
                      {copiedId === h.id ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === h.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <Link
                      href={`/projects/new?campaignTitle=${encodeURIComponent(topic)}`}
                      className="px-2.5 py-1 rounded-lg bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-xs text-[#818cf8] border border-[#6366f1]/30 flex items-center gap-1"
                    >
                      <FolderPlus className="w-3 h-3" />
                      <span>Start Cut</span>
                    </Link>
                  </div>
                </div>

                <p className="text-sm font-bold text-white leading-snug">&ldquo;{h.hook}&rdquo;</p>

                <div className="text-xs text-[#a1a1aa] space-y-1 pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[#71717a] font-mono">Pacing:</span> {h.pacingNote}
                  </div>
                  {h.visualCue && (
                    <div>
                      <span className="text-[#71717a] font-mono">Visual Cue:</span> {h.visualCue}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
