'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  CloudUpload,
  Link2,
  MessageSquare,
  FolderOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Film,
  Image as ImageIcon,
  Music,
  Globe,
} from 'lucide-react';
import {
  detectFileInput,
  detectUrlInput,
  InputSourceKind,
  UniversalInputItem,
} from '@/lib/inputDetector';

interface VaultAsset {
  _id: string;
  name: string;
  category: string;
  mimeType?: string;
  sizeBytes?: number;
  objectKey?: string;
}

interface UniversalInputProps {
  items: UniversalInputItem[];
  onChange: React.Dispatch<React.SetStateAction<UniversalInputItem[]>>;
  multiple?: boolean;
  promptText?: string;
  onPromptTextChange?: (val: string) => void;
  title?: string;
}

const SOURCE_KIND_OPTIONS: Array<{ value: InputSourceKind; label: string }> = [
  { value: 'video', label: 'Video File' },
  { value: 'image', label: 'Image Reference' },
  { value: 'audio', label: 'Audio File' },
  { value: 'document', label: 'Document / Script' },
  { value: 'subtitle', label: 'Subtitle (SRT/VTT)' },
  { value: 'url_video', label: 'Video Reference URL' },
  { value: 'url_social', label: 'Social Media URL' },
  { value: 'url_product', label: 'Product / Affiliate URL' },
  { value: 'url_website', label: 'Website Reference' },
  { value: 'text_prompt', label: 'Text Prompt' },
  { value: 'existing_asset', label: 'Existing Asset' },
];

