'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Film, Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
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
          {!submitted ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-white tracking-tight font-headline">
                  Reset password
                </h1>
                <p className="text-xs text-[#71717a] mt-1.5">
                  Enter your email address and we will send you a recovery link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#a1a1aa] block">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="editor@clipflow.studio"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs transition-all shadow-md shadow-[#6366f1]/20 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Send Recovery Instructions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Check your email</h2>
              <p className="text-xs text-[#71717a] leading-relaxed">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>. Click the link to set a new password.
              </p>
            </div>
          )}

          {/* Footer switch */}
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

        {/* Footnote */}
        <div className="mt-6 text-[11px] text-[#52525b] text-center">
          Need help? Contact support@clipflow.studio
        </div>
      </div>
    </div>
  );
}
