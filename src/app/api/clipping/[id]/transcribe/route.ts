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
    const force = Boolean(body?.force);
    const model = body?.model === 'tiny' ? 'tiny' : 'base';

    await connectDB();
    const session = await ClippingSession.findOne({ _id: id, ownerId: user.userId });
    if (!session) {
      return NextResponse.json({ error: 'Clipping session not found' }, { status: 404 });
    }

    // Reuse existing transcript unless force=true
    if (session.transcript?.srtAssetId && !force) {
      return NextResponse.json({
        reused: true,
        transcript: session.transcript,
      });
    }

    const { job } = await enqueueJob({
      userId: user.userId,
      type: 'TRANSCRIPTION',
      projectId: session.projectId.toString(),
      priority: 4,
      input: {
        sourceVideoAssetId: session.sourceAssetId.toString(),
        clippingSessionId: session._id.toString(),
        model,
        cpuThreads: 4,
      },
    });

    return NextResponse.json({ reused: false, job }, { status: 201 });
  } catch (err: any) {
    console.error('Start clipping transcription error:', err);
    return NextResponse.json({ error: 'Failed to queue transcription' }, { status: 500 });
  }
}
