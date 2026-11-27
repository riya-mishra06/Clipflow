import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { getCurrentUser } from '@/lib/auth';

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
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    await connectDB();
    const job = await Job.findOne({ _id: id, userId: user.userId });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ data: job });
  } catch (err: any) {
    console.error('Fetch job detail error:', err);
    return NextResponse.json({ error: 'Failed to retrieve job' }, { status: 500 });
  }
}
