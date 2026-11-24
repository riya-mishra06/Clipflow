'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Instagram,
  Youtube,
  Share2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Radio
} from 'lucide-react';

interface ChannelAccount {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  handle: string;
  name: string;
  avatarUrl: string;
  status: string;
  followers: string;
  avgViews: string;
}

export default function SocialChannelsPage() {
  // Real empty state: starts with 0 channels until user authorizes via OAuth
  const [channels, setChannels] = useState<ChannelAccount[]>([]);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Connected Creator Channels
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Link Instagram Professional accounts and YouTube channels to enable automatic view tracking and CPM performance verification.
          </p>
        </div>

        {/* Empty State */}
        {channels.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Share2 className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No social accounts connected</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Connect your Instagram Professional or YouTube account to sync views and unlock CPM performance bounties.
            </p>
            <div className="pt-3 flex items-center justify-center gap-3">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Connect Account</span>
              </button>
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
