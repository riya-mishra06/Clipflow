'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Film,
  Compass,
  Folder,
  Layers,
  Send,
  DollarSign,
  Share2,
  Calendar,
  Settings,
  GraduationCap,
  TrendingUp,
  Sparkles,
  Wrench,
  Bookmark,
  Menu,
  X,
  Plus,
  Search,
  ExternalLink
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth pages should not have the studio sidebar/top bar
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const workstationLinks = [
    { label: 'Dashboard', href: '/', icon: Film },
    { label: 'Campaigns', href: '/campaigns', icon: Compass },
    { label: 'Projects', href: '/projects', icon: Folder },
    { label: 'Assets', href: '/assets', icon: Layers },
    { label: 'Submissions', href: '/submissions', icon: Send },
    { label: 'Earnings', href: '/earnings', icon: DollarSign },
  ];

  const intelligenceLinks = [
    { label: 'Learning Hub', href: '/learning', icon: GraduationCap },
    { label: 'Trend Radar', href: '/trends', icon: TrendingUp },
    { label: 'Viral References', href: '/references', icon: Bookmark },
    { label: 'AI Script Lab', href: '/ai-assistant', icon: Sparkles },
    { label: 'Editor Toolkit', href: '/toolkit', icon: Wrench },
  ];

  const integrationLinks = [
    { label: 'Social Channels', href: '/channels', icon: Share2 },
    { label: 'Schedule', href: '/calendar', icon: Calendar },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex">
      {/* ========================================================= */}
      {/* 1. DESKTOP PERMANENT STUDIO SIDEBAR                      */}
      {/* ========================================================= */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#0c0c0e] flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-30">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Logo brand */}
          <Link
            href="/"
            className="h-16 px-6 flex items-center gap-3 border-b border-white/[0.08] hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white shadow-sm font-bold shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight font-headline">ClipFlow</div>
              <div className="text-[10px] text-[#71717a] font-mono uppercase tracking-wider">Creator Studio</div>
            </div>
          </Link>

          {/* Navigation Links Scrollable Area */}
          <div className="p-4 space-y-6 overflow-y-auto flex-1">
            {/* Workstation Section */}
            <div>
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-2 font-mono">
                Workstation
              </div>
              <nav className="space-y-1 text-xs font-medium">
                {workstationLinks.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.08]'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#818cf8]' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Creator Academy & Intel Section */}
            <div>
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-2 font-mono">
                Academy & Intel
              </div>
              <nav className="space-y-1 text-xs font-medium">
                {intelligenceLinks.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.08]'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#818cf8]' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Integrations Section */}
            <div>
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-2 font-mono">
                Operations
              </div>
              <nav className="space-y-1 text-xs font-medium">
                {integrationLinks.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? 'bg-white/[0.08] text-white font-semibold border border-white/[0.08]'
                          : 'text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#818cf8]' : ''}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer Account Badge */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between text-xs bg-[#0c0c0e]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#6366f1]/20 border border-[#6366f1]/40 text-[#818cf8] flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <div className="text-white font-semibold text-xs leading-none">Marcus UGC</div>
              <div className="text-[10px] text-[#71717a] mt-0.5">Pro Workstation</div>
            </div>
          </div>
          <Link
            href="/settings"
            className="p-1 rounded-md text-[#71717a] hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE TOP BAR & SLIDE-OUT OVERLAY                    */}
      {/* ========================================================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#6366f1] flex items-center justify-center text-white font-bold">
            <Film className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white font-headline">ClipFlow</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/[0.04] text-[#a1a1aa] hover:text-white border border-white/[0.08]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm pt-16">
          <div className="bg-[#0c0c0e] border-b border-white/[0.08] max-h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-4">
            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-1 font-mono">
                Workstation
              </div>
              {workstationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs ${
                    isActive(item.href)
                      ? 'bg-white/[0.08] text-white font-semibold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-1 font-mono">
                Academy & Intel
              </div>
              {intelligenceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs ${
                    isActive(item.href)
                      ? 'bg-white/[0.08] text-white font-semibold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-wider text-[#71717a] mb-1 font-mono">
                Operations
              </div>
              {integrationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs ${
                    isActive(item.href)
                      ? 'bg-white/[0.08] text-white font-semibold'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN APPLICATION VIEWPORT                             */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 md:pt-0 pt-14">
        {children}
      </div>
    </div>
  );
}
