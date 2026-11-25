import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Submission } from '@/models/Submission';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const UpdateSubmissionSchema = z.object({
  status: z.enum(['pending_review', 'approved', 'changes_requested']).optional(),
  videoUrl: z.string().trim().url().optional(),
  cutVersion: z.string().trim().min(1).max(20).optional(),
  notes: z.string().max(1000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = UpdateSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid update data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await Submission.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: validation.data },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Submission not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Update submission error:', err);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const deleted = await Submission.findOneAndDelete({ _id: id, ownerId: user.userId });
    if (!deleted) {
      return NextResponse.json({ error: 'Submission not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Submission withdrawn' });
  } catch (err: any) {
    console.error('Delete submission error:', err);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
