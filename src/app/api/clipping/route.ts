import path from 'path';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { Project } from '@/models/Project';
import { Asset } from '@/models/Asset';
import { ClippingSession } from '@/models/ClippingSession';
import { probeMedia } from '@/lib/mediaProcessor';

export const dynamic = 'force-dynamic';

const CreateClippingSchema = z.object({
  title: z.string().trim().min(2).max(120),
  sourceAssetId: z.string().min(1),
  campaignId: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    await connectDB();
    const sessions = await ClippingSession.find({ ownerId: user.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ data: sessions });
  } catch (err: any) {
    console.error('Fetch clipping sessions error:', err);
    return NextResponse.json({ error: 'Failed to load clipping sessions', data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateClippingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid clipping project data' },
        { status: 400 }
      );
    }

    const { title, sourceAssetId, campaignId } = validation.data;
    if (!mongoose.Types.ObjectId.isValid(sourceAssetId)) {
      return NextResponse.json({ error: 'Invalid source video asset ID' }, { status: 400 });
    }

    await connectDB();
    const sourceAsset = await Asset.findOne({
      _id: sourceAssetId,
      ownerId: user.userId,
      deletedAt: null,
    });
    if (!sourceAsset || !sourceAsset.objectKey) {
      return NextResponse.json(
        { error: 'Source video asset not found in local media vault' },
        { status: 404 }
      );
    }

    // Extract real FFprobe metadata synchronously (fast ~50ms) so studio opens with duration/fps/resolution
    let sourceMetadata: Record<string, unknown> | null = null;
    try {
      const root = path.resolve(
        /*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_ROOT || path.join(process.cwd(), 'storage', 'media')
      );
      const fullPath = path.resolve(/*turbopackIgnore: true*/ root, sourceAsset.objectKey.replace(/\\/g, '/'));
      sourceMetadata = (await probeMedia(fullPath)) as unknown as Record<string, unknown>;
    } catch {
      sourceMetadata = null;
    }

    const project = await Project.create({
      title,
      kind: 'campaign',
      status: 'active',
      campaignId: campaignId && mongoose.Types.ObjectId.isValid(campaignId) ? campaignId : undefined,
      ownerId: user.userId,
      targetPlatform: 'Instagram Reels & YouTube Shorts',
      aspectRatio: '9:16 Vertical',
      resolution: '1080x1920',
    });

    const session = await ClippingSession.create({
      ownerId: user.userId,
      projectId: project._id,
      title,
      sourceAssetId: sourceAsset._id,
      sourceMetadata,
      clips: [],
    });

    return NextResponse.json({ data: session }, { status: 201 });
  } catch (err: any) {
    console.error('Create clipping session error:', err);
    return NextResponse.json({ error: 'Failed to create clipping project' }, { status: 500 });
  }
}
