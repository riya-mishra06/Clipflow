'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface TaskItem {
  id: string;
  label: string;
  category: 'Footage' | 'Audio' | 'Graphics' | 'Review';
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', label: 'Ingest raw 4K ProRes stems from campaign download pack', category: 'Footage', completed: true, priority: 'High' },
  { id: 't2', label: 'Cut 0-3 second pattern interrupt hook with 150% speed ramp', category: 'Footage', completed: true, priority: 'High' },
  { id: 't3', label: 'Mix voiceover loudness to -14 LUFS standard', category: 'Audio', completed: false, priority: 'High' },
  { id: 't4', label: 'Design dynamic kinetic captions in Plus Jakarta Sans', category: 'Graphics', completed: false, priority: 'Medium' },
  { id: 't5', label: 'Add NeonPulse vector CTA badge in bottom safe zone', category: 'Graphics', completed: false, priority: 'High' },
  { id: 't6', label: 'Final export check for 1080x1920 @ 60 FPS delivery', category: 'Review', completed: false, priority: 'High' },
];

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-01';

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    setTasks((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        label: newTaskText.trim(),
        category: 'Footage',
        completed: false,
        priority: 'Medium',
      },
    ]);
    setNewTaskText('');
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/90 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Milestone Checklist</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Production Tasks</h1>
          </div>
        </div>

        <Link
          href={`/projects/${projectId}/drafts`}
          className="px-3.5 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] hover:text-white text-xs font-semibold border border-[#2d2f39] flex items-center gap-1.5 transition-colors"
        >
          <span>View Render Drafts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Progress Card */}
        <div className="p-6 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Production Deliverables Completion</span>
            <span className="text-xs font-bold text-[#cebdff] font-mono">
              {completedCount} of {tasks.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#0c0e13] overflow-hidden border border-[#2d2f39]/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9d4edd] to-[#cebdff] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Task Input */}
        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add new editing checklist item (e.g. Export clean ProRes stem)..."
            className="flex-1 bg-[#111318] border border-[#2d2f39] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#9496a1] focus:outline-none focus:border-[#cebdff]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="rounded-2xl bg-[#111318] border border-[#2d2f39] divide-y divide-[#2d2f39]">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-[#161821]/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-4 h-4 rounded border-[#2d2f39] accent-[#cebdff] cursor-pointer"
                />
                <span
                  className={`text-xs ${
                    task.completed ? 'line-through text-[#9496a1]' : 'text-white font-medium'
                  }`}
                >
                  {task.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1e2029] text-[#cebdff] font-semibold">
                  {task.category}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-1 rounded text-[#9496a1] hover:text-[#ffb4ab] transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
