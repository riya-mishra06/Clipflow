import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';
import { enqueueJob, IdempotencyConflictError } from '@/lib/jobQueue';

export const dynamic = 'force-dynamic';

const CreateJobSchema = z.object({
  type: z.enum([
    'NOOP_TEST',
    'TEMP_FILE_CLEANUP',
    'MEDIA_ANALYSIS',
    'AUDIO_EXTRACTION',
    'VIDEO_TRIM',
    'VIDEO_SPLIT',
    'VIDEO_CONCAT',
    'SMART_CROP',
    'THUMBNAIL_GENERATION',
    'FRAME_EXTRACTION',
    'TRANSCRIPTION',
    'SUBTITLE_RENDER',
    'CLIP_PIPELINE',
  ]),
  projectId: z.string().optional(),
  dependencies: z.array(z.string()).optional().default([]),
  priority: z.number().int().min(1).max(5).optional().default(3),
  maxAttempts: z.number().int().min(1).max(10).optional().default(3),
  input: z.record(z.string(), z.unknown()).optional().default({}),
  idempotencyKey: z.string().trim().max(120).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const filter: Record<string, unknown> = { userId: user.userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ data: jobs });
  } catch (err: any) {
    console.error('Fetch jobs error:', err);
    return NextResponse.json({ error: 'Failed to retrieve jobs', data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateJobSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid job request';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    await connectDB();
    const { scheduledAt, ...rest } = validation.data;
    const { job, deduplicated } = await enqueueJob({
      ...rest,
      userId: user.userId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    });

    return NextResponse.json(
      { data: job, deduplicated },
      { status: deduplicated ? 200 : 201 }
    );
  } catch (err: any) {
    if (err instanceof IdempotencyConflictError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error('Create job error:', err);
    return NextResponse.json({ error: 'Failed to create background job' }, { status: 500 });
  }
}
