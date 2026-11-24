'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface ViralHook {
  id: string;
  hook: string;
  score: number;
  retentionEstimate: string;
  pacingNote: string;
}

export default function AIAssistantPage() {
  const [topic, setTopic] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Instagram Reels & TikTok');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Real empty state: starts empty until user types a topic and clicks generate
  const [hooks, setHooks] = useState<ViralHook[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHooks([
        {
          id: `h-${Date.now()}`,
          hook: `Stop doing ${topic.trim()} manually in 2026. Here is the 10x faster workflow.`,
          score: 95,
          retentionEstimate: '82% through 0:03',
          pacingNote: 'High pattern interrupt with abrupt zoom-in and glitch transient SFX.',
        },
        {
          id: `h-${Date.now() + 1}`,
          hook: `I tested the top 3 tools for ${topic.trim()} so you do not waste money.`,
          score: 91,
          retentionEstimate: '78% through 0:03',
          pacingNote: 'Curiosity gap with financial/effort stake.',
        },
      ]);
    }, 1000);
  };

  const copyHook = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#818cf8]">Intelligence Engine</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">AI Hook Generator</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="p-6 rounded-xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Hook Prompter
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Video Topic / Brief Premise</label>
              <textarea
                rows={3}
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter what your video is about (e.g. Speed ramping tutorial)..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Platform</label>
              <select
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
              >
                <option value="Instagram Reels & TikTok">Instagram Reels & TikTok (9:16)</option>
                <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                <option value="YouTube 16:9">YouTube 16:9 Long-Form</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Analyzing Retention...' : 'Generate Scored Hooks'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Predicted Viral Angles ({hooks.length})
          </h3>

          {hooks.length === 0 ? (
            <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-2 px-4">
              <Sparkles className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
              <div className="text-sm font-semibold text-white">No hooks generated yet</div>
              <p className="text-xs text-[#71717a] max-w-sm mx-auto">
                Type your video topic on the left and click "Generate Scored Hooks".
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {hooks.map((h) => (
                <div key={h.id} className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981]">
                        Viral Score: {h.score}/100
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1">"{h.hook}"</h4>
                    </div>

                    <button
                      onClick={() => copyHook(h.hook, h.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] text-[#a1a1aa] hover:text-white"
                    >
                      {copiedId === h.id ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#71717a]">{h.pacingNote}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
