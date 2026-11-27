import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

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
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await connectDB();
    const updated = await Job.findOneAndUpdate(
      { _id: id, userId: user.userId, status: { $in: ['FAILED', 'CANCELLED'] } },
      {
        $set: {
          status: 'QUEUED',
          progress: 0,
          currentStage: 'Re-queued manually',
          attempts: 0,
          nextRunAt: new Date(),
          leaseExpiresAt: null,
          workerId: null,
          error: null,
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: 'Job not found or not eligible for manual retry' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Retry job error:', err);
    return NextResponse.json({ error: 'Failed to retry job' }, { status: 500 });
  }
}
