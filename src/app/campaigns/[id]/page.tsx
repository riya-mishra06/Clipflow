'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  FolderPlus,
  ShieldCheck,
  Check,
  Loader2
} from 'lucide-react';

interface CampaignDetail {
  _id: string;
  title: string;
  brand: string;
  category: string;
  source: string;
  payoutModel: string;
  baseRate: number;
  ratePer1kViews?: number;
  estPool?: string;
  deadlineDate?: string;
  deadlineDays?: number;
  aspectRatio: string;
  difficulty: string;
  brief?: string;
  tags?: string[];
  rules?: string[];
  spotsRemaining?: number;
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.id as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'guidelines' | 'rules'>('overview');

  // Interactive Yield Calculator State
  const [clipsCount, setClipsCount] = useState<number>(2);
  const [projectedViews, setProjectedViews] = useState<number>(25000);

  useEffect(() => {
    async function fetchDetail() {
      if (!campaignId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`);
        if (!res.ok) {
          throw new Error('Campaign not found or removed.');
        }
        const json = await res.json();
        setCampaign(json.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaign');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [campaignId]);

  const baseRate = campaign?.baseRate || 0;
  const ratePer1k = campaign?.ratePer1kViews || 0;
  const estimatedBaseEarnings = clipsCount * baseRate;
  const estimatedViewBonus = (projectedViews / 1000) * ratePer1k;
  const totalEstimatedEarnings = estimatedBaseEarnings + estimatedViewBonus;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCreateProject = () => {
    if (!campaign) return;
    router.push(`/projects/new?campaignId=${campaign._id}&campaignTitle=${encodeURIComponent(campaign.title)}`);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        <div className="text-xs text-[#71717a] font-mono">Loading campaign specifications from Atlas...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-lg font-bold text-white">Campaign Not Found</div>
        <p className="text-xs text-[#71717a] max-w-sm">
          {error || "The campaign brief you requested doesn't exist or has been archived."}
        </p>
        <Link
          href="/campaigns"
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
        >
          Return to Campaign Explorer
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/campaigns"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] text-[#818cf8] border border-white/[0.08]">
                {campaign.source}
              </span>
              <span className="text-xs text-[#71717a] font-mono">ID: {campaign._id.slice(-6)}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              {campaign.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                : 'bg-[#121215] hover:bg-white/[0.04] border-white/[0.08] text-[#71717a] hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Bookmarked' : 'Save Brief'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </header>

      {/* Main Studio Workstation Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: 2 Spans */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero Card */}
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-[#6366f1]/10 text-[#818cf8] font-bold border border-[#6366f1]/20 font-mono">
                    {campaign.category}
                  </span>
                  <span className="text-xs text-[#71717a] font-mono">
                    {campaign.difficulty} Difficulty
                  </span>
                </div>
                <div className="text-xs text-[#f59e0b] font-medium flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{campaign.deadlineDays ? `${campaign.deadlineDays} days remaining` : 'Active'}</span>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight font-headline">
                  {campaign.title}
                </h2>
                <div className="text-xs text-[#71717a] mt-1">
                  Brand Sponsor: <span className="text-white font-semibold">{campaign.brand}</span>
                </div>
              </div>

              {/* Tags Strip */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {campaign.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-white/[0.03] text-[#71717a] border border-white/[0.06] font-mono"
                    >
                      #{tag.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-white/[0.08] flex items-center gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'overview' ? 'text-white' : 'text-[#71717a] hover:text-white'
                }`}
              >
                <span>Brief & Overview</span>
                {activeTab === 'overview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('guidelines')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'guidelines' ? 'text-white' : 'text-[#71717a] hover:text-white'
                }`}
              >
                <span>Format Specifications</span>
                {activeTab === 'guidelines' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'rules' ? 'text-white' : 'text-[#71717a] hover:text-white'
                }`}
              >
                <span>Rules & Compliance ({campaign.rules?.length || 0})</span>
                {activeTab === 'rules' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1]" />
                )}
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#818cf8]" />
                  <span>Creative Brief & Hook Angles</span>
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed whitespace-pre-line">
                  {campaign.brief || 'No full synopsis provided by creator yet. Review submission guidelines.'}
                </p>
              </div>
            )}

            {activeTab === 'guidelines' && (
              <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#818cf8]" />
                  <span>Technical Production Standards</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[#71717a]">Aspect Ratio</span>
                    <div className="text-white font-mono font-bold">{campaign.aspectRatio} Vertical</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[#71717a]">Payout Model</span>
                    <div className="text-white font-mono font-bold">{campaign.payoutModel}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[#71717a]">Target Difficulty</span>
                    <div className="text-white font-mono font-bold">{campaign.difficulty}</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                    <span className="text-[#71717a]">Total Bounty Pool</span>
                    <div className="text-[#10b981] font-mono font-bold">{campaign.estPool || 'Standard'}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span>Mandatory Rules</span>
                </h3>
                {campaign.rules && campaign.rules.length > 0 ? (
                  <ul className="space-y-2">
                    {campaign.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#a1a1aa]">
                        <Check className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#71717a]">Standard copyright and UGC production terms apply.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar: Dynamic Yield Calculator */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-5 sticky top-24">
              <div>
                <div className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider font-mono">
                  Bounty Earnings Calculator
                </div>
                <h3 className="text-base font-bold text-white mt-1">Projected Creator Yield</h3>
              </div>

              {/* Slider 1: Cuts */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717a]">Planned Video Cuts:</span>
                  <span className="text-white font-bold font-mono">{clipsCount} clips</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={clipsCount}
                  onChange={(e) => setClipsCount(Number(e.target.value))}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>

              {/* Slider 2: Estimated Views */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#71717a]">Estimated Social Views:</span>
                  <span className="text-white font-bold font-mono">
                    {projectedViews.toLocaleString()} views
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  value={projectedViews}
                  onChange={(e) => setProjectedViews(Number(e.target.value))}
                  className="w-full accent-[#6366f1] cursor-pointer"
                />
              </div>

              {/* Computation Summary */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] space-y-2.5">
                <div className="flex justify-between text-xs text-[#71717a]">
                  <span>Base Cut Bounties ({clipsCount} × ${baseRate}):</span>
                  <span className="text-white font-mono">${estimatedBaseEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#71717a]">
                  <span>Performance CPM Pool:</span>
                  <span className="text-white font-mono">${estimatedViewBonus.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white">Estimated Yield:</span>
                  <span className="text-xl font-extrabold text-[#10b981] font-mono">
                    ${totalEstimatedEarnings.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={handleCreateProject}
                className="w-full py-3 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#6366f1]/20"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Initialize Studio Project</span>
              </button>

              <div className="text-[11px] text-[#71717a] text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Verified with MongoDB Atlas</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
