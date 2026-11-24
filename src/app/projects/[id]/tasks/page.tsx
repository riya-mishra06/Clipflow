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
  Clock
} from 'lucide-react';

interface TaskItem {
  id: string;
  label: string;
  category: string;
  completed: boolean;
}

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';

  // Real empty state: starts with standard default checklist or empty
  const [tasks, setTasks] = useState<TaskItem[]>([]);
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
        category: 'Custom',
        completed: false,
      },
    ]);
    setNewTaskText('');
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#818cf8]">Deliverables</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">Production Checklist</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Task Deliverables</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Track editing milestones, audio mixing steps, and QC checks for this cut.
          </p>
        </div>

        {/* Add Task Input */}
        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add new editing checklist item (e.g. Export clean ProRes stem)..."
            className="flex-1 bg-[#121215] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>

        {tasks.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-2 px-4">
            <CheckSquare className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No tasks in checklist</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto">
              Add your first task above to track editing progress.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-[#121215] border border-white/[0.08] divide-y divide-white/[0.06]">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 rounded border-white/[0.2] accent-[#6366f1] cursor-pointer"
                  />
                  <span className={`text-xs ${task.completed ? 'line-through text-[#71717a]' : 'text-white'}`}>
                    {task.label}
                  </span>
                </div>
                <button onClick={() => removeTask(task.id)} className="text-[#71717a] hover:text-[#f43f5e]">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
