'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  GraduationCap,
  Play,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  Award,
  Layers,
  Compass
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  instructor: string;
  lessonsCount: number;
  duration: string;
  category: 'Pacing & Hooks' | 'Audio Design' | 'Color & VFX' | 'Retention Psychology';
  level: 'Beginner' | 'Intermediate' | 'Masterclass';
  thumbnailUrl: string;
  description: string;
  completedLessons: number;
}

const COURSES: Course[] = [
  {
    id: 'course-01',
    title: 'The 0-3 Second Pattern Interrupt Masterclass',
    instructor: 'Alex Rivera (Lead Short-Form Editor)',
    lessonsCount: 8,
    duration: '1h 45m',
    category: 'Pacing & Hooks',
    level: 'Masterclass',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
    description: 'Learn the exact psychological triggers, visual speed ramps, and frame-rate cuts that keep 80%+ of viewers watching past the first 3 seconds.',
    completedLessons: 0,
  },
  {
    id: 'course-02',
    title: 'Short-Form Sound Design & -14 LUFS Mixing',
    instructor: 'Elena Rostova (Audio Engineer)',
    lessonsCount: 6,
    duration: '1h 15m',
    category: 'Audio Design',
    level: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
    description: 'How to clean voiceover stems, sidechain punchy bass drops, and optimize audio loudness for Instagram Reels and TikTok playback algorithms.',
    completedLessons: 0,
  },
  {
    id: 'course-03',
    title: 'Kinetic Typography & Dynamic Safe Zones',
    instructor: 'Marcus Vance (Motion Designer)',
    lessonsCount: 5,
    duration: '55m',
    category: 'Pacing & Hooks',
    level: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    description: 'Master 2-to-3 word pop-in subtitles, font pairing, and UI safe-zone guides so captions are never covered by like buttons or usernames.',
    completedLessons: 0,
  },
  {
    id: 'course-04',
    title: 'Color Grading 60fps Vertical ProRes Footage',
    instructor: 'Kai Chen (Senior Colorist)',
    lessonsCount: 7,
    duration: '1h 30m',
    category: 'Color & VFX',
    level: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Convert raw client camera profiles into punchy, high-contrast Rec.709 vertical grades designed specifically for OLED smartphone screens.',
    completedLessons: 0,
  },
];

export default function LearningHubPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = COURSES.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'All' || c.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#818cf8] font-semibold mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Creator Academy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Learning Hub & Masterclasses
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1 max-w-2xl">
              Level up your short-form video retention, DaVinci Resolve color workflows, and sound design to win higher-yield bounty campaigns.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-[#71717a]">Courses Available:</span>
              <span className="text-white font-bold ml-1.5">{COURSES.length} Masterclasses</span>
            </div>
          </div>
        </div>

        {/* Filter Strip */}
        <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search masterclasses, topics, or instructors..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'Pacing & Hooks', 'Audio Design', 'Color & VFX'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCat === cat
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masterclass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video bg-[#0c0c0e] overflow-hidden">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-[#818cf8] font-mono text-[10px] font-bold">
                      {course.level}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/70 text-[#a1a1aa] font-mono text-[10px]">
                      {course.category}
                    </span>
                  </div>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <h3 className="font-bold text-base text-white group-hover:text-[#818cf8] transition-colors leading-snug">
                    <Link href={`/learning/${course.id}`}>{course.title}</Link>
                  </h3>
                  <div className="text-xs text-[#71717a]">
                    Instructor: <span className="text-[#a1a1aa]">{course.instructor}</span> • {course.lessonsCount} Video Lessons
                  </div>
                  <p className="text-xs text-[#a1a1aa] leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <span className="text-[11px] text-[#71717a] font-mono">
                  {course.completedLessons} of {course.lessonsCount} Completed
                </span>

                <Link
                  href={`/learning/${course.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Course</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
