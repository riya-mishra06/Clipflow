import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { IngestSource } from '@/models/IngestSource';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CreateSourceSchema = z.object({
  name: z.string().trim().min(2, { message: 'Source name must be at least 2 characters' }).max(80),
  provider: z.enum(['whop', 'content_rewards', 'cuelinks', 'youtube', 'custom_json']).default('custom_json'),
  feedUrl: z.string().trim().max(500).optional().default(''),
});

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    const sources = await IngestSource.find({ ownerId: user.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: sources });
  } catch (err: any) {
    console.error('Fetch sources error:', err);
    return NextResponse.json({ error: 'Failed to load ingest sources', data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = CreateSourceSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid source data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const source = await IngestSource.create({
      ...validation.data,
      ownerId: user.userId,
      status: validation.data.feedUrl ? 'operational' : 'idle',
      syncedCount: 0,
    });

    return NextResponse.json({ data: source }, { status: 201 });
  } catch (err: any) {
    console.error('Create source error:', err);
    return NextResponse.json({ error: 'Failed to create ingest source' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Source ID required' }, { status: 400 });
    }

    const deleted = await IngestSource.findOneAndDelete({ _id: id, ownerId: user.userId });
    if (!deleted) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete source error:', err);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
  }
}
