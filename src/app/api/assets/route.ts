import { NextResponse } from 'next/server';
import { z } from 'zod';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Asset } from '@/models/Asset';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CreateAssetSchema = z.object({
  name: z.string().trim().min(2, { message: 'Asset name must be at least 2 characters' }).max(150),
  kind: z.enum(['upload', 'link']).default('upload'),
  category: z.enum(['video', 'audio', 'image', 'document', 'transcript', 'other']).default('video'),
  mimeType: z.string().optional(),
  sizeBytes: z.number().min(0).optional().default(0),
  externalUrl: z.string().trim().optional(),
  tags: z.array(z.string()).default([]),
  projectId: z.string().optional(),
  projectTitle: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isTrash = searchParams.get('trash') === 'true';

    const filter: Record<string, any> = {
      ownerId: user.userId,
      deletedAt: isTrash ? { $ne: null } : null,
    };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { projectTitle: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    const assets = await Asset.find(filter).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ data: assets });
  } catch (err: any) {
    console.error('Fetch assets error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve assets from database', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required to upload assets' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateAssetSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid asset data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { projectId, ...rest } = validation.data;
    const attachedProjectIds =
      projectId && mongoose.Types.ObjectId.isValid(projectId)
        ? [new mongoose.Types.ObjectId(projectId)]
        : [];

    const asset = await Asset.create({
      ...rest,
      ownerId: user.userId,
      attachedProjectIds,
      status: 'ready',
      deletedAt: null,
      expireAt: null,
    });

    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (err: any) {
    console.error('Create asset error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving the asset' },
      { status: 500 }
    );
  }
}
