'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Trash2,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';

interface SubmissionItem {
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
}

interface ProjectOption {
  _id: string;
  title: string;
  campaignId?: string;
  campaignTitle?: string;
  estPayout?: string;
}

interface CampaignOption {
  _id: string;
  title: string;
  baseRate: number;
}

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const prefillProjectId = searchParams?.get('projectId') || '';

  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'changes_requested'>('all');

  // New Submission Modal State
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(prefillProjectId);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [cutVersion, setCutVersion] = useState('v1.0');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Withdraw confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<SubmissionItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadSubmissions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.set('status', statusFilter);

        const res = await fetch(`/api/submissions?${params.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setSubmissions(json.data || []);
        } else {
          setSubmissions([]);
        }
      } catch (err) {
        console.error('Failed to load submissions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, [statusFilter]);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [projRes, campRes] = await Promise.all([
          fetch('/api/projects', { cache: 'no-store' }),
          fetch('/api/campaigns', { cache: 'no-store' }),
        ]);

        if (projRes.ok) {
          const pj = await projRes.json();
          const list: ProjectOption[] = pj.data || [];
          setProjects(list);

          if (prefillProjectId) {
            const match = list.find((p) => p._id === prefillProjectId);
            if (match) {
              setSelectedProjectId(match._id);
              if (match.campaignId) setSelectedCampaignId(match.campaignId);
              setShowModal(true);
            }
          }
        }

        if (campRes.ok) {
          const cj = await campRes.json();
          setCampaigns(cj.data || []);
        }
      } catch {
        // Ignore dropdown preload errors
      }
    }
    loadOptions();
  }, [prefillProjectId]);

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const project = projects.find((p) => p._id === selectedProjectId);
    const campaign = campaigns.find((c) => c._id === selectedCampaignId);

    if (!project) {
      setFormError('Please select a project cut to submit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          projectTitle: project.title,
          campaignId: campaign?._id || project.campaignId || undefined,
          campaignTitle: campaign?.title || project.campaignTitle || 'Direct Brand Submission',
          videoUrl: videoUrl.trim(),
          cutVersion: cutVersion.trim() || 'v1.0',
          notes: notes.trim(),
          payoutAmount: campaign ? `$${campaign.baseRate}.00` : project.estPayout || '$140.00',
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit cut');
      }

      setSubmissions((prev) => [json.data, ...prev]);
      setShowModal(false);
      setVideoUrl('');
      setNotes('');
    } catch (err: any) {
      setFormError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionItem['status']) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const json = await res.json();
        setSubmissions((prev) =>
          prev.map((item) => (item._id === id ? json.data : item))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const confirmWithdraw = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/submissions/${deleteTarget._id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Withdraw failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: SubmissionItem['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'changes_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            <RotateCcw className="w-3 h-3" />
            <span>Changes Requested</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
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
              Review & Submission Tracker
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Deliver finished cuts to brand bounties, track sponsor approvals, and monitor payout eligibility.
            </p>
          </div>

          <button
            onClick={() => {
              setFormError(null);
              setShowModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors shadow-md shadow-[#6366f1]/20 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Submission</span>
          </button>
        </div>

        {/* Status Filter Bar */}
        <div className="p-2.5 rounded-xl bg-[#121215] border border-white/[0.08] flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All Submissions' },
              { id: 'pending_review', label: 'Pending Review' },
              { id: 'approved', label: 'Approved' },
              { id: 'changes_requested', label: 'Changes Requested' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                  : 'text-[#71717a] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading / Empty / List */}
        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">Loading Submissions from Atlas...</div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Send className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No active submissions</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              When you finish a video cut from your projects, submit its link here to track brand review and escrow payout.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit First Cut</span>
              </button>
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
            {submissions.map((sub) => (
              <div
                key={sub._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getStatusBadge(sub.status)}
                    <span className="text-xs font-mono text-[#71717a] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                      {sub.cutVersion}
                    </span>
                    <span className="text-xs text-[#71717a] font-mono">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">{sub.projectTitle}</h3>
                  <div className="text-xs text-[#71717a]">
                    Campaign: <span className="text-[#a1a1aa]">{sub.campaignTitle}</span>
                  </div>
                  {sub.notes && (
                    <p className="text-xs text-[#71717a] line-clamp-1 pt-0.5">{sub.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap shrink-0">
                  <div className="text-right mr-2">
                    <div className="text-[10px] uppercase font-bold text-[#71717a]">Payout</div>
                    <div className="text-sm font-extrabold text-[#10b981] font-mono">{sub.payoutAmount}</div>
                  </div>

                  <select
                    value={sub.status}
                    onChange={(e) => handleStatusChange(sub._id, e.target.value as any)}
                    className="bg-[#09090b] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                    title="Update review status"
                  >
                    <option value="pending_review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="changes_requested">Changes Requested</option>
                  </select>

                  <a
                    href={sub.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-white border border-white/[0.08] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Watch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setDeleteTarget(sub)}
                    title="Withdraw submission"
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/15 text-[#a1a1aa] hover:text-red-400 border border-white/[0.08] hover:border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">Submit Cut for Review</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Select Project Cut *</label>
                <select
                  required
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    const p = projects.find((item) => item._id === e.target.value);
                    if (p?.campaignId) setSelectedCampaignId(p.campaignId);
                  }}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="">Choose a project...</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                {projects.length === 0 && (
                  <p className="text-[11px] text-[#f59e0b]">
                    No projects found.{' '}
                    <Link href="/projects/new" className="underline">
                      Create a project first
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Target Campaign (Optional)</label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="">Direct / Custom Submission</option>
                  {campaigns.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} (${c.baseRate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-white">Rendered Video URL *</label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Version</label>
                  <input
                    type="text"
                    value={cutVersion}
                    onChange={(e) => setCutVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Submission Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Added 60fps kinetic captions and -14 LUFS audio master..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Cut'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-headline">Withdraw submission?</h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Are you sure you want to withdraw <span className="text-white font-semibold">{deleteTarget.projectTitle}</span> ({deleteTarget.cutVersion})?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmWithdraw}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                {deleting ? 'Withdrawing...' : 'Yes, Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        </div>
      }
    >
      <SubmissionsContent />
    </Suspense>
  );
}
