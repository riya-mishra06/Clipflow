'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Play,
  Film,
  Scissors,
  AlertCircle,
  CheckSquare,
  Volume2,
  Maximize2,
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface ProjectDetail {
  _id: string;
  title: string;
  kind: 'campaign' | 'practice' | 'original';
  status: 'planned' | 'active' | 'in_review' | 'completed' | 'archived';
  campaignId?: string;
  campaignTitle?: string;
  brief?: string;
  targetPlatform: string;
  aspectRatio: string;
  targetDuration?: string;
  resolution?: string;
  conceptHook?: string;
  estPayout?: string;
  deadlineDays?: number;
  deadlineDate?: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchProjectDetail() {
      if (!projectId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Project not found');
        }

        setProject(json.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load project workspace');
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetail();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
        <div className="text-xs text-[#71717a] font-mono">
          Loading project timeline from Atlas...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-lg font-bold text-white">Project Not Found</div>
        <p className="text-xs text-[#71717a] max-w-sm">
          {error || "The project workspace you requested doesn't exist or has been archived."}
        </p>
        <Link
          href="/projects"
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
        >
          Return to Active Projects
        </Link>
      </div>
    );
  }

  const shortId = project._id.slice(-6);
  const fpsBadge = project.resolution?.includes('30fps') ? '30 FPS' : '60 FPS';
  const durationLabel = project.targetDuration || '45 seconds';

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Studio Workstation Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/30">
                {project.status.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-[#71717a] font-mono">ID: {shortId}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Sub-nav routing within this project */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/projects/${project._id}/plan`}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#818cf8] text-xs font-semibold border border-white/[0.08] flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Script Plan</span>
          </Link>
          <Link
            href={`/projects/${project._id}/tasks`}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-white text-xs font-medium border border-white/[0.08] flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist</span>
          </Link>
          <Link
            href={`/projects/${project._id}/drafts`}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#a1a1aa] hover:text-white text-xs font-medium border border-white/[0.08] flex items-center gap-1.5 transition-colors"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Draft Exports</span>
          </Link>

          <Link
            href={`/submissions?projectId=${project._id}`}
            className="px-4 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all shadow-md shadow-[#6366f1]/20"
          >
            Submit to Bounty
          </Link>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Interactive Preview Player & Timeline Tracks */}
        <div className="lg:col-span-8 space-y-6">
          {/* 9:16 Video Player Container */}
          <div className="relative rounded-2xl bg-[#121215] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-8 min-h-[460px]">
            {/* Visual Screen frame representing 9:16 phone screen */}
            <div className="w-[260px] h-[460px] rounded-2xl bg-gradient-to-b from-[#18181b] to-[#09090b] border border-white/[0.12] relative shadow-2xl flex flex-col justify-between p-4 overflow-hidden group">
              {/* Overlay Safe Area markers */}
              <div className="absolute inset-0 border border-dashed border-[#6366f1]/25 pointer-events-none rounded-2xl m-3" />

              {/* Top tag in player */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-white font-mono">
                  Cut 01 • {durationLabel}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                  {fpsBadge}
                </span>
              </div>

              {/* Center Play Graphic */}
              <div className="flex flex-col items-center justify-center space-y-2 z-10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#6366f1] text-white flex items-center justify-center shadow-lg shadow-[#6366f1]/30 hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <div className="text-[11px] font-semibold text-white/90">
                  {isPlaying ? 'Playing Preview' : 'Click to Play Cut 01'}
                </div>
              </div>

              {/* Bottom Captions / Hook Overlay */}
              <div className="p-2.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-center z-10 space-y-1">
                <span className="text-[11px] font-bold text-[#818cf8] leading-snug block line-clamp-2">
                  {project.conceptHook || 'No opening retention hook configured yet'}
                </span>
                <div className="text-[9px] text-[#71717a] uppercase tracking-wider font-mono">
                  {project.targetPlatform}
                </div>
              </div>
            </div>

            {/* Playback Transport Bar */}
            <div className="w-full mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#71717a]">
              <div className="flex items-center gap-4">
                <span className="text-white font-mono font-medium">
                  00:00.00 / {durationLabel}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#818cf8] font-mono">
                  {project.resolution || '1080x1920 (60fps)'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>

          {/* Timeline Cuts Scrubber Tracks */}
          <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-[#818cf8]" />
                <span>Timeline Track Staging</span>
              </span>
              <span className="text-[#71717a] font-mono">{project.aspectRatio}</span>
            </div>

            <div className="space-y-2 pt-2 text-[11px]">
              {/* Track V1 */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[#71717a] font-mono">V1</span>
                <div className="flex-1 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center px-3 relative overflow-hidden">
                  <div className="w-2/5 h-full bg-[#6366f1]/20 border-r border-[#6366f1] flex items-center px-2 text-[#818cf8] font-semibold truncate">
                    Opening Hook (0-3s)
                  </div>
                  <div className="w-3/5 h-full bg-[#6366f1]/10 flex items-center px-2 text-[#71717a] truncate">
                    Main Body Cut ({durationLabel})
                  </div>
                </div>
              </div>

              {/* Track A1 */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[#71717a] font-mono">A1</span>
                <div className="flex-1 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center px-3 relative overflow-hidden">
                  <div className="w-full h-full bg-[#10b981]/15 flex items-center px-2 text-[#10b981] font-semibold">
                    Primary Audio / Voiceover (-14 LUFS Target)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Project Specs & Linked Campaign */}
        <div className="lg:col-span-4 space-y-6">
          {/* Linked Campaign / Bounty Information Card */}
          <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#71717a] uppercase font-bold tracking-wider font-mono">
                {project.kind === 'campaign' ? 'Linked Bounty Program' : `${project.kind} Project`}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-semibold font-mono">
                {project.estPayout || '$140.00'}
              </span>
            </div>

            {project.campaignId ? (
              <Link
                href={`/campaigns/${project.campaignId}`}
                className="text-sm font-bold text-white hover:text-[#818cf8] transition-colors flex items-center gap-1.5"
              >
                <span>{project.campaignTitle || 'View Linked Campaign'}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </Link>
            ) : (
              <h3 className="text-sm font-bold text-white">
                {project.campaignTitle || 'Custom Direct Cut'}
              </h3>
            )}

            <div className="text-xs text-[#71717a] space-y-1.5 pt-2 border-t border-white/[0.06]">
              <div className="flex justify-between">
                <span>Platform:</span>
                <span className="text-white font-medium">{project.targetPlatform}</span>
              </div>
              <div className="flex justify-between">
                <span>Aspect Ratio:</span>
                <span className="text-white font-mono">{project.aspectRatio}</span>
              </div>
              <div className="flex justify-between">
                <span>Resolution:</span>
                <span className="text-white font-mono">{project.resolution || '1080x1920 (60fps)'}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Duration:</span>
                <span className="text-white font-mono">{durationLabel}</span>
              </div>
              {project.deadlineDays && (
                <div className="flex justify-between">
                  <span>Deadline:</span>
                  <span className="text-[#f59e0b] font-medium">{project.deadlineDays} days left</span>
                </div>
              )}
            </div>
          </div>

          {/* Retention Hook Card */}
          <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-headline">
              <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
              <span>Retention Hook Concept</span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {project.conceptHook || 'No hook concept defined for this cut yet.'}
            </p>
          </div>

          {/* Direct Navigation Links */}
          <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08] space-y-2.5">
            <div className="text-xs font-semibold text-white">Next Workflow Stages:</div>
            <div className="space-y-1.5 text-xs">
              <Link
                href={`/projects/${project._id}/plan`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] hover:bg-white/[0.04] text-[#818cf8] transition-colors"
              >
                <span>Edit Script & Hook Prompts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/projects/${project._id}/tasks`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] hover:bg-white/[0.04] text-[#a1a1aa] hover:text-white transition-colors"
              >
                <span>Complete Deliverables Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/projects/${project._id}/drafts`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#09090b] hover:bg-white/[0.04] text-[#a1a1aa] hover:text-white transition-colors"
              >
                <span>Manage Versioned Render Exports</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