export default function UniversalInput({
  items,
  onChange,
  multiple = true,
  promptText = '',
  onPromptTextChange,
  title = 'Universal Multimodal Input',
}: UniversalInputProps) {
  const [tab, setTab] = useState<'upload' | 'link' | 'prompt' | 'library'>('upload');
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [urlInput, setUrlInput] = useState('');
  const [ingestingUrl, setIngestingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [vaultAssets, setVaultAssets] = useState<VaultAsset[]>([]);
  const [loadingVault, setLoadingVault] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab !== 'library' || vaultAssets.length > 0) return;
    let active = true;
    const t = setTimeout(() => {
      if (!active) return;
      setLoadingVault(true);
      fetch('/api/assets', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : { data: [] }))
        .then((j) => {
          if (active) setVaultAssets((j.data || []).filter((a: VaultAsset) => Boolean(a.objectKey)));
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoadingVault(false);
        });
    }, 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [tab, vaultAssets.length]);

  const appendItem = (nextItem: UniversalInputItem) => {
    onChange((prev) => (multiple ? [...prev, nextItem] : [nextItem]));
  };

  const updateItem = (id: string, patch: Partial<UniversalInputItem>) => {
    onChange((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeItem = (id: string) => {
    onChange((prev) => prev.filter((it) => it.id !== id));
  };

  const uploadSingleFile = (file: File) => {
    const id = `in-${crypto.randomUUID().slice(0, 8)}`;
    const detected = detectFileInput(file.name, file.type);

    appendItem({
      id,
      kind: detected.kind,
      platform: detected.platform,
      supportLevel: detected.supportLevel,
      label: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      status: detected.supportLevel === 'unsupported' ? 'error' : 'uploading',
      error: detected.supportLevel === 'unsupported' ? detected.explanation : undefined,
    });

    if (detected.supportLevel === 'unsupported') return;

    const form = new FormData();
    form.append('file', file);
    form.append('name', file.name);
    if (detected.kind === 'video') form.append('category', 'video');
    else if (detected.kind === 'image') form.append('category', 'image');
    else if (detected.kind === 'audio') form.append('category', 'audio');
    else if (detected.kind === 'subtitle') form.append('category', 'transcript');
    else form.append('category', 'document');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/assets/upload');
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setUploadProgress((p) => ({ ...p, [id]: Math.round((ev.loaded / ev.total) * 100) }));
      }
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300 && json.data?._id) {
          updateItem(id, {
            assetId: json.data._id,
            status: 'ready',
            thumbnailUrl: detected.kind === 'image' ? `/api/assets/${json.data._id}/media` : undefined,
          });
        } else {
          updateItem(id, { status: 'error', error: json.error || `Upload failed (${xhr.status})` });
        }
      } catch {
        updateItem(id, { status: 'error', error: 'Invalid server response during upload' });
      }
    };
    xhr.onerror = () => {
      updateItem(id, { status: 'error', error: 'Network error during upload' });
    };
    xhr.send(form);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = multiple ? Array.from(files) : [files[0]];
    for (const f of list) uploadSingleFile(f);
  };

  const handleIngestUrls = async (raw: string) => {
    const lines = raw
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    setUrlError(null);
    setIngestingUrl(true);

    const targets = multiple ? lines : [lines[0]];
    for (const url of targets) {
      const id = `url-${crypto.randomUUID().slice(0, 8)}`;
      const previewDetect = detectUrlInput(url);
      appendItem({
        id,
        kind: previewDetect.kind,
        platform: previewDetect.platform,
        supportLevel: previewDetect.supportLevel,
        label: previewDetect.label,
        url,
        status: 'ingesting',
      });

      try {
        const res = await fetch('/api/inputs/ingest-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const json = await res.json();
        if (!res.ok) {
          updateItem(id, { status: 'error', error: json.error || 'URL import failed' });
          setUrlError(json.error || 'URL import failed');
          continue;
        }
        const d = json.data;
        updateItem(id, {
          kind: d.detected.kind,
          platform: d.detected.platform,
          supportLevel: d.detected.supportLevel,
          label: d.title || url,
          assetId: d.asset?._id,
          thumbnailUrl: d.thumbnailUrl || (d.asset?._id && d.detected.kind === 'image' ? `/api/assets/${d.asset._id}/media` : undefined),
          metadata: {
            title: d.title,
            description: d.description,
            textExcerpt: d.textExcerpt,
            notice: d.notice,
            importMode: d.importMode,
          },
          status: d.importMode === 'reference_only' ? 'reference_only' : 'ready',
        });
      } catch (err: any) {
        updateItem(id, { status: 'error', error: err?.message || 'URL request failed' });
      }
    }

    setUrlInput('');
    setIngestingUrl(false);
  };

  const attachVaultAsset = (a: VaultAsset) => {
    const kind: InputSourceKind =
      a.category === 'video'
        ? 'video'
        : a.category === 'image'
        ? 'image'
        : a.category === 'audio'
        ? 'audio'
        : a.category === 'transcript'
        ? 'subtitle'
        : 'document';
    appendItem({
      id: `lib-${a._id}-${crypto.randomUUID().slice(0, 4)}`,
      kind,
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: a.name,
      assetId: a._id,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      thumbnailUrl: a.category === 'image' ? `/api/assets/${a._id}/media` : undefined,
      status: 'ready',
    });
  };

  const renderIcon = (kind: InputSourceKind) => {
    if (kind === 'video' || kind === 'url_video') return <Film className="w-4 h-4 text-[#818cf8]" />;
    if (kind === 'image') return <ImageIcon className="w-4 h-4 text-[#10b981]" />;
    if (kind === 'audio') return <Music className="w-4 h-4 text-[#f59e0b]" />;
    if (kind === 'url_social' || kind === 'url_product' || kind === 'url_website') {
      return <Globe className="w-4 h-4 text-[#38bdf8]" />;
    }
    return <FileText className="w-4 h-4 text-[#a1a1aa]" />;
  };

  return (
    <div className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-white">{title}</span>
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[#09090b] border border-white/[0.08]">
          {[
            { key: 'upload', label: 'Upload Files', Icon: CloudUpload },
            { key: 'link', label: 'Paste Link', Icon: Link2 },
            { key: 'prompt', label: 'Enter Prompt', Icon: MessageSquare },
            { key: 'library', label: 'Asset Library', Icon: FolderOpen },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as any)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
                tab === key ? 'bg-[#6366f1] text-white' : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`p-6 rounded-xl border border-dashed cursor-pointer text-center space-y-1.5 transition-colors ${
            dragging
              ? 'border-[#6366f1] bg-[#6366f1]/10'
              : 'border-white/[0.15] hover:border-[#6366f1]/70 bg-[#09090b]'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            multiple={multiple}
            accept=".mp4,.mov,.webm,.mkv,.jpg,.jpeg,.png,.webp,.mp3,.wav,.aac,.m4a,.pdf,.txt,.json,.srt,.vtt"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <CloudUpload className="w-6 h-6 text-[#818cf8] mx-auto" />
          <div className="text-xs font-semibold text-white">
            Drag & drop or click to browse {multiple ? 'files' : 'a file'}
          </div>
          <div className="text-[11px] text-[#71717a]">
            Video (MP4/MOV/WebM/MKV) · Images (JPG/PNG/WebP) · Audio (MP3/WAV/AAC/M4A) · Docs (PDF/TXT/JSON/SRT/VTT)
          </div>
        </div>
      )}

      {tab === 'link' && (
        <div className="space-y-2">
          {urlError && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] text-red-400 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{urlError}</span>
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                multiple
                  ? 'Paste one or more HTTPS URLs (YouTube, Instagram, TikTok, Twitch, product page, or direct media)...'
                  : 'Paste an HTTPS URL...'
              }
              className="flex-1 bg-[#09090b] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
            />
            <button
              type="button"
              disabled={ingestingUrl || !urlInput.trim()}
              onClick={() => handleIngestUrls(urlInput)}
              className="px-4 py-2 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 self-start"
            >
              {ingestingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
              <span>Import</span>
            </button>
          </div>
        </div>
      )}

      {tab === 'prompt' && (
        <textarea
          rows={3}
          value={promptText}
          onChange={(e) => onPromptTextChange?.(e.target.value)}
          placeholder="Enter instructions, product context, script notes, or multimodal analysis prompt..."
          className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1]"
        />
      )}

      {tab === 'library' && (
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {loadingVault ? (
            <div className="p-4 text-center text-xs text-[#71717a]">Loading Clipflow Vault...</div>
          ) : vaultAssets.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#71717a]">No local vault assets found yet.</div>
          ) : (
            vaultAssets.map((a) => (
              <div
                key={a._id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#09090b] border border-white/[0.06] text-xs"
              >
                <div className="min-w-0">
                  <div className="text-white font-medium truncate">{a.name}</div>
                  <div className="text-[10px] text-[#71717a] font-mono uppercase">{a.category}</div>
                </div>
                <button
                  type="button"
                  onClick={() => attachVaultAsset(a)}
                  className="px-2.5 py-1 rounded-md bg-white/[0.06] hover:bg-[#6366f1] text-white text-[11px] font-semibold shrink-0"
                >
                  Attach
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="text-[11px] font-mono text-[#71717a] uppercase tracking-wider">
            Attached Inputs ({items.length})
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-[#09090b] border border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.label}
                    className="w-9 h-9 rounded-lg object-cover border border-white/[0.1] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    {renderIcon(item.kind)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-white font-semibold truncate">{item.label}</div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#71717a] font-mono mt-0.5">
                    <span className="text-[#818cf8] uppercase">{item.platform}</span>
                    {item.status === 'uploading' && (
                      <span className="text-[#f59e0b]">Uploading {uploadProgress[item.id] ?? 0}%</span>
                    )}
                    {item.status === 'ingesting' && <span className="text-[#f59e0b]">Inspecting URL...</span>}
                    {item.status === 'ready' && (
                      <span className="text-[#10b981] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    )}
                    {item.status === 'reference_only' && (
                      <span className="text-[#38bdf8]">Reference Only</span>
                    )}
                    {item.status === 'error' && (
                      <span className="text-red-400">{item.error || 'Error'}</span>
                    )}
                  </div>
                  {typeof item.metadata?.notice === 'string' && (
                    <div className="text-[10px] text-[#a1a1aa] mt-0.5">{item.metadata.notice}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <select
                  aria-label={`Source type for ${item.label}`}
                  value={item.kind}
                  onChange={(e) => updateItem(item.id, { kind: e.target.value as InputSourceKind })}
                  className="bg-[#121215] border border-white/[0.08] rounded-lg px-2 py-1 text-[11px] text-white"
                >
                  {SOURCE_KIND_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {item.status === 'error' && item.url && (
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.id);
                      void handleIngestUrls(item.url!);
                    }}
                    title="Retry URL import"
                    className="p-1.5 rounded-lg text-[#f59e0b] hover:bg-white/[0.06]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.label}`}
                  className="p-1.5 rounded-lg text-[#71717a] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
