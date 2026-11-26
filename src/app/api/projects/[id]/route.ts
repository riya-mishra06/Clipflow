import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const UpdateProjectSchema = z.object({
  status: z.enum(['planned', 'active', 'in_review', 'completed', 'archived']).optional(),
  conceptHook: z.string().max(1000).optional(),
  scriptNotes: z.string().max(5000).optional(),
  tasks: z
    .array(
      z.object({
        id: z.string(),
        label: z.string().min(1).max(200),
        category: z.string().default('Custom'),
        completed: z.boolean(),
      })
    )
    .optional(),
  drafts: z
    .array(
      z.object({
        id: z.string(),
        version: z.string().min(1).max(40),
        filename: z.string().min(1).max(160),
        videoUrl: z.string().max(500).optional().default(''),
        notes: z.string().max(500).optional().default(''),
        status: z.enum(['Ready', 'In Review', 'Approved']).default('Ready'),
        createdAt: z.string(),
      })
    )
    .optional(),
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

    await connectDB();

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = await Project.findOne({ _id: id, ownerId: user.userId });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (err: any) {
    console.error('Fetch project detail error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve project details' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = UpdateProjectSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid project update';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const updated = await Project.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: validation.data },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Update project error:', err);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}
