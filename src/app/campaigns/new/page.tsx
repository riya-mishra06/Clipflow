'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Link2,
  Sparkles,
  AlertCircle,
  DollarSign,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'url'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL Scraping simulation state
  const [importUrl, setImportUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  // Manual Form State
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'Tech & AI',
    source: 'Manual Ingest',
    payoutModel: 'Fixed Per Clip' as 'Fixed Per Clip' | 'CPM Views' | 'Hybrid Base + Bonus',
    baseRate: 120,
    ratePer1kViews: 4.5,
    estPool: '$5,000 Pool',
    aspectRatio: '9:16',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    brief: '',
    tags: 'AI, Vertical, Kinetic Text',
    rules: 'No AI hallucinations on product screens\nMust follow 9:16 safe-zones\nRetain project files for 14 days',
    deadlineDays: 7,
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        source: formData.source,
        payoutModel: formData.payoutModel,
        baseRate: Number(formData.baseRate),
        ratePer1kViews: Number(formData.ratePer1kViews),
        estPool: formData.estPool,
        aspectRatio: formData.aspectRatio,
        difficulty: formData.difficulty,
        brief: formData.brief,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        rules: formData.rules.split('\n').map((r) => r.trim()).filter(Boolean),
        deadlineDays: Number(formData.deadlineDays),
        deadlineDate: new Date(Date.now() + formData.deadlineDays * 86400000).toISOString().split('T')[0],
      };

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save campaign to Atlas');
      }

      router.push('/campaigns');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the campaign.');
      setLoading(false);
    }
  };

  const handleScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;

    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
      setFormData({
        title: 'NeonPulse AI Video Synthesizer Launch',
        brand: 'NeonPulse Labs',
        category: 'Tech & AI',
        source: importUrl.includes('whop') ? 'Whop' : 'Content Rewards',
        payoutModel: 'Fixed Per Clip',
        baseRate: 140,
        ratePer1kViews: 5.0,
        estPool: '$10,000 Pool',
        aspectRatio: '9:16',
        difficulty: 'Intermediate',
        brief: 'Produce high-energy 9:16 vertical edits demonstrating audio-reactive glitch synthesis and instant face morphs.',
        tags: 'AI Tech, Cyberpunk, Kinetic Motion',
        rules: 'CTA badge in final 3 seconds\n9:16 safe zones for like buttons\n4K 60fps export quality',
        deadlineDays: 8,
      });
      setActiveTab('manual');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30">
                Campaign Ingestion
              </span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              Ingest & Provision New Brand Bounty
            </h1>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'manual'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'url'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            URL Scrape
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'url' ? (
          /* URL Ingest Mode */
          <div className="p-8 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-6">
            <div>
              <h2 className="text-base font-bold text-white font-headline">Import via Platform URL</h2>
              <p className="text-xs text-[#71717a] mt-1">
                Paste a public bounty URL from Whop, Content Rewards, or TikTok Creator Marketplace to auto-extract brief guidelines.
              </p>
            </div>

            <form onSubmit={handleScrape} className="space-y-4">
              <div className="relative">
                <Link2 className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://whop.com/hub/campaigns/neonpulse-ai-ugc"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-3 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <button
                type="submit"
                disabled={isScraping}
                className="w-full py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isScraping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Metadata & Brief Guidelines...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Auto-Extract & Populate Form</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Manual Entry Form */
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="p-8 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-6">
              <h2 className="text-base font-bold text-white font-headline border-b border-white/[0.08] pb-3">
                Campaign Brief Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Lumina Gen-3 Motion Challenge"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Brand / Sponsor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Lumina Motion Labs"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="E-Commerce">E-Commerce</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Payout Model</label>
                  <select
                    value={formData.payoutModel}
                    onChange={(e) => setFormData({ ...formData, payoutModel: e.target.value as any })}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="Fixed Per Clip">Fixed Per Clip</option>
                    <option value="CPM Views">CPM Views</option>
                    <option value="Hybrid Base + Bonus">Hybrid Base + Bonus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Base Bounty Rate (USD $) *</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.baseRate}
                      onChange={(e) => setFormData({ ...formData, baseRate: Number(e.target.value) })}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Rate Per 1,000 Views ($ CPM)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.ratePer1kViews}
                    onChange={(e) => setFormData({ ...formData, ratePer1kViews: Number(e.target.value) })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa]">Aspect Ratio</label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="9:16">9:16 Vertical (Shorts/Reels)</option>
                    <option value="16:9">16:9 Landscape</option>
                    <option value="1:1">1:1 Square</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Brief Synopsis / Guidelines</label>
                  <textarea
                    rows={3}
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    placeholder="Describe what the sponsor is looking for: pacing, tone, kinetic subtitles..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="AI, VFX, Motion Design"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-[#a1a1aa]">Rules & Requirements (one per line)</label>
                  <textarea
                    rows={3}
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/campaigns"
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-colors shadow-md shadow-[#6366f1]/20 flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Atlas Cloud...</span>
                  </>
                ) : (
                  <>
                    <span>Create Campaign Bounty</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
