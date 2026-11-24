'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CloudUpload,
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface QueuedFile {
  id: string;
  name: string;
  size: string;
  type: 'video' | 'audio' | 'image' | 'document';
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export default function AssetUploadPage() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('Raw Footage');
  const [linkedProject, setLinkedProject] = useState('NeonPulse AI Glitch Cuts Pack');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['B-Roll', 'ProRes', '4K']);

  const [queue, setQueue] = useState<QueuedFile[]>([
    {
      id: 'q1',
      name: 'Cyberpunk_Streets_Night_ProRes422.mov',
      size: '1.4 GB',
      type: 'video',
      progress: 100,
      status: 'completed',
    },
    {
      id: 'q2',
      name: 'Synthwave_Bass_Hit_SubTransient.wav',
      size: '28 MB',
      type: 'audio',
      progress: 68,
      status: 'uploading',
    },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setQueue((prev) => [
        ...prev,
        {
          id: `q-${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.startsWith('video')
            ? 'video'
            : file.type.startsWith('audio')
            ? 'audio'
            : 'document',
          progress: 25,
          status: 'uploading',
        },
      ]);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-[white/[0.08]]/50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/assets"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-[white/[0.04]] border border-[white/[0.08]] text-[#9496a1] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#cebdff]">Vault Ingestion</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight">Upload Media Assets</h1>
          </div>
        </div>

        <Link
          href="/assets"
          className="px-4 py-1.5 rounded-xl bg-[#cebdff] hover:bg-[#d0bcff] text-[#121215] font-bold text-xs transition-colors shadow-md shadow-[#cebdff]/10"
        >
          View Library
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Ingest Media Assets</h2>
          <p className="text-xs text-[#9496a1] mt-1">
            Drop raw ProRes footage, uncompressed audio stems (.wav), vectors, or thumbnails. Automatic QC will verify bitrate and safe areas.
          </p>
        </div>

        {/* Drag & Drop Box */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`p-10 rounded-2xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center space-y-4 ${
            dragActive
              ? 'border-[#cebdff] bg-[#cebdff]/10 scale-[1.01]'
              : 'border-[white/[0.08]] bg-[#121215] hover:border-[#3b3d4a]'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[white/[0.04]] text-[#cebdff] flex items-center justify-center shadow-lg border border-[white/[0.08]]">
            <CloudUpload className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-bold text-white">
              Drag & Drop files here, or <span className="text-[#cebdff] cursor-pointer hover:underline">browse disk</span>
            </div>
            <p className="text-xs text-[#9496a1]">
              Supported: MP4, MOV (ProRes 422/4444), WAV (24-bit PCM), PNG, SVG up to 5 GB/file
            </p>
          </div>
        </div>

        {/* Folder & Metadata Selector */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-[white/[0.08]] space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-headline">
            Ingestion Metadata & Collection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Target Folder / Collection</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
              >
                <option value="Raw Footage">Raw Footage & B-Roll</option>
                <option value="Audio & SFX">Audio & Sound FX Stems</option>
                <option value="Thumbnails & Art">Thumbnails & Brand Art</option>
                <option value="Campaign Briefs">Campaign Creative Briefs</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Attach to Video Project</label>
              <select
                value={linkedProject}
                onChange={(e) => setLinkedProject(e.target.value)}
                className="w-full bg-[#161821] border border-[white/[0.08]] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#cebdff]"
              >
                <option value="NeonPulse AI Glitch Cuts Pack">NeonPulse AI Glitch Cuts Pack</option>
                <option value="Apex Esports Finals Round 4 Clutch">Apex Esports Finals Round 4 Clutch</option>
                <option value="Minimalist Tech Setup POV Series">Minimalist Tech Setup POV Series</option>
                <option value="Unassigned">Leave Unassigned in Vault</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">Tags (Press Enter to add)</label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-[#161821] border border-[white/[0.08]]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-[white/[0.04]] text-[#cebdff] text-xs font-mono flex items-center gap-1 border border-[white/[0.08]]"
                >
                  <span>#{t}</span>
                  <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => removeTag(t)} />
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent border-none text-xs text-white outline-none focus:ring-0 p-0 ml-1"
              />
            </div>
          </div>
        </div>

        {/* Upload Queue Progress */}
        <div className="p-6 rounded-2xl bg-[#121215] border border-[white/[0.08]] space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Upload Queue ({queue.length})</span>
            <span className="text-[#cebdff]">Vault Encrypted</span>
          </div>

          <div className="space-y-3">
            {queue.map((q) => (
              <div key={q.id} className="p-3.5 rounded-xl bg-[#09090b] border border-[white/[0.08]] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {q.type === 'video' ? (
                      <Film className="w-4 h-4 text-[#cebdff]" />
                    ) : (
                      <Music className="w-4 h-4 text-[#4edea3]" />
                    )}
                    <span className="font-medium text-white">{q.name}</span>
                    <span className="text-[#9496a1] font-mono text-[10px]">({q.size})</span>
                  </div>

                  {q.status === 'completed' ? (
                    <span className="text-[#4edea3] flex items-center gap-1 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[#cebdff] font-mono text-[11px]">{q.progress}%</span>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-[white/[0.04]] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      q.status === 'completed' ? 'bg-[#4edea3]' : 'bg-[#cebdff]'
                    }`}
                    style={{ width: `${q.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
