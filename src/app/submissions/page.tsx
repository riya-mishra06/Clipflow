'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Send,
  Plus,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface SubmissionItem {
  id: string;
  projectTitle: string;
  campaignTitle: string;
  brand: string;
  cutVersion: string;
  submittedAt: string;
  status: string;
  payoutAmount: string;
}

export default function SubmissionsPage() {
  // Real empty state: starts with 0 submissions until user exports & submits a cut
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Review & Submission Tracker
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Monitor sponsor approvals, brand manager change requests, and automated view performance telemetry.
          </p>
        </div>

        {submissions.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Send className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No active submissions</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              When you complete an approved export cut from a video project, submit it here to receive escrow payout.
            </p>
            <div className="pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
              >
                <span>View Projects</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Real items */}
          </div>
        )}
      </main>
    </div>
  );
}
