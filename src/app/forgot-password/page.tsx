'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Key,
  Lock,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'verify' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Request failed');
      }

      if (json.devResetCode) {
        setDevCodeHint(json.devResetCode);
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Invalid or expired code');
      }
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/20 font-bold transition-transform group-hover:scale-105">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight font-headline">ClipFlow</div>
            <div className="text-[10px] text-[#71717a] font-mono uppercase tracking-wider">Creator Studio</div>
          </div>
        </Link>

        <div className="w-full rounded-2xl bg-[#121215] border border-white/[0.08] p-8 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'request' && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-white tracking-tight font-headline">
                  Reset password
                </h1>
                <p className="text-xs text-[#71717a] mt-1.5">
                  Enter your email address to generate a 6-digit recovery code
                </p>
              </div>

              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa] block">Email address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="editor@clipflow.studio"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all shadow-md shadow-[#6366f1]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Send Recovery Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="mb-5 text-center">
                <h1 className="text-xl font-bold text-white tracking-tight font-headline">
                  Enter recovery code
                </h1>
                <p className="text-xs text-[#71717a] mt-1.5">
                  Code expires in 15 minutes for <span className="text-white">{email}</span>
                </p>
              </div>

              {devCodeHint && (
                <div className="mb-4 p-3 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-xs text-[#a5b4fc] font-mono text-center">
                  Dev Mode Recovery Code: <strong className="text-white">{devCodeHint}</strong>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa] block">6-Digit Code</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono tracking-widest placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa] block">New Password (min. 6 chars)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Reset Password</span>
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Password updated</h2>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Your password has been reset securely. You can now sign in with your new credentials.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all"
              >
                <span>Sign In Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
