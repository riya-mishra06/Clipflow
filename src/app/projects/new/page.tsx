'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Layers,
  FolderPlus,
  Calendar,
  CheckCircle2,
  Film,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Route directly to the newly initialized project detail workspace
      router.push('/projects/proj-01');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/90 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Studio Setup Wizard</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Initialize Video Project</h1>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 1 ? 'bg-[#cebdff]/20 text-[#cebdff] font-semibold' : 'text-[#9496a1]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#cebdff] text-[#111318] text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            <span>Metadata</span>
          </div>
          <div className="h-px w-4 bg-[#2d2f39]" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 2 ? 'bg-[#cebdff]/20 text-[#cebdff] font-semibold' : 'text-[#9496a1]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#cebdff] text-[#111318] text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <span>Format Specs</span>
          </div>
          <div className="h-px w-4 bg-[#2d2f39]" />
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
              step >= 3 ? 'bg-[#cebdff]/20 text-[#cebdff] font-semibold' : 'text-[#9496a1]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#cebdff] text-[#111318] text-[10px] font-bold flex items-center justify-center">
              3
            </span>
            <span>AI Script Prep</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Setup Timeline Workspace</h2>
          <p className="text-xs text-[#9496a1] mt-1">
            Configure timeline resolution, link upstream bounty requirements, and prepare your AI hook engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-6">
          {/* Step 1: Project Identity */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. NeonPulse Cyberpunk Fast-Cut Edition"
                  className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Project Classification</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'campaign', label: 'Bounty Campaign', desc: 'Linked to client reward pool' },
                    { id: 'original', label: 'Original Content', desc: 'Direct channel distribution' },
                    { id: 'practice', label: 'Creator Practice', desc: 'Technique & Macro testing' },
                  ].map((kind) => (
                    <button
                      type="button"
                      key={kind.id}
                      onClick={() => setFormData({ ...formData, kind: kind.id as any })}
                      className={`p-3.5 rounded-xl border text-left transition-colors ${
                        formData.kind === kind.id
                          ? 'bg-[#cebdff]/10 border-[#cebdff] text-white'
                          : 'bg-[#161821] border-[#2d2f39] text-[#9496a1] hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{kind.label}</div>
                      <div className="text-[10px] text-[#9496a1] mt-0.5">{kind.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.campaignTitle && (
                <div className="p-3.5 rounded-xl bg-[#0c0e13] border border-[#2d2f39] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#9496a1] uppercase font-semibold">Attached Campaign</span>
                    <div className="font-bold text-white">{formData.campaignTitle}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3]">
                    Verified Specs Loaded
                  </span>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-[#cebdff]/15"
                >
                  <span>Next: Resolution & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Format & Specs */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Target Social Platform</label>
                  <select
                    value={formData.targetPlatform}
                    onChange={(e) => setFormData({ ...formData, targetPlatform: e.target.value })}
                    className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cebdff]"
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
                    className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#cebdff]"
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
                          ? 'bg-[#cebdff]/20 border-[#cebdff] text-white'
                          : 'bg-[#161821] border-[#2d2f39] text-[#9496a1] hover:text-white'
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
                  className="px-4 py-2.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-[#cebdff]/15"
                >
                  <span>Next: Concept Hook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: AI Script Prep */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#cebdff]" />
                  <span>Primary Retention Hook Concept</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.conceptHook}
                  onChange={(e) => setFormData({ ...formData, conceptHook: e.target.value })}
                  placeholder="Describe your 0-3 second opening hook..."
                  className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
                />
                <div className="text-[11px] text-[#9496a1]">
                  Our AI Script Copilot will generate kinetic typography cues and pacing markers based on this premise.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0e13] border border-[#2d2f39] space-y-2 text-xs">
                <div className="text-[#cebdff] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                  <span>Workspace Ready for Generation</span>
                </div>
                <p className="text-[#9496a1]">
                  Clicking "Launch Studio Project" will automatically create the folder structure, ingest stems, and activate your plan view.
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#cebdff] to-[#d0bcff] hover:from-[#d0bcff] hover:to-[#cebdff] text-[#111318] text-xs font-extrabold transition-colors shadow-lg shadow-[#cebdff]/20 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Timeline...</span>
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
        <div className="min-h-screen bg-[#0c0e13] text-white flex items-center justify-center text-xs">
          Loading project wizard...
        </div>
      }
    >
      <NewProjectForm />
    </Suspense>
  );
}
