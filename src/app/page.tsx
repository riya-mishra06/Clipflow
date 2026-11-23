'use client';

import { useState } from 'react';
import { 
  Compass, 
  FolderKanban, 
  HardDrive, 
  CheckSquare, 
  Layers, 
  TrendingUp, 
  Wrench, 
  GraduationCap, 
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'projects' | 'assets' | 'tasks'>('dashboard');

  return (
    <div className="flex h-screen bg-studio-950 text-slate-100 antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-studio-border bg-studio-900/60 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-studio-border">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              CF
            </div>
            <span className="font-semibold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Clipflow
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Workflow</div>
            
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'dashboard' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-studio-850 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'campaigns' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-studio-850 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Campaign Discovery</span>
            </button>

            <button 
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'projects' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-studio-850 hover:text-slate-200'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Project Workspace</span>
            </button>

            <button 
              onClick={() => setActiveTab('assets')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'assets' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-studio-850 hover:text-slate-200'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Raw Data Store</span>
            </button>

            <button 
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'tasks' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-studio-850 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tasks & Deadlines</span>
            </button>

            <div className="pt-4 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Productivity & Growth</div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                <Wrench className="w-4 h-4" />
                <span>Editing Toolkit</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                <GraduationCap className="w-4 h-4" />
                <span>Learning Hub</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                <Layers className="w-4 h-4" />
                <span>Reference Library</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 cursor-not-allowed">
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant (Later)</span>
              </div>
            </div>
          </nav>
        </div>

        {/* User profile / footer */}
        <div className="p-4 border-t border-studio-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-medium text-xs">
              RM
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-200 truncate">Riya Mishra</p>
              <p className="text-xs text-slate-400 truncate">Solo Creator · Next.js & Mongo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Header */}
        <header className="h-16 border-b border-studio-border px-8 flex items-center justify-between bg-studio-900/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-100 font-medium capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-600/20">
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-studio-border bg-studio-900/50">
                  <span className="text-xs font-medium text-slate-400">Active Projects</span>
                  <div className="text-2xl font-bold mt-1 text-slate-100">3</div>
                  <span className="text-xs text-emerald-400 mt-2 block">1 deadline today</span>
                </div>
                <div className="p-5 rounded-xl border border-studio-border bg-studio-900/50">
                  <span className="text-xs font-medium text-slate-400">Campaigns Tracked</span>
                  <div className="text-2xl font-bold mt-1 text-slate-100">8</div>
                  <span className="text-xs text-indigo-400 mt-2 block">2 new discovered</span>
                </div>
                <div className="p-5 rounded-xl border border-studio-border bg-studio-900/50">
                  <span className="text-xs font-medium text-slate-400">Pending Submissions</span>
                  <div className="text-2xl font-bold mt-1 text-slate-100">2</div>
                  <span className="text-xs text-amber-400 mt-2 block">Awaiting client review</span>
                </div>
                <div className="p-5 rounded-xl border border-studio-border bg-studio-900/50">
                  <span className="text-xs font-medium text-slate-400">Est. Payouts (Month)</span>
                  <div className="text-2xl font-bold mt-1 text-emerald-400">$650.00</div>
                  <span className="text-xs text-slate-400 mt-2 block">Across 4 approved clips</span>
                </div>
              </div>

              {/* Active Campaigns Feed Preview */}
              <div className="rounded-xl border border-studio-border bg-studio-900/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base text-slate-100">Latest Opportunities (Whop & Content Rewards)</h3>
                  <button onClick={() => setActiveTab('campaigns')} className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-studio-850/60 border border-studio-border flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">Whop</span>
                        <h4 className="font-medium text-sm text-slate-100">SaaS Founder Podcast Highlights</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Clip 45-60s moments with viral retention hooks.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-emerald-400">$80 / clip</span>
                      <span className="block text-xs text-slate-500">Due Dec 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="rounded-xl border border-studio-border bg-studio-900/40 p-6">
              <h3 className="font-semibold text-lg text-slate-100 mb-2">Campaign Discovery Feed</h3>
              <p className="text-sm text-slate-400">Discover clipping opportunities from verified sources or add campaigns manually by URL.</p>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="rounded-xl border border-studio-border bg-studio-900/40 p-6">
              <h3 className="font-semibold text-lg text-slate-100 mb-2">Editing Project Workspace</h3>
              <p className="text-sm text-slate-400">Track briefs, raw source material, content plans, tasks, draft versions, and export files.</p>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="rounded-xl border border-studio-border bg-studio-900/40 p-6">
              <h3 className="font-semibold text-lg text-slate-100 mb-2">Raw Data Store</h3>
              <p className="text-sm text-slate-400">Manage footage, audio, transcripts, and external Google Drive links reusable across projects.</p>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="rounded-xl border border-studio-border bg-studio-900/40 p-6">
              <h3 className="font-semibold text-lg text-slate-100 mb-2">Tasks & Calendar</h3>
              <p className="text-sm text-slate-400">Stay ahead of editing deadlines, review dates, and scheduled releases.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
