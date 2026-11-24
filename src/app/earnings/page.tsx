'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  CreditCard,
  Download,
  Film
} from 'lucide-react';

interface Transaction {
  id: string;
  desc: string;
  sponsor: string;
  date: string;
  amount: string;
  status: string;
}

export default function EarningsPage() {
  // Real empty balance: 0.00 until payouts are released from approved cuts
  const [balance, setBalance] = useState('$0.00');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Creator Earnings & Escrow Balance
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Track approved bounty rewards, CPM performance payouts, and automatic direct deposits.
          </p>
        </div>

        {/* 4 Financial Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Available for Payout</div>
            <div className="font-extrabold text-2xl text-[#10b981] font-mono mt-1">$0.00</div>
            <div className="text-xs text-[#71717a] mt-1">No settled balance yet</div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Locked in Escrow</div>
            <div className="font-extrabold text-2xl text-white font-mono mt-1">$0.00</div>
            <div className="text-xs text-[#71717a] mt-1">0 pending review submissions</div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Lifetime Creator Yield</div>
            <div className="font-extrabold text-2xl text-white font-mono mt-1">$0.00</div>
            <div className="text-xs text-[#71717a] mt-1">Ready for first bounty win</div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">Payout Destination</div>
            <div className="font-extrabold text-sm text-white mt-1">Not Connected</div>
            <div className="text-xs text-[#818cf8] mt-1 cursor-pointer hover:underline">Connect Bank / Stripe →</div>
          </div>
        </section>

        {/* Transactions Table / Empty State */}
        <section className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h2 className="text-sm font-bold text-white font-headline">Recent Bounty Payout Settlements</h2>
            <p className="text-xs text-[#71717a]">Audit log of completed escrow releases</p>
          </div>

          {transactions.length === 0 ? (
            <div className="py-20 text-center space-y-2 px-4">
              <DollarSign className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
              <div className="text-sm font-semibold text-white">No payout transactions yet</div>
              <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                When a sponsor approves your video submission, your reward will automatically settle here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {/* Real transactions */}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
