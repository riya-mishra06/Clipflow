'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Sparkles,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Film,
  FolderPlus,
  PlayCircle,
  ShieldCheck,
  History,
  Download,
  Sliders,
  ChevronRight,
  TrendingUp,
  Cpu,
  HelpCircle,
  Check
} from 'lucide-react';

interface CampaignDetail {
  id: string;
  title: string;
  brand: string;
  category: string;
  source: string;
  payoutModel: string;
  baseRate: number; // in USD
  ratePer1kViews?: number;
  estPool: string;
  deadlineDate: string;
  deadlineDays: number;
  aspectRatio: string;
  resolution: string;
  minDuration: string;
  maxDuration: string;
  frameRate: string;
  difficulty: string;
  synopsis: string;
  brandTone: string[];
  mandatoryAssets: { title: string; type: string; size: string }[];
  rules: string[];
  eligibility: string[];
  changeLogs: { date: string; action: string; note: string }[];
  spotsRemaining: number;
  totalSubmissions: number;
}

const CAMPAIGN_MOCK: Record<string, CampaignDetail> = {
  'camp-01': {
    id: 'camp-01',
    title: 'NeonPulse AI Video Synthesizer Launch',
    brand: 'NeonPulse Labs',
    category: 'AI Tech',
    source: 'Content Rewards',
    payoutModel: 'Fixed Per Clip',
    baseRate: 140,
    ratePer1kViews: 4.5,
    estPool: '$12,500 Pool',
    deadlineDate: 'November 28, 2026',
    deadlineDays: 4,
    aspectRatio: '9:16 Vertical (1080x1920)',
    resolution: '1080p or 4K ProRes',
    minDuration: '30 seconds',
    maxDuration: '60 seconds',
    frameRate: '60 fps strict',
    difficulty: 'Intermediate',
    synopsis:
      'NeonPulse is launching its next-gen AI video transformation engine. We need snappy, high-retention vertical edits demonstrating real-time face tracking and audio-reactive glitch synthesis. Your cut should hook viewers in the first 2.5 seconds using unexpected transform comparisons.',
    brandTone: ['Cyberpunk Aesthetic', 'Kinetic Motion Typography', 'Punchy & Hypnotic', 'Minimalist UI'],
    mandatoryAssets: [
      { title: 'NeonPulse_Logo_Vector_Pack.svg', type: 'Vector', size: '2.4 MB' },
      { title: 'Raw_Stems_Audio_Track_Stem_01.wav', type: 'Uncompressed Audio', size: '38 MB' },
      { title: 'B-Roll_Synthesizer_Playback_ProRes.mov', type: '4K Footage', size: '1.2 GB' },
    ],
    rules: [
      'Must incorporate the official NeonPulse CTA badge in the final 5 seconds.',
      'No AI hallucinatory artifacts on the product UI screens.',
      'Sound design must hit peak transients on scene changes.',
      'Original creator face or voiceover preferred but not required if motion storytelling is elite.',
    ],
    eligibility: [
      'ClipFlow Verified Creator Status or Portfolio Approval',
      'Minimum 1080x1920 60fps export capability',
      'Original source files must be retained for 14 days after payout approval',
    ],
    changeLogs: [
      { date: 'Nov 22, 2026', action: 'Bounty Increased', note: 'Base rate increased from $120 to $140 due to high creative requirements.' },
      { date: 'Nov 20, 2026', action: 'Asset Pack Updated', note: 'Added high-bitrate ProRes 4K B-Roll clips.' },
      { date: 'Nov 18, 2026', action: 'Campaign Published', note: 'Opened public applications via Content Rewards API.' },
    ],
    spotsRemaining: 8,
    totalSubmissions: 34,
  },
};

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = (params?.id as string) || 'camp-01';

  // Fallback if ID is not in mock map
  const campaign = CAMPAIGN_MOCK[campaignId] || CAMPAIGN_MOCK['camp-01'];

  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'guidelines' | 'assets' | 'history'>('overview');

  // Payout Calculator State
  const [clipsCount, setClipsCount] = useState<number>(2);
  const [projectedViews, setProjectedViews] = useState<number>(25000);

  const estimatedBaseEarnings = clipsCount * campaign.baseRate;
  const estimatedViewBonus = (projectedViews / 1000) * (campaign.ratePer1kViews || 0);
  const totalEstimatedEarnings = estimatedBaseEarnings + estimatedViewBonus;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCreateProject = () => {
    router.push(`/projects/new?campaignId=${campaign.id}&campaignTitle=${encodeURIComponent(campaign.title)}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Studio Bar */}
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[white/[0.04]] text-[#cebdff] border border-[white/[0.08]]">
                {campaign.source}
              </span>
              <span className="text-xs text-[#9496a1] font-mono">ID: {campaign.id}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              {campaign.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-[#4edea3]/10 border-[#4edea3]/30 text-[#4edea3]'
                : 'bg-[#121215] hover:bg-[white/[0.04]] border-[white/[0.08]] text-[#9496a1] hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Bookmarked' : 'Save Brief'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-xs font-medium text-[#9496a1] hover:text-white transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleCreateProject}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] font-bold text-xs transition-all shadow-md shadow-[#cebdff]/10"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Start Project Cut</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Layout (70% Brief & Specs / 30% Calculator & Actions) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Specifications & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Banner Header */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#161821] via-[#121215] to-[#09090b] border border-[white/[0.08]] p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#cebdff]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#cebdff]/20 text-[#cebdff] font-semibold border border-[#cebdff]/30">
                  {campaign.category}
                </span>
                <span className="text-xs text-[#9496a1]">Targeting Short-Form Viral Reach</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#ffb4ab] font-medium bg-[#ffb4ab]/10 px-3 py-1 rounded-full border border-[#ffb4ab]/20">
                <Clock className="w-3.5 h-3.5" />
                <span>Deadline: {campaign.deadlineDate} ({campaign.deadlineDays}d remaining)</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline mb-2">
              {campaign.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-[#9496a1] mb-6">
              <span>Commissioned by</span>
              <span className="text-white font-bold">{campaign.brand}</span>
              <span>•</span>
              <span className="text-[#4edea3] font-semibold">{campaign.spotsRemaining} spots available</span>
              <span>•</span>
              <span>{campaign.totalSubmissions} submissions reviewed</span>
            </div>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[white/[0.08]]/60">
              <div className="rounded-xl bg-[#09090b]/60 p-3 border border-[white/[0.08]]/50">
                <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Aspect Ratio</div>
                <div className="text-xs font-bold text-white mt-0.5 font-mono">9:16 Vertical</div>
              </div>
              <div className="rounded-xl bg-[#09090b]/60 p-3 border border-[white/[0.08]]/50">
                <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Framerate</div>
                <div className="text-xs font-bold text-white mt-0.5 font-mono">60 FPS Strict</div>
              </div>
              <div className="rounded-xl bg-[#09090b]/60 p-3 border border-[white/[0.08]]/50">
                <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Duration Target</div>
                <div className="text-xs font-bold text-white mt-0.5 font-mono">30s - 60s max</div>
              </div>
              <div className="rounded-xl bg-[#09090b]/60 p-3 border border-[white/[0.08]]/50">
                <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Resolution</div>
                <div className="text-xs font-bold text-[#cebdff] mt-0.5 font-mono">1080p / 4K</div>
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 border-b border-[white/[0.08]] pb-px">
            {[
              { id: 'overview', label: 'Synopsis & Brief' },
              { id: 'guidelines', label: 'Production Guidelines' },
              { id: 'assets', label: 'Downloadable Assets' },
              { id: 'history', label: 'Bounty Change History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#cebdff] text-white bg-[#121215]'
                    : 'border-transparent text-[#9496a1] hover:text-white hover:bg-[#121215]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-headline flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#cebdff]" />
                  <span>Creative Brief Synopsis</span>
                </h3>
                <p className="text-sm text-[#cebdff]/90 leading-relaxed font-normal">
                  {campaign.synopsis}
                </p>

                <div className="pt-4 border-t border-[white/[0.08]]/60">
                  <div className="text-xs font-semibold text-white mb-2">Desired Brand Tone & Mood:</div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.brandTone.map((tone) => (
                      <span
                        key={tone}
                        className="px-3 py-1 rounded-lg bg-[white/[0.04]] text-[#cebdff] border border-[white/[0.08]] text-xs font-medium"
                      >
                        ⚡ {tone}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submission Rules & Eligibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#cebdff]" />
                    <span>Submission Rules</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#9496a1]">
                    {campaign.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cebdff] mt-1.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
                    <span>Creator Eligibility</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#9496a1]">
                    {campaign.eligibility.map((el, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3] mt-0.5 shrink-0" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Guidelines */}
          {activeTab === 'guidelines' && (
            <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-headline">
                Technical Production Specifications
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2">
                  <div className="text-white font-semibold">1. Hook & Pacing Architecture</div>
                  <p className="text-[#9496a1] leading-relaxed">
                    First 2 seconds must feature a visual pattern interrupt (zooms, speed ramp, or abrupt text flash). Avoid lengthy intro titles or branding cards before the hook.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2">
                  <div className="text-white font-semibold">2. Audio Loudness & Stems</div>
                  <p className="text-[#9496a1] leading-relaxed">
                    Integrated dialogue must hover between -14 LUFS to -16 LUFS. SFX sound drops should be side-chained cleanly under the voiceover. Use the provided .wav audio stems.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2">
                  <div className="text-white font-semibold">3. Safe Zones for Instagram Reels & TikTok</div>
                  <p className="text-[#9496a1] leading-relaxed">
                    Keep typography within the central 1080x1400 box. Leave 220px top clear of headers and 300px bottom clear of UI player buttons and captions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Assets */}
          {activeTab === 'assets' && (
            <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-headline">
                  Official Brand Assets Pack
                </h3>
                <span className="text-xs text-[#cebdff]">3 verified studio files</span>
              </div>

              <div className="space-y-2.5">
                {campaign.mandatoryAssets.map((asset, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]] flex items-center justify-between hover:border-[#cebdff]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[white/[0.04]] text-[#cebdff]">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{asset.title}</div>
                        <div className="text-[11px] text-[#9496a1]">
                          {asset.type} • {asset.size}
                        </div>
                      </div>
                    </div>

                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[white/[0.04]] hover:bg-[white/[0.08]] text-[#cebdff] hover:text-white text-xs font-medium border border-[white/[0.08]] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Change History */}
          {activeTab === 'history' && (
            <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-headline flex items-center gap-2">
                <History className="w-4 h-4 text-[#cebdff]" />
                <span>Audited Bounty Modifications</span>
              </h3>

              <div className="relative border-l border-[white/[0.08]] ml-3 pl-5 space-y-6">
                {campaign.changeLogs.map((log, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#cebdff] border-2 border-[#121215]" />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#9496a1] font-mono">{log.date}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[white/[0.04]] text-white font-semibold border border-[white/[0.08]]">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-[#cebdff]/80 mt-1">{log.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Sticky Payout Calculator & Action Hub */}
        <div className="lg:col-span-4 space-y-6">
          {/* Payout Estimator Widget */}
          <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-5 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#4edea3]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
                  Payout Calculator
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] font-semibold">
                Live Simulator
              </span>
            </div>

            {/* Slider 1: Clips Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#9496a1]">Planned Approved Cuts:</span>
                <span className="text-white font-bold font-mono">{clipsCount} clips</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={clipsCount}
                onChange={(e) => setClipsCount(Number(e.target.value))}
                className="w-full accent-[#cebdff] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9496a1]">
                <span>1 clip</span>
                <span>10 clips</span>
              </div>
            </div>

            {/* Slider 2: Estimated Views */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#9496a1]">Estimated Social Views:</span>
                <span className="text-white font-bold font-mono">
                  {(projectedViews).toLocaleString()} views
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={projectedViews}
                onChange={(e) => setProjectedViews(Number(e.target.value))}
                className="w-full accent-[#cebdff] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#9496a1]">
                <span>5k</span>
                <span>250k views</span>
              </div>
            </div>

            {/* Computation Summary Card */}
            <div className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2.5">
              <div className="flex justify-between text-xs text-[#9496a1]">
                <span>Base Cut Bounties ({clipsCount} × ${campaign.baseRate}):</span>
                <span className="text-white font-mono">${estimatedBaseEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#9496a1]">
                <span>Performance CPM Pool:</span>
                <span className="text-white font-mono">${estimatedViewBonus.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-[white/[0.08]] flex justify-between items-baseline">
                <span className="text-xs font-bold text-white">Estimated Yield:</span>
                <span className="text-xl font-extrabold text-[#4edea3] font-mono">
                  ${totalEstimatedEarnings.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Start Project CTA */}
            <button
              onClick={handleCreateProject}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cebdff] to-[#d0bcff] hover:from-[#d0bcff] hover:to-[#cebdff] text-[#121215] font-extrabold text-sm transition-all shadow-lg shadow-[#cebdff]/15 flex items-center justify-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Initialize Studio Project</span>
            </button>

            <div className="text-[11px] text-[#9496a1] text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
              <span>Funds escrowed in Whop & Content Rewards</span>
            </div>

            {/* Additional Metadata card */}
            <div className="p-3.5 rounded-xl bg-[#161821] border border-[white/[0.08]] space-y-2 text-xs">
              <div className="text-[#cebdff] font-semibold">Direct Source Verification</div>
              <p className="text-[11px] text-[#9496a1] leading-relaxed">
                This campaign was validated via external OAuth connection. Submissions are reviewed automatically within 48h.
              </p>
              <a
                href="https://whop.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#cebdff] hover:underline"
              >
                <span>View original upstream listing</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
