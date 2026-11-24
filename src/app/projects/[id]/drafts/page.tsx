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

export default function ProjectDraftsPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';

  // Real empty state: starts empty until user renders or uploads a cut
  const [drafts, setDrafts] = useState<DraftExport[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateRender = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setDrafts((prev) => [
        {
          id: `d-v${prev.length + 1}`,
          version: `v${prev.length + 1}.0 Final Submission Cut`,
          filename: `Project_Cut01_v${prev.length + 1}_60fps.mp4`,
          duration: '0:45',
          resolution: '1080x1920 (60fps)',
          renderTime: 'Just now',
          status: 'Ready',
          filesize: '142 MB',
          qcPassed: true,
        },
        ...prev,
      ]);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0e]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/projects/${projectId}`}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#a1a1aa] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#818cf8]">Export Vault</span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-tight">Drafts & Renders</h1>
          </div>
        </div>

        <button
          onClick={handleSimulateRender}
          disabled={isUploading}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-all shadow-sm"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploading ? 'Encoding MP4...' : 'Upload Render Cut'}</span>
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Exported Timeline Versions</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Automated Quality Control (QC) verifies 9:16 vertical resolution, 60fps framerate, and loudness compliance before submitting to sponsor escrow.
          </p>
        </div>

        {drafts.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Scissors className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No rendered drafts yet</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Export an MP4 cut from DaVinci or Premiere and upload it here to run automated QC checks.
            </p>
            <div className="pt-2">
              <button
                onClick={handleSimulateRender}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Render</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#121215] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden">
            {drafts.map((d) => (
              <div key={d.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{d.version}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981]">
                      QC Passed
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#71717a]">{d.filename}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white text-xs font-semibold">
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
