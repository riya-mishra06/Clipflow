'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('marcus.vance@studioflow.io');
  const [newPassword, setNewPassword] = useState('StudioMasterClip!99');
  const [confirmPassword, setConfirmPassword] = useState('StudioMasterClip!99');
  const [showPass, setShowPass] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(42);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden bg-surface-container-lowest px-4 sm:px-8 py-8 selection:bg-primary-container selection:text-on-primary-container">
      {/* Ambient Spotlights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Recovery & Creative Journey Vault (55%)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Header Brand Lockup */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-container via-inverse-primary to-secondary-container flex items-center justify-center shadow-lg text-on-primary">
                  <Film className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl text-on-surface tracking-tight font-bold">Clipflow</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-variant text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                      Creator Studio
                    </span>
                  </div>
                  <span className="text-xs text-outline">Post-Production & UGC Operations</span>
                </div>
              </div>

              {/* Security Engine Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant border border-outline-variant/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  v2.4 Security Engine
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-xs text-tertiary border border-outline-variant/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  256-Bit SSL
                </span>
              </div>
            </div>

            {/* Hero Typography */}
            <div className="flex flex-col space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-primary tracking-widest uppercase font-semibold">Security & Access Recovery</span>
                <span className="h-px w-8 bg-primary/30" />
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-on-surface tracking-tight">
                Your Creative Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Continues.</span>
              </h1>
              <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
                Get back to your projects, campaigns, and creative workspace seamlessly and securely. Your timelines are locked and waiting.
              </p>
            </div>

            {/* Creative Timeline Vault Card */}
            <div className="rounded-xl bg-surface-container-low p-5 shadow-xl space-y-4 border border-outline-variant/30">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-2 text-xs font-mono text-on-surface">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>timeline_recovery_vault.clip</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    Protected Vault 100% Encrypted
                  </span>
                </div>
              </div>

              {/* Scrubber visualization */}
              <div className="space-y-2 rounded-lg bg-surface-container-lowest p-3 border border-outline-variant/20">
                <div className="flex items-center justify-between font-mono text-xs text-outline px-1">
                  <span>00:00:00</span>
                  <span>00:45:10</span>
                  <span className="text-primary font-semibold">Active Marker: 01:24:18</span>
                  <span>02:10:00</span>
                </div>

                <div className="relative h-7 rounded bg-surface-container flex items-center px-3 overflow-hidden text-xs">
                  <span className="text-on-surface-variant font-medium z-10">T1: Intro Hook (4K)</span>
                  <div className="absolute left-0 top-0 bottom-0 w-2/5 bg-primary/20 rounded" />
                  <div className="absolute left-[42%] top-0 bottom-0 w-1/3 bg-primary-container/30 rounded" />
                  <div className="absolute left-[62%] top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_8px_currentColor]" />
                </div>

                <div className="relative h-7 rounded bg-surface-container flex items-center px-3 overflow-hidden text-xs">
                  <span className="text-on-surface-variant font-medium z-10">T2: B-Roll 4K UGC Reel</span>
                  <div className="absolute left-[15%] top-0 bottom-0 w-1/2 bg-surface-bright rounded" />
                  <div className="absolute left-[68%] top-0 bottom-0 w-1/4 bg-surface-bright rounded" />
                  <div className="absolute left-[62%] top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_8px_currentColor]" />
                </div>

                <div className="relative h-7 rounded bg-surface-container flex items-center px-3 overflow-hidden text-xs">
                  <span className="text-tertiary font-medium z-10">T3: Audio Master (Stereo 48kHz)</span>
                  <div className="absolute inset-y-1 left-24 right-4 flex items-center justify-around opacity-40">
                    <span className="w-1 h-2 bg-tertiary rounded-full" />
                    <span className="w-1 h-4 bg-tertiary rounded-full" />
                    <span className="w-1 h-3 bg-tertiary rounded-full" />
                    <span className="w-1 h-5 bg-tertiary rounded-full" />
                    <span className="w-1 h-2 bg-tertiary rounded-full" />
                    <span className="w-1 h-4 bg-tertiary rounded-full" />
                  </div>
                  <div className="absolute left-[62%] top-0 bottom-0 w-0.5 bg-primary z-20 shadow-[0_0_8px_currentColor]" />
                </div>
              </div>

              {/* Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline">Session State</span>
                    <span className="font-mono text-xs text-on-surface font-semibold">Active & Queued</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
                  <Lock className="w-3.5 h-3.5 text-tertiary" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline">Access Protocol</span>
                    <span className="font-mono text-xs text-on-surface font-semibold">Encrypted Vault</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
                  <Layers className="w-3.5 h-3.5 text-secondary" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-outline">Protected Projects</span>
                    <span className="font-mono text-xs text-on-surface font-semibold">34 Active Cuts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-container space-y-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <h2 className="text-xs font-semibold text-on-surface">Zero Data Loss</h2>
                </div>
                <p className="text-xs text-on-surface-variant">All footage, drafts & campaign bounties remain synced.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container space-y-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-tertiary">
                  <ShieldCheck className="w-4 h-4" />
                  <h2 className="text-xs font-semibold text-on-surface">Enterprise Guard</h2>
                </div>
                <p className="text-xs text-on-surface-variant">Multi-layer session invalidation on reset prevents breaches.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container space-y-1 border border-outline-variant/20">
                <div className="flex items-center gap-1.5 text-secondary">
                  <Activity className="w-4 h-4" />
                  <h2 className="text-xs font-semibold text-on-surface">Instant Return</h2>
                </div>
                <p className="text-xs text-on-surface-variant">One-click transition directly back into your active timeline.</p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Multi-Step Recovery Shell (45%)             */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Step Navigation Pill Indicator */}
            <div className="rounded-xl bg-surface-container p-1 flex items-center justify-between gap-1 shadow-inner border border-outline-variant/20">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${step === 1 ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              >
                1. Reset
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${step === 2 ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              >
                2. Sent
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${step === 3 ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              >
                3. New Pass
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${step === 4 ? 'bg-primary text-on-primary shadow-sm' : 'text-outline hover:text-on-surface'}`}
              >
                4. Done
              </button>
            </div>

            {/* Dynamic Card Shell */}
            <div className="rounded-2xl bg-surface-container-low p-6 sm:p-7 shadow-2xl relative min-h-[500px] flex flex-col justify-between border border-outline-variant/30">
              {/* STEP 1: Enter Email */}
              {step === 1 && (
                <div className="flex flex-col space-y-5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      STEP 1 OF 3 • ACCOUNT RECOVERY
                    </span>
                    <span className="font-mono text-xs text-outline">SEC-AUTH-01</span>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">
                      Forgot your password?
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Enter your workstation email address and we'll send you an encrypted link to reset your password.
                    </p>
                  </div>

                  <form className="space-y-4 pt-2" onSubmit={handleSendLink}>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-on-surface" htmlFor="recovery-email">
                        Workstation Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="recovery-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="editor@clipflow.studio"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm placeholder:text-outline border border-outline-variant/30 focus:border-primary focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                        />
                      </div>
                      <span className="block text-[11px] text-outline">
                        Enter the email associated with your creator workspace.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-secondary-container hover:brightness-110 active:scale-[0.98] text-on-primary font-display text-sm font-semibold shadow-lg shadow-primary-container/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-center">
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Sign In
                      </Link>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-container flex items-start gap-2.5 border border-outline-variant/20">
                      <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-on-surface-variant">
                        For security, password recovery links automatically expire after <strong>15 minutes</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Email Dispatched */}
              {step === 2 && (
                <div className="flex flex-col space-y-5 text-center animate-fadeIn">
                  <div className="flex items-center justify-between text-left">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      STEP 2 OF 3 • LINK DISPATCHED
                    </span>
                    <span className="font-mono text-xs text-outline">SEC-DISPATCH</span>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container shadow-xl border border-outline-variant/30 text-primary">
                      <Mail className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">Check your email</h2>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      If an account exists for <span className="text-on-surface font-semibold underline decoration-primary">{email}</span>, you will receive password reset instructions shortly.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between border border-outline-variant/20 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-outline" />
                        <span>Resend available in <strong className="text-primary">{resendCooldown}s</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-2.5 py-1 rounded bg-surface-variant text-xs text-on-surface hover:text-primary transition"
                      >
                        Open Reset Form
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-inverse-primary text-on-primary font-display text-sm font-semibold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Simulate Opening Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Enter New Password */}
              {step === 3 && (
                <div className="flex flex-col space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 text-primary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      STEP 3 OF 3 • SECURE CREDENTIALS
                    </span>
                    <span className="font-mono text-xs text-outline">TOKEN-VALID</span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">Set a new password</h2>
                    <p className="text-xs text-on-surface-variant">
                      Choose a strong password to protect your Clipflow workstation and campaign balances.
                    </p>
                  </div>

                  <form className="space-y-3 pt-1" onSubmit={handleResetPassword}>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-on-surface" htmlFor="new-pass">New Password</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="new-pass"
                          type={showPass ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-on-surface" htmlFor="confirm-pass">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="confirm-pass"
                          type={showPass ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Password Strength Checklist */}
                    <div className="space-y-2 p-3 rounded-lg bg-surface-container border border-outline-variant/20">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface font-medium">Security Strength: <strong className="text-tertiary">Optimal (90%)</strong></span>
                        <span className="text-tertiary font-mono text-[10px]">VERIFIED</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] text-tertiary">
                        <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 8+ characters</div>
                        <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Upper & number</div>
                        <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Special symbol (@#$!)</div>
                        <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Passwords match</div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container via-inverse-primary to-secondary-container hover:brightness-110 active:scale-[0.98] text-on-primary font-display text-sm font-semibold shadow-lg shadow-primary-container/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Reset Password & Update Studio</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 4: Reset Complete */}
              {step === 4 && (
                <div className="flex flex-col space-y-5 text-center animate-fadeIn">
                  <div className="flex items-center justify-between text-left">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      RECOVERY COMPLETE
                    </span>
                    <span className="font-mono text-xs text-tertiary">SUCCESS-200</span>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-container shadow-2xl text-tertiary border border-tertiary/30">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-display text-2xl text-on-surface font-bold tracking-tight">Password updated!</h2>
                    <p className="text-sm text-on-surface-variant">
                      Your workstation password has been successfully reset. You can now access your projects and campaigns with your new credentials.
                    </p>
                  </div>

                  <div className="rounded-xl bg-surface-container p-3.5 space-y-2 text-xs border border-outline-variant/20 text-left">
                    <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
                      <span className="text-outline">Account</span>
                      <span className="text-on-surface font-medium">{email}</span>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
                      <span className="text-outline">Security Status</span>
                      <span className="text-tertiary font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                        Encrypted & Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-outline">Active Workstations</span>
                      <span className="font-mono text-on-surface">Invalidated on 3 devices</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/login"
                      className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-inverse-primary text-on-primary font-display text-sm font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Continue to Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 flex items-center justify-between text-outline text-xs border-t border-outline-variant/20">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
                  Protected by Studio Guard
                </span>
                <span className="font-mono text-on-surface-variant">State: {step}/4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
