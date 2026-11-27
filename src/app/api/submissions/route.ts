import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Submission } from '@/models/Submission';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CreateSubmissionSchema = z.object({
  projectId: z.string().optional(),
  projectTitle: z.string().trim().min(2, { message: 'Project title is required' }).max(150),
  campaignId: z.string().optional(),
  campaignTitle: z.string().trim().optional().default('Direct Brand Submission'),
  videoUrl: z.string().trim().url({ message: 'Please enter a valid video URL (https://...)' }),
  cutVersion: z.string().trim().min(1).max(20).default('v1.0'),
  notes: z.string().max(1000).optional().default(''),
  payoutAmount: z.string().optional().default('$140.00'),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter: Record<string, any> = { ownerId: user.userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const submissions = await Submission.find(filter).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ data: submissions });
  } catch (err: any) {
    console.error('Fetch submissions error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve submissions', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to submit' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid submission data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { projectId, campaignId, ...rest } = validation.data;
    const validProjectId =
      projectId && mongoose.Types.ObjectId.isValid(projectId) ? projectId : undefined;

    // Prevent duplicate submissions for the same project/title and cut version
    const duplicateFilter = validProjectId
      ? { ownerId: user.userId, projectId: validProjectId, cutVersion: rest.cutVersion }
      : { ownerId: user.userId, projectTitle: rest.projectTitle, cutVersion: rest.cutVersion };
    const existingSubmission = await Submission.findOne(duplicateFilter).select('_id');
    if (existingSubmission) {
      return NextResponse.json(
        { error: `A submission for "${rest.projectTitle}" (${rest.cutVersion}) already exists.` },
        { status: 409 }
      );
    }

    const submission = await Submission.create({
      ...rest,
      ownerId: user.userId,
      projectId: validProjectId,
      campaignId: campaignId && mongoose.Types.ObjectId.isValid(campaignId) ? campaignId : undefined,
      status: 'pending_review',
    });

    return NextResponse.json({ data: submission }, { status: 201 });
  } catch (err: any) {
    console.error('Create submission error:', err);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
