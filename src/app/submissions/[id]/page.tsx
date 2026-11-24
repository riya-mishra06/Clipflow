'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Share2,
  Film,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function SubmissionDetailPage() {
  const params = useParams();
  const subId = (params?.id as string) || 'sub-01';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-[white/[0.08]]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/submissions"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
                Submission Audit
              </span>
              <span className="text-xs text-[#9496a1] font-mono">{subId}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              NeonPulse AI Glitch Cuts Pack (v2.1 Master)
            </h1>
          </div>
        </div>

        <Link
          href="/earnings"
          className="px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10"
        >
          View Escrow Payout
        </Link>
      </header>

      {/* Main Details */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161821] to-[#121215] border border-[white/[0.08]] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] font-bold">
              Status: Approved by NeonPulse Labs
            </span>
            <span className="text-xs text-[#9496a1] font-mono">Released: Nov 23, 2026</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white font-headline">
            Verified Submission Details
          </h2>
          <p className="text-xs text-[#9496a1]">
            Campaign: NeonPulse AI Video Synthesizer Launch • Whop Escrow Bounty ID: #WHOP-8921-99
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[white/[0.08]]/50">
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
              <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Compensation</div>
              <div className="text-xl font-extrabold text-[#4edea3] font-mono mt-0.5">$140.00 USD</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
              <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Verified Views</div>
              <div className="text-xl font-extrabold text-[#cebdff] font-mono mt-0.5">42,850 Views</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
              <div className="text-[10px] text-[#9496a1] uppercase font-semibold">Quality Score</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5">98 / 100</div>
            </div>
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-[white/[0.08]] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
            Compliance & Review Timeline
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3] mt-0.5" />
              <div>
                <div className="text-white font-semibold">Automated Quality Control (QC) Passed</div>
                <div className="text-[#9496a1] text-[11px]">Validated 1080x1920, 60.00 fps, and -14.2 LUFS audio loudness.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3] mt-0.5" />
              <div>
                <div className="text-white font-semibold">Brand Sponsor Review Approved</div>
                <div className="text-[#9496a1] text-[11px]">Client approved hook pacing and NeonPulse CTA badge animation.</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3] mt-0.5" />
              <div>
                <div className="text-white font-semibold">Whop Escrow Payout Released</div>
                <div className="text-[#9496a1] text-[11px]">$140.00 transferred into creator available balance.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
