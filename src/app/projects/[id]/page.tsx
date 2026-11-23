'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Play,
  Film,
  Scissors,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CheckSquare,
  Share2,
  FolderPlus,
  Sliders,
  Maximize2,
  Volume2,
  Download,
  Calendar,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || 'proj-01';

  const [activeTab, setActiveTab] = useState<'cuts' | 'timeline' | 'stems'>('cuts');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Studio Workstation Header */}
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
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#cebdff]/20 text-[#cebdff] border border-[#cebdff]/30">
                Active Cutting
              </span>
              <span className="text-xs text-[#9496a1] font-mono">{projectId}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">
              NeonPulse AI Glitch Cuts Pack
            </h1>
          </div>
        </div>

        {/* Sub-nav routing within this project */}
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${projectId}/plan`}
            className="px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] text-xs font-semibold border border-[#2d2f39] flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Script Plan</span>
          </Link>
          <Link
            href={`/projects/${projectId}/tasks`}
            className="px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39] flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist</span>
          </Link>
          <Link
            href={`/projects/${projectId}/drafts`}
            className="px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39] flex items-center gap-1.5 transition-colors"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Draft Exports</span>
          </Link>

          <Link
            href="/submissions"
            className="px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10"
          >
            Submit to Bounty
          </Link>
        </div>
      </header>

      {/* Main Studio Viewport (65% Video Player & Timeline / 35% Cuts Manager & Stems) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Interactive Preview Player & Timeline Tracks */}
        <div className="lg:col-span-8 space-y-6">
          {/* 9:16 Video Player Container */}
          <div className="relative rounded-2xl bg-[#0c0e13] border border-[#2d2f39] overflow-hidden flex flex-col items-center justify-center p-8 min-h-[460px]">
            {/* Visual Screen frame representing 9:16 phone screen */}
            <div className="w-[260px] h-[460px] rounded-2xl bg-gradient-to-b from-[#161821] to-[#111318] border border-[#3b3d4a] relative shadow-2xl flex flex-col justify-between p-4 overflow-hidden group">
              {/* Overlay Safe Area markers */}
              <div className="absolute inset-0 border border-dashed border-[#cebdff]/20 pointer-events-none rounded-2xl m-3" />

              {/* Top tag in player */}
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-white font-mono">
                  Cut 01 • 00:45.00
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] font-bold">
                  60 FPS
                </span>
              </div>

              {/* Center Play Graphic */}
              <div className="flex flex-col items-center justify-center space-y-2 z-10">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#cebdff] text-[#111318] flex items-center justify-center shadow-lg shadow-[#cebdff]/30 hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <div className="text-[11px] font-semibold text-white/90">
                  {isPlaying ? 'Playing Preview' : 'Click to Play Cut 01'}
                </div>
              </div>

              {/* Bottom Captions Overlay */}
              <div className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-center z-10 space-y-1">
                <span className="text-[11px] font-extrabold text-[#d0bcff] uppercase tracking-wide">
                  "AI face-tracking in 2 clicks"
                </span>
                <div className="text-[9px] text-[#9496a1]">Kinetic Pop-In Typography</div>
              </div>
            </div>

            {/* Playback Transport Bar */}
            <div className="w-full mt-6 pt-4 border-t border-[#2d2f39] flex items-center justify-between text-xs text-[#9496a1]">
              <div className="flex items-center gap-4">
                <span className="text-white font-mono font-medium">00:14.28 / 00:45.00</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2029] text-[#cebdff]">ProRes 422</span>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>

          {/* Timeline Cuts Scrubber Tracks */}
          <div className="rounded-2xl bg-[#111318] border border-[#2d2f39] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-[#cebdff]" />
                <span>Multi-Layer Timeline Tracks</span>
              </span>
              <span className="text-[#9496a1]">Zoom: 100%</span>
            </div>

            {/* Simulated Tracks */}
            <div className="space-y-2 pt-2 text-[11px]">
              {/* Track V1 */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[#9496a1] font-mono">V1</span>
                <div className="flex-1 h-7 rounded-lg bg-[#1e2029] border border-[#2d2f39] flex items-center px-3 relative overflow-hidden">
                  <div className="w-2/5 h-full bg-[#cebdff]/20 border-r border-[#cebdff] flex items-center px-2 text-[#cebdff] font-semibold truncate">
                    B-Roll Synth Hook [0:00 - 0:18]
                  </div>
                  <div className="w-3/5 h-full bg-[#cebdff]/10 flex items-center px-2 text-[#9496a1] truncate">
                    Fast Face Track Comparisons [0:18 - 0:45]
                  </div>
                </div>
              </div>

              {/* Track A1 */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[#9496a1] font-mono">A1</span>
                <div className="flex-1 h-7 rounded-lg bg-[#1e2029] border border-[#2d2f39] flex items-center px-3 relative overflow-hidden">
                  <div className="w-full h-full bg-[#4edea3]/15 flex items-center px-2 text-[#4edea3] font-semibold">
                    Voiceover_Binaural_Master.wav (-14 LUFS)
                  </div>
                </div>
              </div>

              {/* Track SFX */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[#9496a1] font-mono">SFX</span>
                <div className="flex-1 h-7 rounded-lg bg-[#1e2029] border border-[#2d2f39] flex items-center px-3 gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#9d4edd]/30 text-[#cebdff] text-[10px]">Glitch Drop</span>
                  <span className="px-2 py-0.5 rounded bg-[#9d4edd]/30 text-[#cebdff] text-[10px]">Riser</span>
                  <span className="px-2 py-0.5 rounded bg-[#9d4edd]/30 text-[#cebdff] text-[10px]">Sub Bass Hit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Studio Cuts List & Linked Campaign Bounty */}
        <div className="lg:col-span-4 space-y-6">
          {/* Linked Bounty Information Card */}
          <div className="p-5 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#9496a1] uppercase font-bold tracking-wider">
                Target Bounty Program
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] font-semibold">
                $140 / approved cut
              </span>
            </div>

            <h3 className="text-sm font-bold text-white hover:text-[#cebdff] transition-colors">
              <Link href="/campaigns/camp-01">NeonPulse AI Video Synthesizer Launch →</Link>
            </h3>

            <div className="text-xs text-[#9496a1] space-y-1">
              <div>Deadline: <span className="text-[#ffb4ab] font-medium">Nov 28, 2026 (4d left)</span></div>
              <div>Aspect: <span className="text-white font-mono">9:16 Vertical (60fps)</span></div>
            </div>
          </div>

          {/* Cuts Version Switcher */}
          <div className="rounded-2xl bg-[#111318] border border-[#2d2f39] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
                Project Cuts (3)
              </h4>
              <button className="text-[11px] text-[#cebdff] hover:underline flex items-center gap-1">
                <span>+ Add Cut Variant</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Cut 01: Fast Glitch Intro', status: 'Ready for Review', length: '0:45', active: true },
                { title: 'Cut 02: POV Creator Tutorial', status: 'In Progress', length: '0:52', active: false },
                { title: 'Cut 03: Before/After Hook', status: 'Draft Staged', length: '0:34', active: false },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition-colors flex items-center justify-between cursor-pointer ${
                    c.active
                      ? 'bg-[#1e2029] border-[#cebdff]'
                      : 'bg-[#0c0e13] border-[#2d2f39] hover:border-[#3b3d4a]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{c.title}</div>
                    <div className="text-[10px] text-[#9496a1]">
                      {c.length} • <span className="text-[#4edea3]">{c.status}</span>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#9496a1]" />
                </div>
              ))}
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="p-4 rounded-xl bg-[#161821] border border-[#2d2f39] space-y-2.5">
            <div className="text-xs font-semibold text-white">Next Workflow Stages:</div>
            <div className="space-y-1.5 text-xs">
              <Link
                href={`/projects/${projectId}/plan`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0c0e13] hover:bg-[#1e2029] text-[#cebdff] transition-colors"
              >
                <span>Edit Script & Hook Prompts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/projects/${projectId}/tasks`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0c0e13] hover:bg-[#1e2029] text-[#9496a1] hover:text-white transition-colors"
              >
                <span>Complete Deliverables Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/projects/${projectId}/drafts`}
                className="flex items-center justify-between p-2 rounded-lg bg-[#0c0e13] hover:bg-[#1e2029] text-[#9496a1] hover:text-white transition-colors"
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
