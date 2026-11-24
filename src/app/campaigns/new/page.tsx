'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Link2,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url');

  // URL Import State
  const [importUrl, setImportUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedPreview, setScrapedPreview] = useState<any>(null);

  // Manual Form State
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'AI',
    source: 'Manual',
    payoutModel: 'Fixed Per Clip',
    rate: '',
    deadlineDate: '',
    aspectRatio: '9:16 Vertical',
    synopsis: '',
    requirements: '',
  });

  const handleScrape = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) return;

    setIsScraping(true);
    // Simulate real-time metadata extraction from Whop / Content Rewards / TikTok
    setTimeout(() => {
      setIsScraping(false);
      setScrapedPreview({
        title: 'Lumina Gen-3 AI Commercial Challenge',
        brand: 'Lumina Motion Labs',
        source: importUrl.includes('whop') ? 'Whop' : 'Content Rewards',
        rate: '$150.00 / approved cut',
        aspectRatio: '9:16 Vertical (1080x1920)',
        deadline: '2026-12-04',
        synopsis:
          'Produce a dynamic 30s transformation short highlighting Lumina Gen-3 video inpainting and camera dolly moves.',
      });
    }, 1200);
  };

  const handleSaveScraped = () => {
    // Navigate to campaigns list
    router.push('/campaigns');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/campaigns');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-[white/[0.08]]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Creator Ingest Engine</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Import / Add Campaign</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Ingest New Opportunity</h2>
          <p className="text-xs text-[#9496a1] mt-1">
            Import an external bounty via Whop or Content Rewards URL, or manually log a private brand sponsor brief.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex rounded-xl bg-[#121215] p-1 border border-[white/[0.08]]">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'url' ? 'bg-[#cebdff] text-[#121215]' : 'text-[#9496a1] hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>URL Instant Scrape (Whop / Content Rewards)</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'manual' ? 'bg-[#cebdff] text-[#121215]' : 'text-[#9496a1] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manual Brief Specification</span>
          </button>
        </div>

        {/* Mode 1: URL Scraper */}
        {activeTab === 'url' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#121215] border border-[white/[0.08]] space-y-4">
              <form onSubmit={handleScrape} className="space-y-3">
                <label className="text-xs font-semibold text-white block">
                  Paste Upstream Campaign / Bounty URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://whop.com/creator-bounties/... or https://contentrewards.com/campaigns/..."
                    className="flex-1 bg-[#161821] border border-[white/[0.08]] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
                  />
                  <button
                    type="submit"
                    disabled={isScraping}
                    className="px-5 py-2.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isScraping ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Parsing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Fetch Specs</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] text-[#9496a1]">
                  Supported adapters: Whop Creator Programs, Content Rewards APIs, TikTok Pulse briefs, and Twitter / X thread links.
                </div>
              </form>
            </div>

            {/* Scraped Preview Modal/Card */}
            {scrapedPreview && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161821] to-[#121215] border border-[#cebdff]/40 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Successfully Extracted Metadata
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#cebdff]/20 text-[#cebdff]">
                    Source: {scrapedPreview.source}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{scrapedPreview.title}</h3>
                  <p className="text-xs text-[#9496a1]">Client: {scrapedPreview.brand}</p>
                </div>

                <p className="text-xs text-[#cebdff]/90 leading-relaxed bg-[#09090b]/60 p-3 rounded-xl border border-[white/[0.08]]">
                  {scrapedPreview.synopsis}
                </p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
                    <div className="text-[10px] text-[#9496a1] uppercase">Rate</div>
                    <div className="text-sm font-bold text-[#4edea3] font-mono mt-0.5">{scrapedPreview.rate}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
                    <div className="text-[10px] text-[#9496a1] uppercase">Aspect Ratio</div>
                    <div className="text-xs font-bold text-white mt-0.5">{scrapedPreview.aspectRatio}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
                    <div className="text-[10px] text-[#9496a1] uppercase">Deadline</div>
                    <div className="text-xs font-bold text-[#ffb4ab] mt-0.5">{scrapedPreview.deadline}</div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setScrapedPreview(null)}
                    className="px-4 py-2 rounded-xl bg-[white/[0.04]] hover:bg-[white/[0.08]] text-[#9496a1] hover:text-white text-xs font-medium border border-[white/[0.08]]"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveScraped}
                    className="px-5 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] text-xs font-bold shadow-md shadow-[#cebdff]/15 flex items-center gap-1.5"
                  >
                    <span>Add to Active Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Manual Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="p-6 rounded-2xl bg-[#121215] border border-[white/[0.08]] space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Campaign Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cyberpunk Gaming Chair Feature Cut"
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Brand / Client *</label>
                <input
                  type="text"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. StealthSeat Labs"
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                >
                  <option value="AI">AI & Tech</option>
                  <option value="Gaming">Gaming & Esports</option>
                  <option value="Fintech">Fintech & Web3</option>
                  <option value="Lifestyle">Lifestyle & Wellness</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Payout Structure</label>
                <select
                  value={formData.payoutModel}
                  onChange={(e) => setFormData({ ...formData, payoutModel: e.target.value })}
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                >
                  <option value="Fixed Per Clip">Fixed Per Clip ($)</option>
                  <option value="CPM / Performance">CPM / Views Performance</option>
                  <option value="Hybrid">Hybrid (Base + CPM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Rate / Reward Terms *</label>
                <input
                  type="text"
                  required
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="e.g. $120.00 / clip"
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Target Aspect Ratio</label>
                <input
                  type="text"
                  value={formData.aspectRatio}
                  onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                  placeholder="e.g. 9:16 Vertical (1080x1920)"
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Submission Deadline</label>
                <input
                  type="date"
                  value={formData.deadlineDate}
                  onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                  className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Creative Brief Synopsis *</label>
              <textarea
                rows={3}
                required
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Describe pacing, viral hook requirements, sound design preferences..."
                className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/campaigns"
                className="px-4 py-2 rounded-xl bg-[white/[0.04]] hover:bg-[white/[0.08]] text-[#9496a1] hover:text-white text-xs font-medium border border-[white/[0.08]]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] text-xs font-bold transition-colors shadow-md shadow-[#cebdff]/15"
              >
                Create Campaign Record
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
