import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Asset, AssetCategory } from '@/models/Asset';
import { getCurrentUser } from '@/lib/auth';
import {
  InsufficientStorageError,
  mediaStorage,
  validateUploadMetadata,
} from '@/lib/storage';

export const dynamic = 'force-dynamic';

function inferCategory(mimeType: string, fallback?: string): AssetCategory {
  const valid: AssetCategory[] = ['video', 'audio', 'image', 'document', 'transcript', 'other'];
  if (fallback && valid.includes(fallback as AssetCategory)) {
    return fallback as AssetCategory;
  }
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  return 'document';
}

function inferMimeFromExtension(filename: string, rawMime: string): string {
  const clean = (rawMime || '').toLowerCase().split(';')[0].trim();
  if (clean && clean !== 'application/octet-stream') return clean;
  const ext = filename.toLowerCase().split('.').pop() || '';
  const map: Record<string, string> = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    m4a: 'audio/mp4',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
    srt: 'application/x-subrip',
    vtt: 'text/vtt',
  };
  return map[ext] || clean || 'application/octet-stream';
}

export async function POST(req: Request) {
  let savedObjectKey: string | null = null;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to upload files' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please select a file to upload' }, { status: 400 });
    }

    const mimeType = inferMimeFromExtension(file.name || '', file.type || '');
    try {
      validateUploadMetadata(mimeType, file.size);
    } catch (valErr: any) {
      return NextResponse.json({ error: valErr.message || 'Invalid file' }, { status: 400 });
    }

    const rawName = String(formData.get('name') || file.name || '').trim();
    const name = rawName.slice(0, 150);
    if (name.length < 2) {
      return NextResponse.json({ error: 'Asset name must be at least 2 characters' }, { status: 400 });
    }

    const category = inferCategory(mimeType, String(formData.get('category') || ''));
    const projectId = String(formData.get('projectId') || '').trim();
    const projectTitle = String(formData.get('projectTitle') || '').trim();
    let tags: string[] = [];
    const rawTags = formData.get('tags');
    if (typeof rawTags === 'string' && rawTags.trim()) {
      try {
        const parsed = JSON.parse(rawTags);
        if (Array.isArray(parsed)) tags = parsed.map(String).slice(0, 12);
      } catch {
        tags = rawTags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 12);
      }
    }

    let saved: { objectKey: string; sizeBytes: number };
    try {
      saved = await mediaStorage.saveFromStream(
        user.userId,
        file.name,
        mimeType,
        file.stream(),
        file.size
      );
      savedObjectKey = saved.objectKey;
    } catch (storageErr: any) {
      if (storageErr instanceof InsufficientStorageError) {
        return NextResponse.json({ error: storageErr.message }, { status: 507 });
      }
      return NextResponse.json(
        { error: storageErr.message || 'Invalid uploaded media file' },
        { status: 400 }
      );
    }

    await connectDB();
    const attachedProjectIds =
      projectId && mongoose.Types.ObjectId.isValid(projectId)
        ? [new mongoose.Types.ObjectId(projectId)]
        : [];

    const asset = await Asset.create({
      ownerId: user.userId,
      name,
      kind: 'upload',
      category,
      mimeType,
      sizeBytes: saved.sizeBytes,
      objectKey: saved.objectKey,
      tags,
      projectTitle: projectTitle || undefined,
      attachedProjectIds,
      status: 'ready',
      deletedAt: null,
      expireAt: null,
    });

    savedObjectKey = null; // Persisted successfully; no orphan cleanup needed
    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (err: any) {
    if (savedObjectKey) {
      await mediaStorage.delete(savedObjectKey).catch(() => {});
    }
    console.error('Upload asset error:', err);
    return NextResponse.json(
      { error: 'Failed to store uploaded media file' },
      { status: 500 }
    );
  }
}
