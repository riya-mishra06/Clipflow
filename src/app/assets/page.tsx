'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  Search,
  CloudUpload,
  Layers,
  HardDrive,
  Trash2,
  Pencil,
  ExternalLink,
  Loader2,
  Link2,
  X,
  AlertCircle,
  RotateCcw,
  Clock
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface AssetRecord {
  _id: string;
  name: string;
  kind: 'upload' | 'link';
  category: 'video' | 'audio' | 'image' | 'document' | 'transcript' | 'other';
  sizeBytes?: number;
  externalUrl?: string;
  projectTitle?: string;
  tags: string[];
  deletedAt?: string | null;
  expireAt?: string | null;
  createdAt: string;
}

export default function AssetLibraryPage() {
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'vault' | 'trash'>('vault');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'audio' | 'image' | 'document'>('all');
  const [search, setSearch] = useState('');

  // Edit Modal State
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<AssetRecord['category']>('video');
  const [editUrl, setEditUrl] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete / Permanent Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<AssetRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setAssets([]);
      try {
        const params = new URLSearchParams();
        if (viewMode === 'trash') params.set('trash', 'true');
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

        const res = await fetch(`/api/assets?${params.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          setAssets(json.data || []);
        } else {
          setAssets([]);
        }
      } catch (err) {
        console.error('Failed to fetch assets:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, [viewMode, selectedCategory, debouncedSearch]);

  const openEditModal = (asset: AssetRecord) => {
    setEditingAsset(asset);
    setEditName(asset.name);
    setEditCategory(asset.category);
    setEditUrl(asset.externalUrl || '');
    setEditTagsInput((asset.tags || []).join(', '));
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    setEditError(null);
    setSavingEdit(true);

    try {
      const parsedTags = editTagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const res = await fetch(`/api/assets/${editingAsset._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          category: editCategory,
          externalUrl: editingAsset.kind === 'link' ? editUrl.trim() : undefined,
          tags: parsedTags,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to update asset');
      }

      setAssets((prev) =>
        prev.map((item) => (item._id === editingAsset._id ? json.data : item))
      );
      setEditingAsset(null);
    } catch (err: any) {
      setEditError(err.message || 'Update failed');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const url =
        viewMode === 'trash'
          ? `/api/assets/${deleteTarget._id}?permanent=true`
          : `/api/assets/${deleteTarget._id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        setAssets((prev) => prev.filter((item) => item._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error('Delete asset failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async (asset: AssetRecord) => {
    setRestoringId(asset._id);
    try {
      const res = await fetch(`/api/assets/${asset._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore' }),
      });
      if (res.ok) {
        setAssets((prev) => prev.filter((item) => item._id !== asset._id));
      }
    } catch (err) {
      console.error('Restore asset failed:', err);
    } finally {
      setRestoringId(null);
    }
  };

  const getDaysRemaining = (expireAt?: string | null) => {
    if (!expireAt) return 7;
    const diffMs = new Date(expireAt).getTime() - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(1, days);
  };

  const totalStorageLabel = useMemo(() => {
    const totalBytes = assets.reduce((sum, a) => sum + (a.sizeBytes || 0), 0);
    if (totalBytes === 0) return '0 MB / 100 GB';
    if (totalBytes >= 1024 * 1024 * 1024) {
      return `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB / 100 GB`;
    }
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB / 100 GB`;
  }, [assets]);

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'Cloud Link';
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getCategoryIcon = (cat: AssetRecord['category']) => {
    switch (cat) {
      case 'video':
        return <Film className="w-4 h-4 text-[#818cf8]" />;
      case 'audio':
        return <Music className="w-4 h-4 text-[#10b981]" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-[#f59e0b]" />;
      default:
        return <FileText className="w-4 h-4 text-[#a1a1aa]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Asset Library
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Centralized repository for raw 4K B-Roll, uncompressed audio stems (.wav), sound effects, and cloud links.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Clear Vault vs Trash (7d) Switcher */}
            <div className="inline-flex p-1 rounded-lg bg-[#121215] border border-white/[0.08]">
              <button
                onClick={() => setViewMode('vault')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  viewMode === 'vault'
                    ? 'bg-white/[0.1] text-white'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                Active Vault
              </button>
              <button
                onClick={() => setViewMode('trash')}
                className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'trash'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-[#71717a] hover:text-red-400'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Trash (7d)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08]">
              <HardDrive className="w-3.5 h-3.5 text-[#71717a]" />
              <span className="font-bold text-white font-mono">{totalStorageLabel}</span>
            </div>

            <Link
              href="/assets/upload"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>Add Asset</span>
            </Link>
          </div>
        </div>

        {/* Trash Info Banner */}
        {viewMode === 'trash' && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                Deleted assets stay in <strong>Trash for 7 days</strong> before MongoDB automatically removes them permanently. You can restore them anytime before then.
              </span>
            </div>
          </div>
        )}

        {/* Search & Filter Strip */}
        <div className="p-3.5 rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#71717a] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets by file name, tag, or linked project..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {(['all', 'video', 'audio', 'image', 'document'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white/[0.1] text-white font-semibold border border-white/[0.12]'
                    : 'text-[#71717a] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" />
            <div className="text-xs text-[#71717a] font-mono">
              {viewMode === 'trash' ? 'Loading Trash from Atlas...' : 'Loading Vault from Atlas...'}
            </div>
          </div>
        ) : assets.length === 0 ? (
          /* Empty State */
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            {viewMode === 'trash' ? (
              <>
                <Trash2 className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
                <div className="text-sm font-semibold text-white">Trash is empty</div>
                <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                  Deleted assets appear here for 7 days so you can restore them if needed.
                </p>
              </>
            ) : (
              <>
                <Layers className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
                <div className="text-sm font-semibold text-white">No media assets in vault</div>
                <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
                  Stage raw footage metadata, audio stems, or external Drive links to attach them to your timeline projects.
                </p>
                <div className="pt-2">
                  <Link
                    href="/assets/upload"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Add First Media Asset</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Real Assets Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset._id}
                className="rounded-xl bg-[#121215] border border-white/[0.08] hover:border-white/[0.2] transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/assets/${asset._id}`}
                          className="text-xs font-bold text-white hover:text-[#818cf8] transition-colors truncate block"
                          title={asset.name}
                        >
                          {asset.name}
                        </Link>
                        <div className="text-[11px] text-[#71717a] font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="uppercase">{asset.category}</span>
                          <span>•</span>
                          <span>{asset.kind === 'link' ? 'External Link' : formatSize(asset.sizeBytes)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {viewMode === 'vault' ? (
                        <>
                          <button
                            onClick={() => openEditModal(asset)}
                            title="Edit asset"
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#6366f1]/20 text-[#a1a1aa] hover:text-[#818cf8] border border-white/[0.1] hover:border-[#6366f1]/40 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(asset)}
                            title="Move to Trash"
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500/20 text-[#a1a1aa] hover:text-red-400 border border-white/[0.1] hover:border-red-500/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(asset)}
                            disabled={restoringId === asset._id}
                            title="Restore to Vault"
                            className="px-2 py-1 rounded-lg bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/30 text-[11px] font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{restoringId === asset._id ? '...' : 'Restore'}</span>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(asset)}
                            title="Delete Forever"
                            className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Forever</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {viewMode === 'trash' && (
                    <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>Deletes permanently in {getDaysRemaining(asset.expireAt)}d</span>
                    </div>
                  )}

                  {asset.projectTitle && (
                    <div className="text-[11px] text-[#a1a1aa] bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1.5 truncate">
                      Project: <span className="text-white font-medium">{asset.projectTitle}</span>
                    </div>
                  )}

                  {asset.tags && asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/[0.03] text-[#71717a] font-mono border border-white/[0.05]"
                        >
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#71717a]">
                  <span className="font-mono">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                  {asset.externalUrl ? (
                    <a
                      href={asset.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#818cf8] hover:text-white flex items-center gap-1 font-medium"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#10b981] font-mono">
                      {viewMode === 'trash' ? 'In Trash' : 'Ready in Vault'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-headline">Edit Media Asset</h3>
              <button
                onClick={() => setEditingAsset(null)}
                className="text-[#71717a] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Asset Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                >
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="image">Image</option>
                  <option value="document">Document</option>
                </select>
              </div>

              {editingAsset.kind === 'link' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">External URL</label>
                  <input
                    type="url"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTagsInput}
                  onChange={(e) => setEditTagsInput(e.target.value)}
                  placeholder="B-Roll, 9:16, ProRes"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Permanent Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#121215] border border-white/[0.08] p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-headline">
                  {viewMode === 'trash' ? 'Delete forever?' : 'Move asset to Trash?'}
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  {viewMode === 'trash' ? (
                    <>
                      <span className="text-white font-semibold">{deleteTarget.name}</span> will be permanently erased and cannot be recovered.
                    </>
                  ) : (
                    <>
                      <span className="text-white font-semibold">{deleteTarget.name}</span> will stay in <strong>Trash for 7 days</strong> before automatic permanent deletion.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-[#a1a1aa] hover:text-white border border-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                {deleting
                  ? 'Deleting...'
                  : viewMode === 'trash'
                  ? 'Delete Forever'
                  : 'Move to Trash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
