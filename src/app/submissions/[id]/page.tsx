'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';

interface SubmissionDetail {
  _id: string;
  projectId?: string;
  projectTitle: string;
  campaignId?: string;
  campaignTitle: string;
  videoUrl: string;
  cutVersion: string;
  notes?: string;
  status: 'pending_review' | 'approved' | 'changes_requested';
  payoutAmount: string;
  createdAt: string;
  updatedAt: string;
}

export default function SubmissionDetailPage() {
  const params = useParams();
  const subId = params?.id as string;

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<SubmissionDetail['status']>('pending_review');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!subId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/submissions/${subId}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Submission not found');
        }
        setSubmission(json.data);
        setStatus(json.data.status);
        setNotes(json.data.notes || '');
      } catch (err: any) {
        setError(err.message || 'Failed to load submission');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [subId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch(`/api/submissions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        const json = await res.json();
        setSubmission(json.data);
        setSavedMsg('Submission updated in Atlas!');
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        <span className="text-xs text-[#71717a] font-mono">Loading Submission Audit...</span>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-lg font-bold text-white">Submission Not Found</div>
        <p className="text-xs text-[#71717a] max-w-sm">
          {error || "This submission doesn't exist or was withdrawn."}
        </p>
        <Link
          href="/submissions"
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
        >
          Return to Submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/submissions"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6366f1]/15 text-[#818cf8]">
                Submission Audit
              </span>
              <span className="text-xs text-[#71717a] font-mono">ID: {submission._id.slice(-6)}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              {submission.projectTitle} ({submission.cutVersion})
            </h1>
          </div>
        </div>

        <Link
          href="/earnings"
          className="px-4 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all shrink-0"
        >
          View Escrow Payout
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {submission.status === 'approved' ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] font-bold border border-[#10b981]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved & Settled</span>
              </span>
            ) : submission.status === 'changes_requested' ? (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] font-bold border border-[#f59e0b]/30">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Changes Requested</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#6366f1]/15 text-[#818cf8] font-bold border border-[#6366f1]/30">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Sponsor Review</span>
              </span>
            )}
            <span className="text-xs text-[#71717a] font-mono">
              Submitted: {new Date(submission.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white font-headline">{submission.projectTitle}</h2>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Campaign: <span className="text-white font-medium">{submission.campaignTitle}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/[0.06]">
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/[0.08]">
              <div className="text-[10px] text-[#71717a] uppercase font-semibold font-mono">Bounty Payout</div>
              <div className="text-xl font-extrabold text-[#10b981] font-mono mt-0.5">
                {submission.payoutAmount}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/[0.08]">
              <div className="text-[10px] text-[#71717a] uppercase font-semibold font-mono">Cut Version</div>
              <div className="text-xl font-extrabold text-white font-mono mt-0.5">{submission.cutVersion}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/[0.08] flex flex-col justify-between">
              <div className="text-[10px] text-[#71717a] uppercase font-semibold font-mono">Rendered Video</div>
              <a
                href={submission.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#818cf8] hover:text-white inline-flex items-center gap-1 mt-1"
              >
                <span>Open Export Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Review Status & Revision Notes Form */}
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Review Status & Change Request Log
          </h3>

          {savedMsg && (
            <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{savedMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Review Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
            >
              <option value="pending_review">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="changes_requested">Changes Requested</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Notes / Brand Feedback</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Log timestamped brand feedback or revision notes..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Audit Changes'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
