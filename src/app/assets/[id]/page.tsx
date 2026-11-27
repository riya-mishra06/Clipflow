'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Check,
  Link2,
  CheckCircle2,
  Download
} from 'lucide-react';

interface AssetDetail {
  _id: string;
  name: string;
  kind: 'upload' | 'link';
  category: 'video' | 'audio' | 'image' | 'document' | 'transcript' | 'other';
  mimeType?: string;
  sizeBytes?: number;
  externalUrl?: string;
  objectKey?: string;
  projectTitle?: string;
  tags: string[];
  status: string;
  createdAt: string;
}

export default function AssetDetailsPage() {
  const params = useParams();
  const assetId = params?.id as string;

  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAsset() {
      if (!assetId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/assets/${assetId}`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Asset not found');
        }
        setAsset(json.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load asset details');
      } finally {
        setLoading(false);
      }
    }
    loadAsset();
  }, [assetId]);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(asset?.externalUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'External Cloud Link';
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getCategoryIcon = (cat: AssetDetail['category']) => {
    switch (cat) {
      case 'video':
        return <Film className="w-10 h-10 text-[#818cf8]" />;
      case 'audio':
        return <Music className="w-10 h-10 text-[#10b981]" />;
      case 'image':
        return <ImageIcon className="w-10 h-10 text-[#f59e0b]" />;
      default:
        return <FileText className="w-10 h-10 text-[#a1a1aa]" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="w-7 h-7 text-[#6366f1] animate-spin" />
        <span className="text-xs text-[#71717a] font-mono">Loading Asset Inspector...</span>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="text-lg font-bold text-white">Asset Not Found</div>
        <p className="text-xs text-[#71717a] max-w-sm">
          {error || "This asset doesn't exist or you don't have permission to view it."}
        </p>
        <Link
          href="/assets"
          className="px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
        >
          Return to Asset Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <header className="sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-md border-b border-white/[0.08] px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/assets"
            className="p-1.5 rounded-lg bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-[#71717a] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6366f1]/15 text-[#818cf8]">
                Asset Inspector
              </span>
              <span className="text-xs text-[#71717a] font-mono">ID: {asset._id.slice(-6)}</span>
            </div>
            <h1 className="text-base font-bold text-white tracking-tight truncate max-w-md">
              {asset.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121215] hover:bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-[#a1a1aa] hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {asset.objectKey && (
            <a
              href={`/api/assets/${asset._id}/media?download=1`}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}

          {asset.externalUrl && (
            <a
              href={asset.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs transition-all"
            >
              <span>Open External Media</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Preview Panel */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#121215] border border-white/[0.08] p-6 flex flex-col items-center justify-center min-h-[360px] space-y-4 text-center">
            {asset.objectKey && asset.category === 'video' ? (
              <video
                src={`/api/assets/${asset._id}/media`}
                controls
                className="w-full max-h-[420px] rounded-xl bg-black border border-white/[0.08]"
              />
            ) : asset.objectKey && asset.category === 'audio' ? (
              <div className="w-full max-w-md space-y-4 py-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  {getCategoryIcon(asset.category)}
                </div>
                <audio src={`/api/assets/${asset._id}/media`} controls className="w-full" />
              </div>
            ) : asset.objectKey && asset.category === 'image' ? (
              <img
                src={`/api/assets/${asset._id}/media`}
                alt={asset.name}
                className="max-h-[420px] rounded-xl object-contain border border-white/[0.08]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                {getCategoryIcon(asset.category)}
              </div>
            )}

            <div className="space-y-1 max-w-md">
              <div className="text-base font-bold text-white break-all">{asset.name}</div>
              <div className="text-xs text-[#71717a] font-mono uppercase">
                {asset.category} • {asset.kind === 'link' ? 'Cloud Reference' : formatSize(asset.sizeBytes)}
              </div>
            </div>

            {asset.externalUrl ? (
              <a
                href={asset.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366f1]/15 hover:bg-[#6366f1]/25 text-[#818cf8] border border-[#6366f1]/30 text-xs font-semibold transition-colors"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Open Source URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs text-[#10b981] font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>{asset.objectKey ? 'Stored in Local Media Vault' : 'Metadata Staged in Vault'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Metadata Specs */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Technical Metadata
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#71717a]">Category</span>
                <span className="text-white font-mono uppercase">{asset.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#71717a]">Storage Type</span>
                <span className="text-white font-mono capitalize">{asset.kind}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#71717a]">Size</span>
                <span className="text-white font-mono">{formatSize(asset.sizeBytes)}</span>
              </div>
              {asset.mimeType && (
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-[#71717a]">MIME Type</span>
                  <span className="text-white font-mono">{asset.mimeType}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-white/[0.06]">
                <span className="text-[#71717a]">Linked Project</span>
                <span className="text-white font-medium">{asset.projectTitle || 'None'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#71717a]">Added On</span>
                <span className="text-white font-mono">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {asset.tags && asset.tags.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] text-[#71717a] uppercase font-mono">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#a1a1aa] font-mono"
                    >
                      #{t.replace(/^#/, '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
