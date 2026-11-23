'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  TrendingUp,
  Activity,
  ShieldCheck,
  Film
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('marcus.ugc@cutroom.studio');
  const [password, setPassword] = useState('StudioPassword#99');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid creator workstation credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-surface-container-lowest selection:bg-primary-container selection:text-on-primary-container">
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-surface-container-lowest text-on-surface">
        {/* ========================================================= */}
        {/* LEFT SIDE: Brand & Immersive Studio Experience (55%)       */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-14 relative overflow-hidden bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant/30">
          {/* Ambient studio glow orbs */}
          <div className="absolute -top-32 -left-28 w-96 h-96 rounded-full bg-primary-container/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-secondary-container/20 blur-[130px] pointer-events-none" />
          <div className="absolute -bottom-24 right-0 w-80 h-80 rounded-full bg-tertiary-container/10 blur-[100px] pointer-events-none" />

          {/* Top Header: Logo Lockup */}
          <header className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-container via-inverse-primary to-secondary-container flex items-center justify-center p-1.5 shadow-lg shadow-black/40 text-on-primary">
                <Film className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display text-2xl text-on-surface tracking-tight font-bold">Clipflow</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-xs uppercase tracking-wider font-semibold border border-secondary/20">
                  CREATOR STUDIO
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span>v2.4 Production Engine</span>
            </div>
          </header>

          {/* Center Hero Display */}
          <div className="relative z-10 my-10 lg:my-8 flex flex-col gap-6 max-w-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold mb-4 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEXT-GEN UGC PIPELINE</span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight">
                Your Creative Workflow.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  One Place.
                </span>
              </h1>
              <p className="text-base text-on-surface-variant mt-3 max-w-xl leading-relaxed">
                Discover opportunities, organize multi-track footage, streamline revision sync, and scale your short-form business at velocity.
              </p>
            </div>

            {/* 3D Studio Workspace Visual Graphic */}
            <div className="relative rounded-2xl p-3 bg-surface-container-low/70 backdrop-blur-xl shadow-2xl shadow-black/80 border border-outline-variant/30 group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-container/20 via-transparent to-secondary-container/10 pointer-events-none" />
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-surface-container-lowest flex items-center justify-center border border-outline-variant/20">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  alt="Futuristic isometric 3D dark glassmorphic user interface of video editing suite showing multi-layer audio waveforms in glowing cyan and violet"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCITzm5jIwLllwLqiiOPH1nSW4GsuQSbl6RFav2zy4yAYo4PrRzm-6WkZRnuBUKx0y3KB-oTvw2OHKuZ1W64gvmquKC4aCo5j901zNmLZf5o8XINlCkZNloVIK3XezC4t0XiDav8a2Lu_zVLEsjY9kC5L5_f0kaN4bscF_RNCN75BgY94ryQzZDiLETZNt0vfn_IAzI4urAmUACKeq_-VJx3SJX2qE9xAe2eWZgl_Y"
                />

                {/* Floating Micro HUD Badges over graphic */}
                <div className="absolute top-4 left-4 bg-surface-container-high/90 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-lg border border-outline-variant/30">
                  <Activity className="w-4 h-4 text-tertiary" />
                  <div>
                    <p className="text-xs text-on-surface font-semibold">Auto-Caption Sync</p>
                    <p className="text-[11px] text-tertiary">99.8% precision</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-surface-container-high/90 backdrop-blur-md rounded-lg px-3.5 py-2 flex items-center gap-3 shadow-lg border border-outline-variant/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface font-semibold">Virality Index</p>
                    <p className="text-xs font-mono text-primary font-bold">94.2 / 100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Feature Highlight Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-low/80 backdrop-blur-sm flex flex-col justify-between hover:bg-surface-container-high/70 transition-all border border-outline-variant/20">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold text-on-surface">Discover</span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">$240k+ active brand bounties</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/80 backdrop-blur-sm flex flex-col justify-between hover:bg-surface-container-high/70 transition-all border border-outline-variant/20">
                <div className="flex items-center gap-2 text-secondary mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-semibold text-on-surface">Manage</span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Multi-track footage & sync</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low/80 backdrop-blur-sm flex flex-col justify-between hover:bg-surface-container-high/70 transition-all border border-outline-variant/20">
                <div className="flex items-center gap-2 text-tertiary mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-semibold text-on-surface">Track</span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Real-time creator analytics</p>
              </div>
            </div>
          </div>

          {/* Footer Trust Badge */}
          <footer className="relative z-10 pt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary ring-2 ring-surface-container-lowest">ED</div>
              <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container ring-2 ring-surface-container-lowest">UG</div>
              <div className="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-xs font-bold text-on-tertiary ring-2 ring-surface-container-lowest">CL</div>
            </div>
            <p className="text-xs text-on-surface-variant">
              Trusted by <span className="text-on-surface font-semibold">18,000+</span> elite clippers, UGC creators, and post-production studios.
            </p>
          </footer>
        </div>

        {/* ========================================================= */}
        {/* RIGHT SIDE: Auth Terminal / Login Form (45%)              */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[45%] min-h-screen flex flex-col justify-between items-center p-6 sm:p-12 lg:p-16 bg-surface-container-lowest relative">
          {/* Top Right Studio Environment Indicator */}
          <div className="w-full max-w-md flex justify-end items-center gap-3 text-on-surface-variant text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low text-on-surface border border-outline-variant/30">
              <Lock className="w-3.5 h-3.5 text-tertiary" />
              SSL 256-Bit Encrypted
            </span>
          </div>

          {/* Main Login Container */}
          <div className="w-full max-w-md my-auto py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl sm:text-3xl text-on-surface tracking-tight font-bold">Welcome back</h2>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold border border-primary/20">
                  Creator Access
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-2">
                Sign in to your production suite to continue your pipeline.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-error-container/40 text-on-error-container flex items-start gap-3 border border-error/30 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-error">Authentication Failed</p>
                  <p className="text-on-surface-variant mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Workstation Email Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-on-surface font-medium" htmlFor="email">Workstation Email</label>
                  <span className="text-[11px] text-outline">SSO ready</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@creatorstudio.com"
                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                  {email.includes('@') && email.includes('.') && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-tertiary">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-on-surface font-medium" htmlFor="password">Password</label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:text-primary-fixed transition font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-low text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Workstation Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-surface-container-high text-primary-container accent-primary-container focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <span className="text-xs text-on-surface-variant hover:text-on-surface transition">
                    Remember workstation device
                  </span>
                </label>
                <span className="text-[11px] text-outline">30-day session</span>
              </div>

              {/* Primary Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-primary-container via-inverse-primary to-secondary-container hover:brightness-110 text-on-primary font-display text-sm font-semibold rounded-xl shadow-lg shadow-primary-container/20 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-on-primary" />
                      <span>Authenticating Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Secondary Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                New to Clipflow?{' '}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:text-primary-fixed transition underline decoration-primary/40 underline-offset-4"
                >
                  Create creator account
                </Link>
              </p>
            </div>

            {/* Quick Access Bounties Info Capsule */}
            <div className="mt-8 p-3.5 rounded-xl bg-surface-container-low flex items-center gap-3 border border-outline-variant/20">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-on-surface font-semibold truncate">Enterprise Creative Hub</p>
                <p className="text-[11px] text-outline truncate">Need high-volume team licensing? Contact Studio Ops</p>
              </div>
            </div>
          </div>

          {/* Bottom Compliance & Security Note */}
          <footer className="w-full max-w-md pt-4 text-center">
            <p className="text-xs text-outline">
              Protected by Studio Guard • <a className="hover:underline hover:text-on-surface" href="#terms">Terms of Service</a> • <a className="hover:underline hover:text-on-surface" href="#privacy">Privacy Policy</a>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
