import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { ClippingSession } from '@/models/ClippingSession';
import { Job } from '@/models/Job';
import { AIGeneration } from '@/models/AIGeneration';

export const dynamic = 'force-dynamic';

const ClipItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(100),
  startSec: z.number().min(0),
  endSec: z.number().min(0.5),
  durationSec: z.number().min(0.5),
  cropMode: z.enum(['center', 'manual']).default('center'),
  cropOffsetRatio: z.number().min(0).max(1).default(0.5),
  subtitleStyle: z.object({
    enabled: z.boolean().default(true),
    fontSize: z.number().min(10).max(42).default(18),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FFFFFF'),
    position: z.enum(['bottom', 'center', 'top']).default('bottom'),
  }),
  brandText: z.string().max(60).optional().default(''),
  logoAssetId: z.string().optional().default(''),
  status: z.enum(['draft', 'queued', 'processing', 'ready', 'failed']).optional().default('draft'),
  jobId: z.string().optional().default(''),
  outputAssetId: z.string().optional().default(''),
  thumbnailAssetId: z.string().optional().default(''),
  error: z.string().optional().default(''),
});

const PatchClippingSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  clips: z.array(ClipItemSchema).max(30).optional(),
});

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

    const jobs = await Job.find({
      userId: user.userId,
      'input.clippingSessionId': id,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const aiRecommendation = await AIGeneration.findOne({
      userId: user.userId,
      clippingSessionId: id,
      taskType: 'clip_moment_analysis',
    }).sort({ createdAt: -1 });

    return NextResponse.json({ data: session, jobs, aiRecommendation });
  } catch (err: any) {
    console.error('Get clipping session error:', err);
    return NextResponse.json({ error: 'Failed to load clipping session' }, { status: 500 });
  }
}

export async function PATCH(
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

    const body = await req.json();
    const validation = PatchClippingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid clip configuration' },
        { status: 400 }
      );
    }

    // Validate start < end on every clip
    if (validation.data.clips) {
      for (const clip of validation.data.clips) {
        if (clip.endSec <= clip.startSec) {
          return NextResponse.json(
            { error: `Clip "${clip.title}": end time must be greater than start time.` },
            { status: 400 }
          );
        }
      }
    }

    await connectDB();
    const updated = await ClippingSession.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: validation.data },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Clipping session not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Update clipping session error:', err);
    return NextResponse.json({ error: 'Failed to update clipping session' }, { status: 500 });
  }
}

export async function DELETE(
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

    const activeJobs = await Job.countDocuments({
      userId: user.userId,
      'input.clippingSessionId': id,
      status: { $in: ['QUEUED', 'PROCESSING', 'CANCELLING', 'RETRY_SCHEDULED'] },
    });
    if (activeJobs > 0) {
      return NextResponse.json(
        { error: 'Cancel active jobs before removing this clipping project.' },
        { status: 409 }
      );
    }

    await ClippingSession.deleteOne({ _id: id, ownerId: user.userId });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete clipping session error:', err);
    return NextResponse.json({ error: 'Failed to remove clipping project' }, { status: 500 });
  }
}
