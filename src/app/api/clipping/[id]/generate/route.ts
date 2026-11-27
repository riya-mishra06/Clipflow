import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ClippingSession } from '@/models/ClippingSession';
import { enqueueJob } from '@/lib/jobQueue';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const body = await req.json().catch(() => ({}));
    const targetClipId = body?.clipId ? String(body.clipId) : null;

    await connectDB();
    const session = await ClippingSession.findOne({ _id: id, ownerId: user.userId });
    if (!session) {
      return NextResponse.json({ error: 'Clipping session not found' }, { status: 404 });
    }

    const targetClips = targetClipId
      ? session.clips.filter((c) => c.id === targetClipId)
      : session.clips;

    if (targetClips.length === 0) {
      return NextResponse.json({ error: 'No clips selected to generate' }, { status: 400 });
    }

    const queuedJobs = [];
    let previousJobId: string | null = null;

    for (const clip of targetClips) {
      const { job } = await enqueueJob({
        userId: user.userId,
        type: 'CLIP_PIPELINE',
        projectId: session.projectId.toString(),
        dependencies: previousJobId ? [previousJobId] : [],
        priority: 4,
        input: {
          clippingSessionId: session._id.toString(),
          clipId: clip.id,
          clipTitle: clip.title,
          sourceAssetId: session.sourceAssetId.toString(),
          startSec: clip.startSec,
          endSec: clip.endSec,
          cropOffsetRatio: clip.cropMode === 'center' ? 0.5 : clip.cropOffsetRatio,
          srtAssetId: session.transcript?.srtAssetId || null,
          subtitleStyle: clip.subtitleStyle,
          brandText: clip.brandText || '',
          logoAssetId: clip.logoAssetId || '',
        },
      });

      clip.status = 'queued';
      clip.jobId = job._id.toString();
      clip.error = '';
      queuedJobs.push(job);
      // Bulk clips execute sequentially via dependency chain + heavy-job lock
      previousJobId = job._id.toString();
    }

    await session.save();
    return NextResponse.json({ jobs: queuedJobs, data: session }, { status: 201 });
  } catch (err: any) {
    console.error('Generate clips error:', err);
    return NextResponse.json({ error: 'Failed to queue clip generation' }, { status: 500 });
  }
}
