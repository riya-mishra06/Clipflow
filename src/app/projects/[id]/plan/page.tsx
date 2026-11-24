'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle2,
  Sliders,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function ProjectPlanPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-01';

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [hookIdea, setHookIdea] = useState(
    'Demonstrating instant AI face morphs with high retention sound design.'
  );

  const [scriptSections, setScriptSections] = useState([
    {
      sec: '0:00 - 0:03',
      label: 'The Pattern Interrupt Hook',
      dialogue: '"If you are still cutting vertical videos manually in 2026, stop."',
      visualCue: 'High-speed speed ramp zoom directly into timeline monitor with glitch SFX.',
    },
    {
      sec: '0:03 - 0:15',
      label: 'The Pain Point vs AI Solution',
      dialogue: '"Watch how NeonPulse tracks and grades 60fps face movements instantly without manual keyframing."',
      visualCue: 'Side-by-side comparison bar sliding across screen showing raw footage vs synthesized.',
    },
    {
      sec: '0:15 - 0:38',
      label: 'Core Feature Walkthrough',
      dialogue: '"Just drop your ProRes stem, click Glitch Sync, and let the neural engine lock onto the audio beats."',
      visualCue: 'Cursor clicks waveform, instantaneous neon glow ripples across typography.',
    },
    {
      sec: '0:38 - 0:45',
      label: 'Call To Action & Escrow Bounty Link',
      dialogue: '"Grab the project stems link in bio and start cutting today."',
      visualCue: 'Official NeonPulse CTA badge animates in lower third within platform safe zone.',
    },
  ]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRegenerateHook = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHookIdea('3 hidden AI video features that top creators never talk about.');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-[white/[0.08]]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Script & Hook Architect</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Content Plan & AI Prompts</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${projectId}/tasks`}
            className="px-3.5 py-1.5 rounded-xl bg-[white/[0.04]] hover:bg-[white/[0.08]] text-white text-xs font-semibold border border-[white/[0.08]] transition-colors"
          >
            Go to Tasks →
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Hook Generator Prompt Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#161821] to-[#121215] border border-[white/[0.08]] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#cebdff]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-headline">
                AI Hook Generator
              </h2>
            </div>

            <button
              onClick={handleRegenerateHook}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[white/[0.04]] hover:bg-[white/[0.08]] text-[#cebdff] text-xs font-semibold border border-[white/[0.08]] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Re-synthesizing...' : 'New Hook Angle'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]]">
            <span className="text-[10px] text-[#9496a1] uppercase font-bold">Selected Retention Premise:</span>
            <div className="text-base font-bold text-white mt-1">"{hookIdea}"</div>
          </div>
        </div>

        {/* Script & Visual Cue Breakdown */}
        <div className="rounded-2xl bg-[#121215] border border-[white/[0.08]] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-headline">Scene-by-Scene Pacing Blueprint</h3>
              <p className="text-xs text-[#9496a1] mt-0.5">
                Target duration: 45 seconds • Pacing: High Retention
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {scriptSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2 hover:border-[#cebdff]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[white/[0.04]] text-[#cebdff] font-mono text-[11px] font-bold">
                      {sec.sec}
                    </span>
                    <span className="text-xs font-bold text-white">{sec.label}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(`${sec.dialogue}\nVisual: ${sec.visualCue}`, idx)}
                    className="p-1.5 rounded-lg bg-[#161821] hover:bg-[white/[0.04]] text-[#9496a1] hover:text-white transition-colors"
                    title="Copy scene"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="text-xs text-[#cebdff] italic pl-2 border-l-2 border-[#cebdff]/40">
                  {sec.dialogue}
                </div>

                <div className="text-[11px] text-[#9496a1] pl-2">
                  <span className="font-semibold text-white">Visual & Audio Cue: </span>
                  {sec.visualCue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
