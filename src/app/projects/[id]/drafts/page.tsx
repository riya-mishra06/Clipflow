'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Scissors,
  Download,
  Play,
  Upload,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Film
} from 'lucide-react';

interface DraftExport {
  id: string;
  version: string;
  filename: string;
  duration: string;
  resolution: string;
  renderTime: string;
  status: 'Ready' | 'Render Pending' | 'Rejected';
  filesize: string;
  qcPassed: boolean;
}

const INITIAL_DRAFTS: DraftExport[] = [
  {
    id: 'd-v2',
    version: 'v2.1 Master Export',
    filename: 'NeonPulse_Cut01_v2.1_ProRes60fps.mp4',
    duration: '0:45',
    resolution: '1080x1920 (60fps)',
    renderTime: '2 hours ago',
    status: 'Ready',
    filesize: '142 MB',
    qcPassed: true,
  },
  {
    id: 'd-v1',
    version: 'v1.0 Rough Cut',
    filename: 'NeonPulse_Cut01_v1.0_Draft.mp4',
    duration: '0:48',
    resolution: '1080x1920 (30fps)',
    renderTime: '1 day ago',
    status: 'Ready',
    filesize: '78 MB',
    qcPassed: false,
  },
];

export default function ProjectDraftsPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'proj-01';

  const [drafts, setDrafts] = useState<DraftExport[]>(INITIAL_DRAFTS);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateRender = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setDrafts((prev) => [
        {
          id: `d-v${prev.length + 1}`,
          version: `v${prev.length + 1}.0 Final Submission Cut`,
          filename: `NeonPulse_Cut01_v${prev.length + 1}_60fps.mp4`,
          duration: '0:45',
          resolution: '1080x1920 (60fps)',
          renderTime: 'Just now',
          status: 'Ready',
          filesize: '155 MB',
          qcPassed: true,
        },
        ...prev,
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0c0e13] text-[#e2e2e9] font-sans antialiased flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0e13]/90 backdrop-blur-md border-b border-[#2d2f39]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-[#111318] hover:bg-[#1e2029] border border-[#2d2f39] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Export Vault</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Drafts & Renders</h1>
          </div>
        </div>

        <button
          onClick={handleSimulateRender}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Encoding MP4...' : 'Upload New Render Cut'}</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Exported Timeline Versions</h2>
          <p className="text-xs text-[#9496a1] mt-1">
            Automated Quality Control (QC) verifies 9:16 vertical resolution, 60fps framerate, and loudness compliance before submitting to Whop/Content Rewards.
          </p>
        </div>

        {/* Drafts Listing */}
        <div className="rounded-2xl bg-[#111318] border border-[#2d2f39] divide-y divide-[#2d2f39] overflow-hidden">
          {drafts.map((d) => (
            <div key={d.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{d.version}</span>
                  {d.qcPassed ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>QC Approved</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20">
                      Framerate Warning (30fps)
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-[#9496a1]">{d.filename}</div>

                <div className="flex items-center gap-4 text-xs text-[#9496a1] pt-1">
                  <span>Duration: <span className="text-white">{d.duration}</span></span>
                  <span>•</span>
                  <span>Format: <span className="text-white">{d.resolution}</span></span>
                  <span>•</span>
                  <span>Size: <span className="text-white">{d.filesize}</span></span>
                  <span>•</span>
                  <span>Rendered {d.renderTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#cebdff] hover:text-white text-xs font-medium border border-[#2d2f39] transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Preview</span>
                </button>

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e2029] hover:bg-[#2d2f39] text-[#9496a1] hover:text-white text-xs font-medium border border-[#2d2f39] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <Link
                  href="/submissions"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#111318] text-xs font-bold transition-all shadow-md shadow-[#cebdff]/10"
                >
                  <span>Submit Cut</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
