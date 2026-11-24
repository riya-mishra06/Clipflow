'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Film,
  Music,
  Image as ImageIcon,
  FileText,
  Search,
  Filter,
  Plus,
  CloudUpload,
  FolderOpen,
  Layers,
  ChevronRight,
  HardDrive
} from 'lucide-react';

interface AssetRecord {
  id: string;
  name: string;
  category: 'video' | 'audio' | 'image' | 'document';
  format: string;
  size: string;
  duration?: string;
  folder: string;
  linkedProject: string;
  tags: string[];
  thumbnailUrl?: string;
  dateAdded: string;
}

export default function AssetLibraryPage() {
  // Real empty state: starts with 0 assets until user uploads
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'video' | 'audio' | 'image' | 'document'>('all');
  const [search, setSearch] = useState('');

  return (
    <div className="flex-1 flex flex-col min-w-0">

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-headline">
              Asset Library
            </h1>
            <p className="text-xs text-[#a1a1aa] mt-1">
              Centralized repository for raw 4K B-Roll, uncompressed audio stems (.wav), sound effects, and brand packs.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <HardDrive className="w-4 h-4 text-[#71717a]" />
            <span className="text-[#a1a1aa]">Vault Storage:</span>
            <span className="font-bold text-white font-mono">0 GB / 100 GB</span>
          </div>
        </div>

        {/* Empty State */}
        {assets.length === 0 ? (
          <div className="py-24 text-center rounded-xl bg-[#121215] border border-white/[0.08] space-y-3 px-4">
            <Layers className="w-10 h-10 text-[#71717a] mx-auto opacity-30 stroke-[1.5]" />
            <div className="text-sm font-semibold text-white">No media assets in vault</div>
            <p className="text-xs text-[#71717a] max-w-sm mx-auto leading-relaxed">
              Upload raw footage, ProRes clips, or audio stems to link them to your timeline projects.
            </p>
            <div className="pt-2">
              <Link
                href="/assets/upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#6366f1] hover:bg-[#4f46e5] text-white text-xs font-semibold transition-colors"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Upload First Media File</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rendered cards if assets exist */}
          </div>
        )}
      </main>
    </div>
  );
}
