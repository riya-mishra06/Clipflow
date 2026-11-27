import fsp from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ClippingSession } from '@/models/ClippingSession';
import { Asset } from '@/models/Asset';
import { buildZipBuffer, ZipEntryInput } from '@/lib/zipBuilder';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Clipping session not found' }, { status: 404 });
    }

    await connectDB();
    const session = await ClippingSession.findOne({ _id: id, ownerId: user.userId });
    if (!session) {
      return NextResponse.json({ error: 'Clipping session not found' }, { status: 404 });
    }

    const readyClips = session.clips.filter((c) => c.status === 'ready' && c.outputAssetId);
    if (readyClips.length === 0) {
      return NextResponse.json({ error: 'No ready clips available to download' }, { status: 400 });
    }

    const root = path.resolve(
      /*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_ROOT || path.join(process.cwd(), 'storage', 'media')
    );

    const entries: ZipEntryInput[] = [];
    for (const clip of readyClips) {
      const asset = await Asset.findOne({ _id: clip.outputAssetId, ownerId: user.userId });
      if (!asset?.objectKey) continue;
      const fullPath = path.resolve(/*turbopackIgnore: true*/ root, asset.objectKey.replace(/\\/g, '/'));
      if (!fullPath.startsWith(root + path.sep)) continue;
      try {
        const data = await fsp.readFile(/*turbopackIgnore: true*/ fullPath);
        entries.push({ filename: `${clip.title}.mp4`, data });
      } catch {}
    }

    if (entries.length === 0) {
      return NextResponse.json({ error: 'Clip files not found on disk' }, { status: 404 });
    }

    const zipBuf = buildZipBuffer(entries);
    const safeName = session.title.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40) || 'clips';

    return new NextResponse(new Uint8Array(zipBuf), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeName}_clips.zip"`,
        'Content-Length': String(zipBuf.length),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err: any) {
    console.error('Download ZIP error:', err);
    return NextResponse.json({ error: 'Failed to package clips ZIP' }, { status: 500 });
  }
}
