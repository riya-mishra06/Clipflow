'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CloudUpload,
  Link2,
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface ProjectOption {
  _id: string;
  title: string;
}

export default function AssetUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<'upload' | 'link'>('upload');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'video' | 'audio' | 'image' | 'document'>('video');
  const [sizeBytes, setSizeBytes] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>('');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['B-Roll', '9:16']);

  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const json = await res.json();
          setProjects(json.data || []);
        }
      } catch {
        // Non-blocking: user can still upload without linking a project
      }
    }
    loadProjects();
  }, []);

  const detectCategoryFromFile = (file: File): 'video' | 'audio' | 'image' | 'document' => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('image/')) return 'image';
    return 'document';
  };

  const applySelectedFile = (file: File) => {
    setKind('upload');
    setName(file.name);
    setSizeBytes(file.size);
    setMimeType(file.type || 'application/octet-stream');
    setCategory(detectCategoryFromFile(file));
    setError(null);
  };

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
      applySelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      applySelectedFile(e.target.files[0]);
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

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 MB';
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide an asset name or select a file.');
      return;
    }

    if (kind === 'link' && !externalUrl.trim()) {
      setError('Please enter an external Drive, Dropbox, or media URL.');
      return;
    }

    setSubmitting(true);
    try {
      const matchedProject = projects.find((p) => p._id === selectedProjectId);

      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          kind,
          category,
          mimeType: mimeType || undefined,
          sizeBytes: kind === 'upload' ? sizeBytes : 0,
          externalUrl: kind === 'link' ? externalUrl.trim() : undefined,
          tags,
          projectId: selectedProjectId || undefined,
          projectTitle: matchedProject?.title || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save asset');
      }

      router.push('/assets');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/assets"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold text-[#818cf8]">Vault Ingestion</span>
            <h1 className="text-base font-bold text-white tracking-tight">Add Media Asset</h1>
          </div>
        </div>

        <Link
          href="/assets"
          className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-xs border border-white/[0.08] transition-colors"
        >
          View Library
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-headline">Stage Media in Vault</h2>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Register local footage metadata or attach cloud links (Google Drive, Dropbox, Frame.io) to your studio vault.
          </p>
        </div>

        {/* Mode Toggle: File Metadata vs Cloud Link */}
        <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-[#121215] border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setKind('upload')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              kind === 'upload'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <CloudUpload className="w-3.5 h-3.5" />
            <span>Local File Metadata</span>
          </button>
          <button
            type="button"
            onClick={() => setKind('link')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
              kind === 'link'
                ? 'bg-[#6366f1] text-white shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>External Cloud Link</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {kind === 'upload' && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all text-center flex flex-col items-center justify-center space-y-3 ${
                dragActive
                  ? 'border-[#6366f1] bg-[#6366f1]/10'
                  : 'border-white/[0.1] bg-[#121215] hover:border-white/[0.25]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="video/*,audio/*,image/*,.pdf,.srt,.txt"
              />
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-[#818cf8] flex items-center justify-center border border-white/[0.08]">
                <CloudUpload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  Drag & drop a file here, or <span className="text-[#818cf8] underline">browse computer</span>
                </div>
                <div className="text-[11px] text-[#71717a]">
                  Supports MP4, MOV, WAV, PNG, SRT • Extracts file name, type & size automatically
                </div>
              </div>

              {name && sizeBytes > 0 && (
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/25 text-[#10b981] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{name} ({formatFileSize(sizeBytes)})</span>
                </div>
              )}
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-5">
            {/* Asset Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Asset Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cyberpunk_B_Roll_4K.mov or Voiceover_Stem.wav"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
            </div>

            {/* External URL if Link mode */}
            {kind === 'link' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Cloud Media URL *</label>
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... or https://frame.io/..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            )}

            {/* Category + Linked Project */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Media Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'video', label: 'Video', icon: Film },
                    { id: 'audio', label: 'Audio', icon: Music },
                    { id: 'image', label: 'Image', icon: ImageIcon },
                    { id: 'document', label: 'Doc', icon: FileText },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id as any)}
                        className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors ${
                          category === cat.id
                            ? 'bg-[#6366f1]/20 border-[#6366f1] text-white'
                            : 'bg-white/[0.02] border-white/[0.08] text-[#71717a] hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Attach to Project (Optional)</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="">No project linked yet</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Tags (Press Enter to add)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag like ProRes, SFX, Hook..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1]"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#a1a1aa] font-mono"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-[#71717a] hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-bold transition-colors shadow-lg shadow-[#6366f1]/20 flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Atlas...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Save Asset to Vault</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
