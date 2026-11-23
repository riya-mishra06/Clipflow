'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Film,
  Lock,
  Mail,
  User,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Activity,
  Video,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Marcus Vance');
  const [email, setEmail] = useState('marcus.vance@studioflow.io');
  const [password, setPassword] = useState('StudioMasterKey2025!');
  const [confirmPassword, setConfirmPassword] = useState('StudioMasterKey2025!');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Strength Evaluation
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const strengthScore = [hasLength, hasUpper, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create creator account.');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-surface-container-lowest px-4 sm:px-8 py-8 selection:bg-primary-container selection:text-on-primary-container">
      {/* Subtle Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-container/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-[30rem] h-[30rem] rounded-full bg-secondary-container/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-[26rem] h-[26rem] rounded-full bg-tertiary-container/10 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Brand Experience & Studio Showcase (58%)      */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-surface-container-low/60 backdrop-blur-md shadow-2xl border border-outline-variant/30">
            {/* Top System Lockup */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container via-inverse-primary to-secondary-container flex items-center justify-center shadow-lg shadow-secondary-container/40 text-on-primary">
                  <Film className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-on-surface tracking-tight font-bold">Clipflow</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-xs uppercase tracking-wider font-semibold border border-primary/20">
                    Creator Studio
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                  <span>v2.4 Production Engine</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs border border-outline-variant/30">
                  <Lock className="w-3.5 h-3.5 text-tertiary" />
                  <span>SSL 256-Bit Encrypted</span>
                </div>
              </div>
            </div>

            {/* Hero Typography */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full bg-primary/10 text-primary-fixed-dim text-xs font-semibold tracking-wider uppercase border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Creator Pipeline
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight">
                Create. Organize. Grow.
              </h1>
              <p className="text-base text-outline max-w-xl leading-relaxed">
                Everything you need to manage your creative journey, timeline assembly, and UGC pipelines all in one workspace.
              </p>
            </div>

            {/* Showcase Studio Card / Mockup */}
            <div className="relative w-full rounded-xl bg-surface-container-lowest p-4 sm:p-5 overflow-hidden shadow-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-error" />
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                  <span className="ml-2">clip_master_v3_9x16.pr</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-tertiary text-xs font-mono flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Virality 96.4/100
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-xs font-semibold">
                    Auto-Sync 99.8%
                  </span>
                </div>
              </div>

              {/* Preview Window + Timeline Tracks */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 sm:col-span-5 relative rounded-lg overflow-hidden bg-surface-container aspect-[9/12] flex flex-col justify-end p-3 border border-outline-variant/20">
                  <img
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt="Futuristic vertical video editing interface"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwpPf1EM7U1mjhy86AXWZg4shxCURCr15gdoY8p-BE2Z7aaK03VXEW6NnJHViP31umoF8k6nMvYGAFNi-c3Ht_-R0l6ON2RdvNhhIxwnUGCAgjzrZzbDCBQ40bUZCeEnE75ZyTiA6Zeg1v8Gl89oyjb53AJDFwPq3aYE4fqkOGXR62xnSvGb4OA322n-JA5F-Ulf2u54FWCqG7UVtpcXGO7sW7WWI7p6Yyewm4JLQ"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                  <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wider text-primary font-semibold">Hook Segment • 00:03.14</span>
                    <p className="text-xs text-on-surface font-semibold line-clamp-2 leading-snug">
                      "3 editing secrets that 10x your organic retention rate..."
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      <span className="text-[11px] text-tertiary">Audio Denoise Active (-14 LUFS)</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-7 flex flex-col justify-between gap-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                  {/* Track 1: A-Roll */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span className="flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-primary" /> A-Roll (4K 60fps)
                      </span>
                      <span className="font-mono text-outline">00:45.00</span>
                    </div>
                    <div className="h-6 w-full bg-surface-container-highest rounded flex items-center px-1 gap-1 overflow-hidden">
                      <div className="h-4.5 w-1/3 bg-primary-container rounded flex items-center px-2 text-on-primary text-[10px] font-bold truncate">Hook_Cut01</div>
                      <div className="h-4.5 w-1/4 bg-primary rounded flex items-center px-2 text-on-primary-container text-[10px] font-bold truncate">Beat_Drop</div>
                      <div className="h-4.5 flex-1 bg-secondary-container rounded flex items-center px-2 text-on-secondary-container text-[10px] font-bold truncate">CTA_Outro</div>
                    </div>
                  </div>

                  {/* Track 2: Dialogue & SFX */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-tertiary" /> Dynamic SFX & Dialogue
                      </span>
                      <span className="font-mono text-tertiary">+3.2 dB Peak</span>
                    </div>
                    <div className="h-9 w-full bg-surface-container rounded flex items-center px-2 overflow-hidden border border-outline-variant/20">
                      <svg className="w-full h-7 text-tertiary opacity-90" preserveAspectRatio="none" viewBox="0 0 300 40">
                        <path d="M0,20 Q10,5 20,20 T40,20 T60,5 T80,35 T100,10 T120,28 T140,2 T160,38 T180,14 T200,26 T220,6 T240,32 T260,18 T280,24 T300,20" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Track 3: Captions */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span>Kinetic Captions (Whisper AI)</span>
                      <span className="font-mono text-secondary">99.8% Conf.</span>
                    </div>
                    <div className="h-5 w-full bg-surface-container rounded flex items-center px-1 gap-1">
                      <div className="h-3.5 w-1/5 bg-secondary-fixed-dim rounded" />
                      <div className="h-3.5 w-1/4 bg-secondary rounded" />
                      <div className="h-3.5 w-1/3 bg-primary-fixed-dim rounded" />
                    </div>
                  </div>

                  {/* Micro Prediction Card */}
                  <div className="mt-1 p-2 rounded bg-surface-container flex items-center justify-between border border-outline-variant/20">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs text-on-surface font-semibold">Predicted Reach: 450K+</div>
                        <div className="text-[10px] text-outline">Velocity spike in tech & gaming</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-tertiary font-bold bg-surface-container-high px-2 py-0.5 rounded">
                      High Viral
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Compact Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-1 border border-outline-variant/20">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center mb-1">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-on-surface">Discover Paid Campaigns</h2>
                <p className="text-xs text-outline">$280k+ active creator bounties, sponsor deals, and instant payouts.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-1 border border-outline-variant/20">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/30 text-secondary flex items-center justify-center mb-1">
                  <Video className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-on-surface">Manage Projects</h2>
                <p className="text-xs text-outline">Multi-track footage storage, version revisions, and cloud timeline sync.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col gap-1 border border-outline-variant/20">
                <div className="w-8 h-8 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center mb-1">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-semibold text-on-surface">Track Your Growth</h2>
                <p className="text-xs text-outline">Real-time engagement heatmaps, algorithmic insights & audience retention.</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-bold text-primary ring-2 ring-surface-container-lowest">MV</div>
                <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container ring-2 ring-surface-container-lowest">AK</div>
                <div className="w-7 h-7 rounded-full bg-tertiary-container flex items-center justify-center text-xs font-bold text-on-tertiary ring-2 ring-surface-container-lowest">+18k</div>
              </div>
              <p className="text-xs text-outline">
                Trusted by <span className="text-on-surface font-semibold">18,000+</span> elite clippers, UGC creators, and post-production studios.
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Registration Authentication Form (42%)      */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="w-full rounded-2xl bg-surface-container-low p-6 sm:p-8 lg:p-10 shadow-2xl relative border border-outline-variant/30">
              {/* Form Header */}
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                    Creator Studio Onboarding
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary-container" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-on-surface font-bold tracking-tight">
                  Create your account
                </h2>
                <p className="text-sm text-outline">
                  Start building your high-velocity creative workflow with Clipflow.
                </p>
              </div>

              {/* Alert Container for Validation Errors */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-error-container/30 text-error flex items-start gap-3 border border-error/30 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <div className="flex flex-col text-xs">
                    <span className="font-semibold text-error">Registration Incomplete</span>
                    <span className="text-error/90 mt-0.5">{error}</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Field 1: Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface flex items-center justify-between font-medium" htmlFor="full_name">
                    <span>Full Name</span>
                    <span className="text-[11px] text-outline">Creator Handle</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-outline w-4 h-4 pointer-events-none" />
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-surface-container rounded-xl pl-11 pr-4 py-2.5 text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                  </div>
                </div>

                {/* Field 2: Workstation Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface flex items-center justify-between font-medium" htmlFor="email">
                    <span>Email Address</span>
                    <span className="text-[11px] text-primary">Workstation email preferred</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 text-outline w-4 h-4 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-surface-container rounded-xl pl-11 pr-10 py-2.5 text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                    {email.includes('@') && email.includes('.') && (
                      <CheckCircle2 className="absolute right-3.5 text-tertiary w-4 h-4" />
                    )}
                  </div>
                </div>

                {/* Field 3: Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface flex items-center justify-between font-medium" htmlFor="password">
                    <span>Password</span>
                    <span className="text-[11px] text-outline">Security rating</span>
                  </label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3.5 text-outline w-4 h-4 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full bg-surface-container rounded-xl pl-11 pr-11 py-2.5 text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-outline hover:text-on-surface focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-outline">Strength</span>
                      <span className={`font-semibold ${strengthScore === 3 ? 'text-tertiary' : strengthScore === 2 ? 'text-secondary' : 'text-error'}`}>
                        {strengthScore === 3 ? 'Strong (90%)' : strengthScore === 2 ? 'Medium (60%)' : 'Weak (30%)'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
                      <div className={`h-full rounded-full transition-colors ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-error' : strengthScore === 2 ? 'bg-secondary' : 'bg-tertiary') : 'bg-surface-container'}`} />
                      <div className={`h-full rounded-full transition-colors ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-secondary' : 'bg-tertiary') : 'bg-surface-container'}`} />
                      <div className={`h-full rounded-full transition-colors ${strengthScore >= 3 ? 'bg-tertiary' : 'bg-surface-container'}`} />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${hasLength ? 'text-tertiary' : 'text-outline'}`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-tertiary' : 'text-outline'}`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 sm:col-span-2 ${hasSpecial ? 'text-tertiary' : 'text-outline'}`}>
                      <Check className="w-3.5 h-3.5" />
                      <span>Number or special character (@#$!)</span>
                    </div>
                  </div>
                </div>

                {/* Field 4: Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-on-surface flex items-center justify-between font-medium" htmlFor="confirm_password">
                    <span>Confirm Password</span>
                    {confirmPassword.length > 0 && (
                      <span className={`text-[11px] flex items-center gap-1 ${passwordsMatch ? 'text-tertiary' : 'text-error'}`}>
                        {passwordsMatch ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                          </>
                        ) : (
                          'Passwords do not match'
                        )}
                      </span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <Shield className="absolute left-3.5 text-outline w-4 h-4 pointer-events-none" />
                    <input
                      id="confirm_password"
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full bg-surface-container rounded-xl pl-11 pr-11 py-2.5 text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-outline hover:text-on-surface focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms & Privacy */}
                <div className="flex items-start gap-2.5 mt-1">
                  <input
                    id="agree_terms"
                    name="agree_terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded bg-surface-container text-primary-container accent-primary-container focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <label className="text-xs text-outline select-none leading-relaxed" htmlFor="agree_terms">
                    I agree to the{' '}
                    <a className="text-on-surface hover:text-primary underline transition-colors" href="#terms">Terms of Service</a>{' '}
                    and{' '}
                    <a className="text-on-surface hover:text-primary underline transition-colors" href="#privacy">Privacy Policy</a>, and consent to encrypted clip processing.
                  </label>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-5 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-secondary-container hover:brightness-110 active:scale-[0.99] text-on-primary font-display text-sm font-semibold tracking-wide shadow-xl shadow-secondary-container/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-on-primary" />
                      <span>Provisioning Studio Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Direct Navigation to Sign In */}
              <div className="mt-6 text-center">
                <span className="text-sm text-outline">Already have a Clipflow workstation?</span>
                <Link
                  href="/login"
                  className="ml-1.5 text-sm text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  Sign In
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Trust & Security Micro Footer */}
              <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-2 text-outline text-xs border-t border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-tertiary" />
                  <span>Protected by Studio Guard</span>
                </div>
                <div className="flex items-center gap-3">
                  <a className="hover:text-on-surface transition-colors" href="#terms">Terms of Service</a>
                  <span>•</span>
                  <a className="hover:text-on-surface transition-colors" href="#privacy">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
