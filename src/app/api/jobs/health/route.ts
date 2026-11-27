import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { WorkerStatus } from '@/models/WorkerStatus';
import { Job, HEAVY_MEDIA_JOB_TYPES } from '@/models/Job';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const staleThreshold = new Date(Date.now() - 30_000);
    const [workers, activeHeavyJobs, queuedCount] = await Promise.all([
      WorkerStatus.find({ lastSeenAt: { $gte: staleThreshold }, status: { $ne: 'stopped' } })
        .sort({ lastSeenAt: -1 })
        .limit(10),
      Job.countDocuments({
        status: { $in: ['PROCESSING', 'CANCELLING'] },
        type: { $in: HEAVY_MEDIA_JOB_TYPES },
      }),
      Job.countDocuments({
        userId: user.userId,
        status: { $in: ['QUEUED', 'RETRY_SCHEDULED', 'SCHEDULED'] },
      }),
    ]);

    return NextResponse.json({
      healthy: workers.length > 0,
      activeWorkers: workers,
      activeHeavyJobs,
      queuedJobsForUser: queuedCount,
    });
  } catch (err: any) {
    console.error('Worker health error:', err);
    return NextResponse.json({ error: 'Failed to load worker health' }, { status: 500 });
  }
}
