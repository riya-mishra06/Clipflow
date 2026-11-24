import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { getCurrentUser } from '@/lib/auth';

const CreateProjectSchema = z.object({
  title: z.string().trim().min(3, { message: 'Project title must be at least 3 characters' }).max(120),
  campaignId: z.string().optional(),
  campaignTitle: z.string().optional().default('Custom Direct Cut'),
  kind: z.enum(['campaign', 'original', 'practice']).default('campaign'),
  status: z.enum(['planned', 'active', 'in_review', 'completed']).default('active'),
  targetPlatform: z.string().default('Instagram Reels & TikTok'),
  aspectRatio: z.string().default('9:16 Vertical'),
  targetDuration: z.string().default('45 seconds'),
  resolution: z.string().default('1080x1920 (60fps)'),
  conceptHook: z.string().default(''),
  estPayout: z.string().default('$140.00'),
  deadlineDays: z.number().default(7),
  deadlineDate: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const filter: Record<string, any> = {};
    if (user) {
      filter.ownerId = user.userId;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { campaignTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ data: projects });
  } catch (err: any) {
    console.error('Fetch projects error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve projects from database', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to create a project' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateProjectSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid project data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const projectData = {
      ...validation.data,
      ownerId: user.userId,
    };

    const project = await Project.create(projectData);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err: any) {
    console.error('Create project error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while creating project' },
      { status: 500 }
    );
  }
}
