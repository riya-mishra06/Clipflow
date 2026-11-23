'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Film,
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
  Plus,
  LogIn,
  LogOut,
  Search,
  Bell,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Play,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Send,
  Library,
  Settings,
  MoreVertical,
  Activity
} from 'lucide-react';

interface CampaignItem {
  _id: string;
  title: string;
  brand: string;
  category: string;
  payout: string;
  payoutMax?: number;
  deadline: string;
  requirements: string[];
  status: string;
  saved?: boolean;
}

interface ProjectItem {
  _id: string;
  title: string;
  type: string;
  status: string;
  deadline: string;
  currentStep: string;
  progressPercent: number;
  timelineCode?: string;
  spec?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ displayName: string; email: string } | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'default' | 'empty' | 'skeleton'>('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Live state
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial user & data fetch
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    Promise.all([
      fetch('/api/campaigns').then((r) => (r.ok ? r.json() : { data: [] })),
      fetch('/api/projects').then((r) => (r.ok ? r.json() : { data: [] })),
    ])
      .then(([campRes, projRes]) => {
        setCampaigns(campRes.data || []);
        setProjects(projRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/me', { method: 'POST' });
    setUser(null);
    router.push('/login');
  }

  const toggleBookmark = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c._id === id ? { ...c, saved: !c.saved } : c))
    );
  };

  // Curated fallback if DB is empty for demo view
  const displayCampaigns = campaigns.length > 0 ? campaigns : [
    {
      _id: 'c1',
      title: 'B2B AI Noise-Cancelling Earbuds - 30s Hook & B-Roll UGC',
      brand: 'TechPulse Audio',
      category: 'SaaS / Hardware',
      payout: '$180 - $350 / cut',
      deadline: 'Nov 02 (8 days left)',
      requirements: ['Verified UGC creator with 5k+ avg views', '4K native cuts with kinetic captions'],
      status: 'Open',
      saved: false,
    },
    {
      _id: 'c2',
      title: 'Dynamic Kinetic Workout Vlog Clipper - 4K High-Energy Reel',
      brand: 'Apex Hydration',
      category: 'Fitness / Nutrition',
      payout: '$250 flat + bonus',
      deadline: 'Oct 29 (4 days left)',
      requirements: ['Fast-paced speed ramps', 'Audio-synced bass drops'],
      status: 'Open',
      saved: true,
    },
    {
      _id: 'c3',
      title: 'Before/After LUT Breakdown & Color Grading Showcase',
      brand: 'Lumina VFX Tools',
      category: 'Presets & Overlays',
      payout: '$120 / asset',
      deadline: 'Nov 08 (14 days left)',
      requirements: ['DaVinci or Premiere node tree workflow demonstration'],
      status: 'Open',
      saved: false,
    },
  ];

  const displayProjects = projects.length > 0 ? projects : [
    {
      _id: 'p1',
      title: 'Aether Motion - Product Teaser v2',
      type: 'Campaign',
      status: 'Active',
      deadline: 'Due Tomorrow, 5:00 PM',
      currentStep: 'Color grade review & sound design pass',
      progressPercent: 75,
      timelineCode: '00:00:28:14',
      spec: '4K DCI ProRes',
    },
    {
      _id: 'p2',
      title: 'Cyberpunk Sound Design Sample Reel',
      type: 'Original',
      status: 'Active',
      deadline: 'Due Oct 28',
      currentStep: 'Rough audio sync & transition cuts',
      progressPercent: 40,
      timelineCode: '00:01:05:00',
      spec: '1080x1920 60fps',
    },
    {
      _id: 'p3',
      title: 'Speed Ramping UGC Practice Pack',
      type: 'Practice',
      status: 'Planned',
      deadline: 'Due Nov 04',
      currentStep: 'Curate raw 120fps drone footage',
      progressPercent: 15,
      timelineCode: 'Not Initialized',
      spec: '14 Assets Collected',
    },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-lowest text-on-surface font-sans antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* ========================================================= */}
      {/* FIXED SIDEBAR (Matches Stitch navigation structure)        */}
      {/* ========================================================= */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest z-50 flex flex-col justify-between p-3.5 border-r border-surface-container-highest shadow-2xl">
        <div className="flex flex-col gap-4">
          {/* Logo & Brand Header */}
          <Link href="/" className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-surface-container-low transition">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container via-inverse-primary to-secondary-container flex items-center justify-center shadow-lg shadow-secondary-container/40 text-on-primary shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-bold tracking-tight text-on-surface">Clipflow</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold tracking-wider bg-secondary-container text-on-secondary-container">
                  Studio
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <span className="px-2 text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1">
              Workspace
            </span>

            <button
              onClick={() => setActiveNav('dashboard')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('campaigns')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'campaigns'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover Campaigns</span>
            </button>

            <button
              onClick={() => setActiveNav('saved')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'saved'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Campaigns</span>
            </button>

            <button
              onClick={() => setActiveNav('projects')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'projects'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => setActiveNav('assets')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'assets'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Asset Library</span>
            </button>

            <button
              onClick={() => setActiveNav('submissions')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'submissions'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Submissions</span>
            </button>

            <button
              onClick={() => setActiveNav('earnings')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'earnings'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Earnings</span>
            </button>

            <button
              onClick={() => setActiveNav('calendar')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                activeNav === 'calendar'
                  ? 'bg-secondary-container text-on-surface font-semibold shadow-[0_0_16px_rgba(160,120,255,0.25)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar</span>
            </button>
          </nav>

          {/* Creator Resources */}
          <div className="flex flex-col gap-1 pt-3 border-t border-surface-container-highest">
            <span className="px-2 text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider mb-1">
              Creator Resources
            </span>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition">
              <Wrench className="w-4 h-4" />
              <span>Editing Toolkit</span>
            </button>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition">
              <GraduationCap className="w-4 h-4" />
              <span>Learning Hub</span>
            </button>
            <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition">
              <Library className="w-4 h-4" />
              <span>Reference Library</span>
            </button>
          </div>
        </div>

        {/* User Card & Settings */}
        <div className="flex flex-col gap-2 pt-3 border-t border-surface-container-highest">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-surface-container-highest">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-on-primary text-xs shadow">
                  {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'CU'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface-container-lowest" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-on-surface truncate">
                  {user ? user.displayName : 'Guest Creator'}
                </span>
                <span className="text-[11px] text-on-surface-variant truncate">
                  {user ? user.email : 'Sign in to sync'}
                </span>
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                title="Sign out"
                className="text-on-surface-variant hover:text-error p-1 rounded transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href="/login"
                title="Sign in"
                className="text-primary hover:text-primary-fixed p-1 rounded transition"
              >
                <LogIn className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN VIEW AREA                                            */}
      {/* ========================================================= */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-surface-container-highest flex items-center justify-between px-8 shadow-sm">
          <div className="flex-1 max-w-lg">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns, projects, assets..."
                className="w-full h-9 pl-9 pr-14 bg-surface-container border border-surface-container-highest rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container transition"
              />
              <kbd className="absolute right-3 px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden lg:block text-xs text-on-surface-variant">
              Wednesday, Oct 24 • Studio Mode
            </span>
            <button className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface-container-lowest" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          {/* Greeting & Direct Actions Bar */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                  Good morning, {user?.displayName || 'Creator'} 👋
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-tertiary border border-tertiary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                  Studio Synced
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">
                Here is what is happening in your creative workspace today.
              </p>
            </div>

            {/* Prototype View Mode Switchers & CTAs */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-surface-container p-1 rounded-xl flex items-center border border-outline-variant/20 shadow-inner">
                <button
                  onClick={() => setViewMode('default')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'default'
                      ? 'bg-secondary-container text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Default View
                </button>
                <button
                  onClick={() => setViewMode('empty')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'empty'
                      ? 'bg-secondary-container text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Empty State
                </button>
                <button
                  onClick={() => setViewMode('skeleton')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'skeleton'
                      ? 'bg-secondary-container text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Skeleton
                </button>
              </div>

              <button
                onClick={() => setActiveNav('campaigns')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/20 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Campaigns</span>
              </button>

              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-secondary-container text-on-primary text-xs font-semibold shadow-lg shadow-primary-container/20 hover:brightness-110 active:scale-[0.98] transition">
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>
          </section>

          {/* OVERVIEW KPI METRICS (4 CARDS) */}
          <section className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity ${viewMode === 'skeleton' ? 'opacity-30' : ''}`}>
            {/* Card 1: Active Projects */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between gap-3 shadow-md hover:bg-surface-container border border-outline-variant/20 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant">Active Projects</span>
                <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-primary">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-on-surface">04</span>
                  <span className="text-xs text-on-surface-variant">in progress</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">2 deadlines scheduled this week</p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '66%' }} />
              </div>
            </div>

            {/* Card 2: Saved Opportunities */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between gap-3 shadow-md hover:bg-surface-container border border-outline-variant/20 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant">Saved Opportunities</span>
                <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-secondary">
                  <Bookmark className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-on-surface">12</span>
                  <span className="text-xs text-on-surface-variant">tracked</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  <span className="text-xs text-tertiary font-medium">3 brand matches updated</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Card 3: Upcoming Deadlines */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between gap-3 shadow-md hover:bg-surface-container border border-outline-variant/20 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant">Upcoming Deadlines</span>
                <div className="w-8 h-8 rounded-lg bg-secondary-container/50 flex items-center justify-center text-primary-fixed-dim">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-on-surface">03</span>
                  <span className="text-xs text-on-surface-variant">≤ 7 days</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-error" />
                  <span className="text-xs text-error font-medium">1 high-priority cut due tomorrow</span>
                </div>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            {/* Card 4: Recorded Earnings */}
            <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between gap-3 shadow-md hover:bg-surface-container border border-outline-variant/20 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-on-surface-variant">Recorded Earnings</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-on-surface">$240</span>
                  <span className="text-xs text-on-surface-variant">this month</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">+$120 pending client milestone payout</p>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
          </section>

          {/* EMPTY STATE VIEW */}
          {viewMode === 'empty' && (
            <section className="flex flex-col items-center justify-center p-16 bg-surface-container-low rounded-2xl text-center gap-4 border border-outline-variant/20">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-primary-container shadow-inner">
                <HardDrive className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-1 max-w-md">
                <h3 className="font-display text-xl font-bold text-on-surface">No Projects or Campaigns Active</h3>
                <p className="text-xs text-on-surface-variant">
                  Your workspace queue is completely clear. Start by discovering high-paying creator briefs or launch a raw footage editing draft.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setViewMode('default')}
                  className="px-4 py-2 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold shadow"
                >
                  Explore Campaigns
                </button>
                <button
                  onClick={() => setViewMode('default')}
                  className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition"
                >
                  Reset to Sample View
                </button>
              </div>
            </section>
          )}

          {/* SKELETON STATE VIEW */}
          {viewMode === 'skeleton' && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6 animate-pulse">
                <div className="h-64 bg-surface-container-low rounded-2xl border border-outline-variant/20" />
                <div className="h-64 bg-surface-container-low rounded-2xl border border-outline-variant/20" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6 animate-pulse">
                <div className="h-56 bg-surface-container-low rounded-2xl border border-outline-variant/20" />
                <div className="h-56 bg-surface-container-low rounded-2xl border border-outline-variant/20" />
              </div>
            </section>
          )}

          {/* DEFAULT STATE SPLIT VIEW */}
          {viewMode === 'default' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: Campaigns + Active Timeline Projects (68%) */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* SECTION A: CAMPAIGN OPPORTUNITIES */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-primary-container" />
                      <h2 className="font-display text-lg font-bold text-on-surface">New Campaign Opportunities</h2>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/20">
                        {displayCampaigns.length} Curated
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveNav('campaigns')}
                      className="text-xs text-primary hover:text-primary-fixed transition flex items-center gap-0.5 font-semibold"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {displayCampaigns.map((camp) => (
                      <article
                        key={camp._id}
                        className="group bg-surface-container-low hover:bg-surface-container rounded-xl p-4 transition-all duration-200 border border-outline-variant/20 shadow-md"
                      >
                        <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                          <div className="flex gap-4 w-full md:w-auto flex-1 min-w-0">
                            <div className="relative w-28 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest border border-outline-variant/20">
                              <img
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                alt={camp.title}
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhNoupPeetvbgm0cqMQAyijzD0cvPM2U2_Kg03yqUJi7YjLb4yF19hr3yrJVvtWu2PuHIncv8GyP4EwXZUv51ABgDBd73O1cxBNgg4roPy8jQFG5MrAuF4JudnHKGxuQNboZb1euqGHtPy3PfIITXYp1uOivYLX7TBhFS5mopFG-IVTeGkSpQxgX1KaGmRv8nRQzUIt1F503VFJujQJkairxojiq2HUwdmLZ0YCW8"
                              />
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-surface-container-lowest/80 backdrop-blur-md text-[10px] text-tertiary font-semibold">
                                TikTok / Reels
                              </span>
                            </div>

                            <div className="flex flex-col justify-between flex-1 min-w-0">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">{camp.brand}</span>
                                  <span className="text-on-surface-variant text-xs">•</span>
                                  <span className="text-xs text-on-surface-variant">{camp.category}</span>
                                  <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20">
                                    {camp.status}
                                  </span>
                                </div>
                                <h3 className="font-display text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                                  {camp.title}
                                </h3>
                                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                                  Requirements: {camp.requirements.join(' • ')}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                                <span className="flex items-center gap-1 font-semibold text-tertiary">
                                  <DollarSign className="w-3.5 h-3.5" />
                                  {camp.payout}
                                </span>
                                <span className="flex items-center gap-1 text-on-surface-variant">
                                  <Clock className="w-3.5 h-3.5" />
                                  {camp.deadline}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex md:flex-col items-center justify-between w-full md:w-auto gap-2 self-stretch md:self-auto pt-2 md:pt-0">
                            <button
                              onClick={() => toggleBookmark(camp._id)}
                              aria-label="Bookmark"
                              className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition"
                            >
                              {camp.saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-secondary-container text-on-surface text-xs font-semibold transition flex items-center gap-1">
                              <span>View Details</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* SECTION B: MY PROJECTS */}
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-4 rounded-full bg-secondary" />
                      <h2 className="font-display text-lg font-bold text-on-surface">My Projects</h2>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/20">
                        {displayProjects.length} Active Timeline Cuts
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveNav('projects')}
                      className="text-xs text-primary hover:text-primary-fixed transition flex items-center gap-0.5 font-semibold"
                    >
                      <span>View All Projects</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {displayProjects.map((proj) => (
                      <div
                        key={proj._id}
                        className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/20 shadow-md hover:bg-surface-container transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-secondary-container text-on-secondary-container">
                              {proj.type}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary/10 text-tertiary border border-tertiary/20">
                              {proj.status}
                            </span>
                            <h3 className="font-display text-sm font-semibold text-on-surface">{proj.title}</h3>
                          </div>
                          <span className="text-xs text-error font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {proj.deadline}
                          </span>
                        </div>

                        {/* Task and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-primary" />
                            Current Step: {proj.currentStep}
                          </span>
                          <span className="font-mono text-on-surface font-semibold">{proj.progressPercent}% Ready</span>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-secondary-container via-primary-container to-tertiary h-full rounded-full transition-all duration-500"
                            style={{ width: `${proj.progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                            <span>TIMELINE: {proj.timelineCode}</span>
                            <span>• {proj.spec}</span>
                          </div>
                          <button className="flex items-center gap-1 text-primary hover:text-primary-fixed text-xs font-semibold">
                            <span>Open Workspace</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN: Tasks, Deadlines, Activity (32%) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* SECTION C: TODAY'S TASKS */}
                <section className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <h2 className="font-display text-sm font-bold text-on-surface">Today's Tasks</h2>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:text-primary-fixed font-semibold">
                      <Plus className="w-3 h-3" />
                      <span>Add Task</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container flex items-start gap-2.5 group hover:bg-surface-container-high transition border border-outline-variant/20">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-surface-container-lowest text-primary-container accent-primary-container cursor-pointer" />
                      <div className="flex flex-col flex-1">
                        <span className="text-xs text-on-surface font-medium group-hover:text-primary transition">Deliver 15s hook cut for TechPulse</span>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-error-container text-on-error-container">High</span>
                          <span className="text-on-surface-variant">Due 2:00 PM</span>
                          <span className="text-outline">• TechPulse UGC</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container/40 flex items-start gap-2.5 opacity-60 border border-outline-variant/20">
                      <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded bg-primary-container text-on-primary-container accent-primary-container cursor-pointer" />
                      <div className="flex flex-col flex-1">
                        <span className="text-xs text-on-surface-variant line-through">Export ProRes 422 proxy reels</span>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">Med</span>
                          <span className="text-tertiary">Completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container flex items-start gap-2.5 group hover:bg-surface-container-high transition border border-outline-variant/20">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded bg-surface-container-lowest text-primary-container accent-primary-container cursor-pointer" />
                      <div className="flex flex-col flex-1">
                        <span className="text-xs text-on-surface font-medium group-hover:text-primary transition">Sync multi-cam audio for vlog episode</span>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-surface-container-highest text-on-surface-variant">Med</span>
                          <span className="text-on-surface-variant">Due 6:30 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* SECTION D: UPCOMING DEADLINES */}
                <section className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <h2 className="font-display text-sm font-bold text-on-surface">Upcoming Deadlines</h2>
                    </div>
                    <button className="text-xs text-primary hover:text-primary-fixed font-semibold">Open Calendar</button>
                  </div>

                  <div className="relative pl-6 flex flex-col gap-4">
                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-highest" />

                    <div className="relative flex flex-col gap-0.5">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-error ring-4 ring-surface-container-low" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-error font-semibold">Tomorrow (Oct 25)</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-error-container text-on-error-container">Due Soon</span>
                      </div>
                      <p className="text-xs text-on-surface font-medium">Aether Motion Teaser - Final Cut Export</p>
                      <span className="text-[11px] text-on-surface-variant">Campaign Final Submission Gate</span>
                    </div>

                    <div className="relative flex flex-col gap-0.5">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-primary ring-4 ring-surface-container-low" />
                      <span className="text-xs text-on-surface-variant font-medium">Oct 27</span>
                      <p className="text-xs text-on-surface font-medium">Apex Hydration - Script Pitch Submission</p>
                      <span className="text-[11px] text-on-surface-variant">Project Milestone Review</span>
                    </div>

                    <div className="relative flex flex-col gap-0.5">
                      <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-surface-container-highest ring-4 ring-surface-container-low" />
                      <span className="text-xs text-on-surface-variant font-medium">Nov 02</span>
                      <p className="text-xs text-on-surface font-medium">TechPulse UGC Delivery Gate</p>
                      <span className="text-[11px] text-on-surface-variant">Scheduled Channel Launch</span>
                    </div>
                  </div>
                </section>

                {/* SECTION E: RECENT ACTIVITY */}
                <section className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4 border border-outline-variant/20 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-tertiary" />
                      <h2 className="font-display text-sm font-bold text-on-surface">Recent Activity</h2>
                    </div>
                    <span className="text-xs text-on-surface-variant">Realtime</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Bookmark className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-on-surface leading-snug">
                          Bookmarked <span className="font-semibold text-primary">Lumina VFX Presets</span>
                        </p>
                        <span className="text-[11px] text-outline mt-0.5">25m ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary shrink-0 mt-0.5">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-on-surface leading-snug">
                          Received <span className="text-tertiary font-semibold">$240 payment</span> for Neon Surge
                        </p>
                        <span className="text-[11px] text-outline mt-0.5">Yesterday, 4:15 PM</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
