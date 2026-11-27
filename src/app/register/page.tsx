'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, Lock, Mail, User as UserIcon, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create creator account.');
      }

      // 1. Immediately refresh and populate AuthContext state
      await refreshUser();

      // 2. Navigate to /welcome and refresh server components
      router.push('/welcome');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle hairline background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 group">
          <div className="w-9 h-9 rounded-xl bg-[#6366f1] flex items-center justify-center text-white shadow-lg shadow-[#6366f1]/20 font-bold transition-transform group-hover:scale-105">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight font-headline">ClipFlow</div>
            <div className="text-[10px] text-[#71717a] font-mono uppercase tracking-wider">Creator Studio</div>
          </div>
        </Link>

        {/* Minimalist Card */}
        <div className="w-full rounded-2xl bg-[#121215] border border-white/[0.08] p-8 shadow-2xl shadow-black/80">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-white tracking-tight font-headline">
              Create creator account
            </h1>
            <p className="text-xs text-[#71717a] mt-1.5">
              Get started with short-form video production & bounties
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Display Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa] block">
                Full name / Studio handle
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="studio_creator_name"
                  autoComplete="off"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa] block">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="new_studio_email"
                  autoComplete="new-password"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@cutroom.studio"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a1a1aa] block">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="new_studio_password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all shadow-md shadow-[#6366f1]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <p className="text-xs text-[#71717a]">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-[#818cf8] font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-[11px] text-[#52525b] text-center">
          By continuing you agree to Clipflow Terms of Service & Privacy Policy
        </div>
      </div>
    </div>
  );
}
