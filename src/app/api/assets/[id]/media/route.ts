import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Asset } from '@/models/Asset';
import { getCurrentUser } from '@/lib/auth';
import { mediaStorage } from '@/lib/storage';

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
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    await connectDB();
    const asset = await Asset.findOne({ _id: id, ownerId: user.userId });
    if (!asset || !asset.objectKey) {
      return NextResponse.json({ error: 'Stored media file not found' }, { status: 404 });
    }

    const stat = await mediaStorage.stat(asset.objectKey);
    if (!stat) {
      return NextResponse.json({ error: 'Media file missing on storage' }, { status: 404 });
    }

    const totalSize = stat.sizeBytes;
    const contentType = asset.mimeType || 'application/octet-stream';
    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get('download') === '1';
    const safeFilename = asset.name.replace(/["\r\n]/g, '_');

    const baseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `${isDownload ? 'attachment' : 'inline'}; filename="${safeFilename}"`,
    };

    const rangeHeader = req.headers.get('range');
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const [startStr, endStr] = rangeHeader.replace('bytes=', '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? Math.min(parseInt(endStr, 10), totalSize - 1) : totalSize - 1;

      if (Number.isNaN(start) || start < 0 || start >= totalSize || end < start) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${totalSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const stream = mediaStorage.readWebStream(asset.objectKey, start, end);
      return new NextResponse(stream, {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Content-Length': String(chunkSize),
        },
      });
    }

    const stream = mediaStorage.readWebStream(asset.objectKey);
    return new NextResponse(stream, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': String(totalSize),
      },
    });
  } catch (err: any) {
    console.error('Stream media error:', err);
    return NextResponse.json({ error: 'Failed to stream media file' }, { status: 500 });
  }
}
