'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
  ArrowUpRight
} from 'lucide-react';

interface Transaction {
  _id: string;
  projectTitle: string;
  campaignTitle: string;
  cutVersion: string;
  amount: number;
  amountFormatted: string;
  status: 'pending_review' | 'approved' | 'changes_requested';
  createdAt: string;
}

interface EarningsSummary {
  availableBalance: number;
  lockedEscrow: number;
  lifetimeYield: number;
  approvedCount: number;
  pendingCount: number;
  totalSubmissions: number;
}

export default function EarningsPage() {
  const [summary, setSummary] = useState<EarningsSummary>({
    availableBalance: 0,
    lockedEscrow: 0,
    lifetimeYield: 0,
    approvedCount: 0,
    pendingCount: 0,
    totalSubmissions: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEarnings() {
      setLoading(true);
      try {
        const res = await fetch('/api/earnings', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.summary) setSummary(json.summary);
          setTransactions(json.transactions || []);
        }
      } catch (err) {
        console.error('Failed to load earnings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEarnings();
  }, []);

  const getStatusPill = (status: Transaction['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Settled</span>
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            <RotateCcw className="w-3 h-3" />
            <span>On Hold</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30">
            <Clock className="w-3 h-3" />
            <span>In Escrow</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Creator Earnings & Escrow Balance
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Derived live from your approved and pending-review bounty submissions.
            </p>
          </div>

          <Link
            href="/submissions"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] transition-colors self-start sm:self-auto"
          >
            <span>Manage Submissions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Financial Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Available for Payout
            </div>
            <div className="font-extrabold text-2xl text-[#10b981] font-mono mt-1">
              ${summary.availableBalance.toFixed(2)}
            </div>
            <div className="text-xs text-[#71717a] mt-1">
              {summary.approvedCount === 0
                ? 'No settled balance yet'
                : `${summary.approvedCount} approved submission(s)`}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Locked in Escrow
            </div>
            <div className="font-extrabold text-2xl text-white font-mono mt-1">
              ${summary.lockedEscrow.toFixed(2)}
            </div>
            <div className="text-xs text-[#71717a] mt-1">
              {summary.pendingCount} pending review submission(s)
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Lifetime Creator Yield
            </div>
            <div className="font-extrabold text-2xl text-white font-mono mt-1">
              ${summary.lifetimeYield.toFixed(2)}
            </div>
            <div className="text-xs text-[#71717a] mt-1">
              {summary.approvedCount === 0
                ? 'Ready for first bounty win'
                : 'Total approved earnings'}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#121215] border border-white/[0.08] space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#71717a] font-semibold">
              Payout Destination
            </div>
            <div className="font-extrabold text-sm text-white mt-1">Configure in Settings</div>
            <Link
              href="/settings"
              className="text-xs text-[#818cf8] mt-1 inline-block hover:underline"
            >
              Manage Account & Payouts →
            </Link>
          </div>
        </section>

        {/* Transactions Table */}
        <section className="rounded-xl bg-[#121215] border border-white/[0.08] overflow-hidden">
          <div className="p-4 border-b border-white/[0.08]">
            <h2 className="text-sm font-bold text-white font-headline">
              Bounty Payout & Escrow Ledger
            </h2>
            <p className="text-xs text-[#71717a]">
              Live audit log of your submitted cuts and escrow status
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 text-[#6366f1] animate-spin" />
              <span className="text-xs text-[#71717a] font-mono">Calculating Earnings Ledger...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center space-y-2 px-4">
              <DollarSign className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
              <div className="text-sm font-semibold text-white">No payout transactions yet</div>
              <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                When you submit a cut and a sponsor approves it, your reward will automatically settle here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {getStatusPill(tx.status)}
                      <span className="text-xs font-mono text-[#71717a]">{tx.cutVersion}</span>
                      <span className="text-xs font-mono text-[#71717a]">
                        • {new Date(tx.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate">{tx.projectTitle}</div>
                    <div className="text-xs text-[#71717a] truncate">{tx.campaignTitle}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div
                      className={`text-base font-extrabold font-mono ${
                        tx.status === 'approved' ? 'text-[#10b981]' : 'text-white'
                      }`}
                    >
                      {tx.amountFormatted}
                    </div>
                    <div className="text-[10px] text-[#71717a] uppercase font-mono">
                      {tx.status === 'approved' ? 'Released' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
