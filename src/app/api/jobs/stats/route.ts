import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();
    const counts = await Job.aggregate([
      { $match: { userId: user.userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const summary: Record<string, number> = {};
    for (const row of counts) {
      summary[row._id] = row.count;
    }

    return NextResponse.json({ data: summary });
  } catch (err: any) {
    console.error('Job stats error:', err);
    return NextResponse.json({ error: 'Failed to load job statistics' }, { status: 500 });
  }
}
