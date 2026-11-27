'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  Download,
  ChevronRight
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  summary: string;
}

const LESSONS: Lesson[] = [
  { id: 'l1', title: '01. The Biological Basis of Viewer Scrolling', duration: '12:40', completed: true, summary: 'How visual pattern interrupts reset ocular dopamine receptors in 1.5 seconds.' },
  { id: 'l2', title: '02. Speed Ramping Transitions in Vertical 9:16', duration: '15:20', completed: false, summary: 'Keyframing 150% to 50% velocity curves seamlessly into timeline cuts.' },
  { id: 'l3', title: '03. Audio Transient Stems & Sound Drops', duration: '18:10', completed: false, summary: 'Sidechaining sub-bass hits with dialog to retain attention through scene changes.' },
  { id: 'l4', title: '04. Kinetic Typography Placement & Safe Zones', duration: '14:30', completed: false, summary: 'Safe zone margins avoiding TikTok icons, captions, and navigation pills.' },
];

export default function LessonDetailPage() {
  const params = useParams();
  const courseId = (params?.id as string) || 'course-01';

  const [activeLesson, setActiveLesson] = useState(LESSONS[1]); // lesson 2 selected
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/learning"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6366f1]/10 text-[#818cf8]">
                Masterclass Video Player
              </span>
              <span className="text-xs text-[#71717a] font-mono">{courseId}</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              The 0-3 Second Pattern Interrupt Masterclass
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Download Lesson Project Files</span>
          </button>
        </div>
      </header>

      {/* Main Two-Column Viewport (70% Video Player & Notes / 30% Course Curriculum Playlist) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Large Video Player & Lesson Notes */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-xl bg-[#0c0c0e] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-6 relative group">
            <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#121215] to-[#0c0c0e] border border-white/[0.08] relative flex flex-col justify-between p-4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                alt="Lesson Video Frame"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />

              <div className="z-10 flex justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/70 text-white font-mono">
                  Lesson 02 • 1080p 60fps Master
                </span>
              </div>

              {/* Center Play Button */}
              <div className="z-10 flex justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#6366f1] text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>
              </div>

              <div className="z-10 flex justify-between items-center text-xs text-white font-mono">
                <span>04:12 / {activeLesson.duration}</span>
                <span>ProRes Scrubbing Enabled</span>
              </div>
            </div>
          </div>

          {/* Lesson Synopsis */}
          <div className="p-6 rounded-xl bg-[#121215] border border-white/[0.08] space-y-3">
            <h2 className="text-base font-bold text-white font-headline">
              {activeLesson.title}
            </h2>
            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {activeLesson.summary}
            </p>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-[#71717a]">Instructor: Alex Rivera</span>
              <Link href="/toolkit" className="text-[#818cf8] hover:underline flex items-center gap-1">
                <span>Use Aspect Ratio Calculator Tool</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Course Curriculum Playlist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#121215] border border-white/[0.08]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Curriculum Lessons ({LESSONS.length})
            </h3>

            <div className="space-y-2">
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    activeLesson.id === l.id
                      ? 'bg-white/[0.08] border-[#6366f1]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${activeLesson.id === l.id ? 'text-white' : 'text-[#a1a1aa]'}`}>
                      {l.title}
                    </span>
                    {l.completed && <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />}
                  </div>
                  <div className="text-[10px] text-[#71717a] font-mono mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{l.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
