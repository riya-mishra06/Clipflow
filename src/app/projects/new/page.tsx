'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  FolderPlus,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCampaignId = searchParams?.get('campaignId') || '';
  const initialCampaignTitle = searchParams?.get('campaignTitle') || '';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    title: initialCampaignTitle ? `${initialCampaignTitle} Cut` : '',
    campaignId: initialCampaignId,
    campaignTitle: initialCampaignTitle || 'Custom Direct Cut',
    kind: (initialCampaignId ? 'campaign' : 'original') as 'campaign' | 'original' | 'practice',
    targetPlatform: 'Instagram Reels & TikTok',
    aspectRatio: '9:16 Vertical',
    targetDuration: '45 seconds',
    conceptHook: 'Show unexpected 0-to-1 visual transformation within 2.5 seconds',
    resolution: '1080x1920 (60fps)',
    estPayout: '$140.00',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create project in database');
      }

      // Route directly to projects list or project workspace
      router.push('/projects');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#818cf8]">Studio Setup Wizard</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Initialize Video Project</h1>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 1 ? 'bg-[#6366f1]/20 text-[#818cf8] font-semibold' : 'text-[#71717a]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#6366f1] text-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            <span>Metadata</span>
          </div>
          <div className="h-px w-4 bg-white/[0.08]" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 2 ? 'bg-[#6366f1]/20 text-[#818cf8] font-semibold' : 'text-[#71717a]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#6366f1] text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <span>Format Specs</span>
          </div>
          <div className="h-px w-4 bg-white/[0.08]" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 3 ? 'bg-[#6366f1]/20 text-[#818cf8] font-semibold' : 'text-[#71717a]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#6366f1] text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
            <span>Hook Strategy</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-10">
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Metadata */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Project / Cut Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NeonPulse AI Launch - Hook Variant A"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Project Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'campaign', label: 'Bounty Campaign', desc: 'Direct brand sponsor cut' },
                    { id: 'original', label: 'Original Project', desc: 'Creator owned content' },
                    { id: 'practice', label: 'Practice Cut', desc: 'Non-commercial edit' },
                  ].map((kind) => (
                    <button
                      type="button"
                      key={kind.id}
                      onClick={() => setFormData({ ...formData, kind: kind.id as any })}
                      className={`p-3 rounded-xl border text-left transition-colors ${
                        formData.kind === kind.id
                          ? 'bg-[#6366f1]/20 border-[#6366f1] text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#71717a] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{kind.label}</div>
                      <div className="text-[10px] text-[#71717a] mt-0.5">{kind.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.campaignTitle && (
                <div className="p-3.5 rounded-xl bg-[#09090b] border border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#71717a] uppercase font-semibold">Attached Campaign</span>
                    <div className="font-bold text-white">{formData.campaignTitle}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981]">
                    Verified Specs Loaded
                  </span>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.title.trim()) {
                      setError('Please enter a project title before continuing.');
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-[#6366f1]/20"
                >
                  <span>Next: Resolution & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Format & Specs */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Target Social Platform</label>
                  <select
                    value={formData.targetPlatform}
                    onChange={(e) => setFormData({ ...formData, targetPlatform: e.target.value })}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="Instagram Reels & TikTok">Instagram Reels & TikTok (9:16)</option>
                    <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
                    <option value="YouTube Long-Form">YouTube Long-Form (16:9)</option>
                    <option value="Cross-Platform Multi-Aspect">Cross-Platform Multi-Aspect</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Framerate & Canvas Resolution</label>
                  <select
                    value={formData.resolution}
                    onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                    className="w-full bg-[#121215] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  >
                    <option value="1080x1920 (60fps)">1080x1920 @ 60 FPS (Recommended)</option>
                    <option value="4K UHD 2160x3840 (60fps)">4K UHD 2160x3840 @ 60 FPS</option>
                    <option value="1080x1920 (30fps)">1080x1920 @ 30 FPS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Target Video Cut Duration</label>
                <div className="grid grid-cols-3 gap-3">
                  {['30 seconds', '45 seconds', '60 seconds'].map((dur) => (
                    <button
                      type="button"
                      key={dur}
                      onClick={() => setFormData({ ...formData, targetDuration: dur })}
                      className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                        formData.targetDuration === dur
                          ? 'bg-[#6366f1]/20 border-[#6366f1] text-white'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#71717a] hover:text-white'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#71717a] hover:text-white text-xs font-medium border border-white/[0.08]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-[#6366f1]/20"
                >
                  <span>Next: Concept Hook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Script Prep & Submit */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
                  <span>Primary Retention Hook Concept</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.conceptHook}
                  onChange={(e) => setFormData({ ...formData, conceptHook: e.target.value })}
                  placeholder="Describe your 0-3 second opening hook..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
                <div className="text-[11px] text-[#71717a]">
                  Our AI Script Copilot will generate kinetic typography cues and pacing markers based on this premise.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090b] border border-white/[0.08] space-y-2 text-xs">
                <div className="text-[#818cf8] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <span>Workspace Ready for Generation</span>
                </div>
                <p className="text-[#71717a]">
                  Clicking &ldquo;Launch Studio Project&rdquo; will save this cut to your MongoDB Atlas cluster and initialize your video pipeline.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#71717a] hover:text-white text-xs font-medium border border-white/[0.08]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-extrabold transition-colors shadow-lg shadow-[#6366f1]/20 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Atlas...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span>Launch Studio Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center text-xs">
          Loading project wizard...
        </div>
      }
    >
      <NewProjectForm />
    </Suspense>
  );
}
