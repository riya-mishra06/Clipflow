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
    const job = await Job.findOne({ _id: id, userId: user.userId });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(job.status)) {
      return NextResponse.json(
        { error: `Cannot cancel a job in ${job.status} state` },
        { status: 409 }
      );
    }

    const nextStatus = job.status === 'PROCESSING' ? 'CANCELLING' : 'CANCELLED';
    const updated = await Job.findOneAndUpdate(
      { _id: id, userId: user.userId, status: job.status },
      {
        $set: {
          status: nextStatus,
          currentStage: nextStatus === 'CANCELLED' ? 'Cancelled by user' : 'Cancellation requested',
          leaseExpiresAt: nextStatus === 'CANCELLED' ? null : job.leaseExpiresAt,
        },
      },
      { new: true }
    );

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Cancel job error:', err);
    return NextResponse.json({ error: 'Failed to cancel job' }, { status: 500 });
  }
}
