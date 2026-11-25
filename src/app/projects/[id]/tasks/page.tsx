'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2
} from 'lucide-react';

interface TaskItem {
  id: string;
  label: string;
  category: string;
  completed: boolean;
}

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [projectTitle, setProjectTitle] = useState('Production Checklist');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    async function loadTasks() {
      if (!projectId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setProjectTitle(json.data.title || 'Production Checklist');
            setTasks(json.data.tasks || []);
          }
        }
      } catch (err) {
        console.error('Failed to load project tasks:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [projectId]);

  const persistTasks = async (nextTasks: TaskItem[]) => {
    setTasks(nextTasks);
    setSaving(true);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: nextTasks }),
      });
    } catch (err) {
      console.error('Failed to save tasks:', err);
    } finally {
      setSaving(false);
    }
  };

  const toggleTask = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    persistTasks(next);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const next: TaskItem[] = [
      ...tasks,
      {
        id: `t-${Date.now()}`,
        label: newTaskText.trim(),
        category: 'Production',
        completed: false,
      },
    ];
    setNewTaskText('');
    persistTasks(next);
  };

  const removeTask = (id: string) => {
    const next = tasks.filter((t) => t.id !== id);
    persistTasks(next);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-[#818cf8]">Deliverables</span>
            <h1 className="text-sm font-bold text-white tracking-tight truncate">{projectTitle}</h1>
          </div>
        </div>

        <div className="text-xs font-mono text-[#71717a] shrink-0">
          {saving ? 'Syncing...' : `${completedCount}/${tasks.length} Done`}
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Task Deliverables</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Track editing milestones, audio mixing steps, and QC checks. Changes auto-save to MongoDB Atlas.
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

        {loading ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
            <span className="text-xs text-[#71717a] font-mono">Loading Checklist...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-20 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <CheckSquare className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No checklist items yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Add your first production deliverable above (like Hook Cut, Color Grade, or -14 LUFS Audio Mix).
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-[#121215] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 text-left flex-1 min-w-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#71717a] shrink-0" />
                  )}
                  <span
                    className={`text-xs font-medium truncate ${
                      task.completed ? 'line-through text-[#71717a]' : 'text-white'
                    }`}
                  >
                    {task.label}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  title="Delete task"
                  className="p-1.5 rounded-lg text-[#71717a] hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                >
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
