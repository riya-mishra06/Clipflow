'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Save,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');
  const [payoutDestination, setPayoutDestination] = useState('');
  const [notifications, setNotifications] = useState({
    bountyApproved: true,
    deadlineAlert: true,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const u = json.data;
          if (u) {
            setEmail(u.email || '');
            setDisplayName(u.displayName || '');
            setHandle(u.handle || '');
            setBio(u.bio || '');
            setTimeZone(u.timeZone || 'UTC');
            setPayoutDestination(u.payoutDestination || '');
            if (u.notifications) {
              setNotifications({
                bountyApproved: u.notifications.bountyApproved ?? true,
                deadlineAlert: u.notifications.deadlineAlert ?? true,
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'profile',
          displayName,
          handle,
          bio,
          timeZone,
          payoutDestination,
          notifications,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save settings');
      }

      await refreshUser();
      setProfileMsg({ type: 'success', text: 'Profile & studio preferences saved to Atlas!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setSavingPassword(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'password',
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setPasswordMsg({ type: 'success', text: 'Password updated securely!' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Password update failed' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        <span className="text-xs text-[#71717a] font-mono">Loading Studio Settings...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
            Creator Profile & Studio Settings
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Manage your creator identity, payout destination, notifications, and account security.
          </p>
        </div>

        {/* Profile & Preferences Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {profileMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981]'
                  : 'bg-red-500/10 border-red-500/25 text-red-400'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <User className="w-4 h-4 text-[#818cf8]" />
              <span>Profile Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Full Name / Studio Name *</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Account Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-xs text-[#71717a] cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Creator Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@yourhandle"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Timezone</label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Creator Bio</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short-form vertical video editor specializing in fast retention cuts..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Payout Destination (UPI / PayPal / Stripe ID)</span>
              </label>
              <input
                type="text"
                value={payoutDestination}
                onChange={(e) => setPayoutDestination(e.target.value)}
                placeholder="e.g. creator@okaxis or paypal.me/creator"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#818cf8]" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#09090b] border border-white/[0.08] cursor-pointer">
                <span className="text-[#e4e4e7]">Notify when a sponsor approves a bounty cut and funds release</span>
                <input
                  type="checkbox"
                  checked={notifications.bountyApproved}
                  onChange={() =>
                    setNotifications({ ...notifications, bountyApproved: !notifications.bountyApproved })
                  }
                  className="w-4 h-4 accent-[#6366f1] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#09090b] border border-white/[0.08] cursor-pointer">
                <span className="text-[#e4e4e7]">Send 24-hour deadline reminder before campaign submission closes</span>
                <input
                  type="checkbox"
                  checked={notifications.deadlineAlert}
                  onChange={() =>
                    setNotifications({ ...notifications, deadlineAlert: !notifications.deadlineAlert })
                  }
                  className="w-4 h-4 accent-[#6366f1] cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-5 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-all shadow-md shadow-[#6366f1]/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingProfile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile & Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Security / Change Password Form */}
        <form onSubmit={handleChangePassword} className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Key className="w-4 h-4 text-[#f59e0b]" />
            <span>Account Security • Change Password</span>
          </h2>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-[#10b981]/10 border-[#10b981]/25 text-[#10b981]'
                  : 'bg-red-500/10 border-red-500/25 text-red-400'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Current Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">New Password (min. 6 chars)</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
