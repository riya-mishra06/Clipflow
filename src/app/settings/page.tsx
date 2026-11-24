'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Shield,
  Key,
  Bell,
  Film,
  CheckCircle2,
  Save,
  Instagram,
  Youtube,
  ExternalLink
} from 'lucide-react';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('Marcus Vance');
  const [handle, setHandle] = useState('@marcus.cuts');
  const [bio, setBio] = useState('Short-form vertical video editor specializing in fast retention cuts & AI motion.');
  const [notifications, setNotifications] = useState({
    bountyApproved: true,
    deadlineAlert: true,
    newHighYieldCampaign: true,
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline">Creator Profile & Studio Settings</h1>
          <p className="text-xs text-[#9496a1] mt-1">Manage public creator credentials, notifications, and API security keys.</p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-[#cebdff]" />
            <span>Profile Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Creator Handle</label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Creator Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#161821] border border-[#2d2f39] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
            />
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="p-6 rounded-2xl bg-[#111318] border border-[#2d2f39] space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#cebdff]" />
            <span>Email & Webhook Alerts</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e13] border border-[#2d2f39] cursor-pointer">
              <span>Notify when a sponsor approves a bounty cut and funds release</span>
              <input
                type="checkbox"
                checked={notifications.bountyApproved}
                onChange={() => setNotifications({ ...notifications, bountyApproved: !notifications.bountyApproved })}
                className="w-4 h-4 accent-[#cebdff] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e13] border border-[#2d2f39] cursor-pointer">
              <span>Send 24-hour deadline reminder before campaign submission closes</span>
              <input
                type="checkbox"
                checked={notifications.deadlineAlert}
                onChange={() => setNotifications({ ...notifications, deadlineAlert: !notifications.deadlineAlert })}
                className="w-4 h-4 accent-[#cebdff] cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button className="px-5 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10 flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
