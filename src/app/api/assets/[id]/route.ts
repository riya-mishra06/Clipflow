import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Asset } from '@/models/Asset';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const UpdateAssetSchema = z.object({
  action: z.enum(['restore']).optional(),
  name: z.string().trim().min(2, { message: 'Asset name must be at least 2 characters' }).max(150).optional(),
  category: z.enum(['video', 'audio', 'image', 'document', 'transcript', 'other']).optional(),
  externalUrl: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
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
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const asset = await Asset.findOne({ _id: id, ownerId: user.userId });
    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json({ data: asset });
  } catch (err: any) {
    console.error('Fetch asset detail error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve asset details' },
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
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = UpdateAssetSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid update data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // Restore from Trash: clear deletedAt and expireAt so TTL index won't delete it
    if (validation.data.action === 'restore') {
      const restored = await Asset.findOneAndUpdate(
        { _id: id, ownerId: user.userId },
        { $set: { deletedAt: null, expireAt: null } },
        { new: true }
      );
      if (!restored) {
        return NextResponse.json({ error: 'Asset not found or unauthorized' }, { status: 404 });
      }
      return NextResponse.json({ data: restored });
    }

    const { action, ...fieldsToUpdate } = validation.data;
    const updated = await Asset.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Asset not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Update asset error:', err);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
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
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get('permanent') === 'true';

    if (permanent) {
      // Hard Delete: permanently remove from MongoDB
      const deleted = await Asset.findOneAndDelete({ _id: id, ownerId: user.userId });
      if (!deleted) {
        return NextResponse.json({ error: 'Asset not found or unauthorized' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Asset permanently deleted' });
    }

    // Soft Delete: move to Trash, auto-expires in 7 days via MongoDB TTL Index
    const now = new Date();
    const expireAt = new Date(now.getTime() + SEVEN_DAYS_MS);

    const softDeleted = await Asset.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: { deletedAt: now, expireAt } },
      { new: true }
    );

    if (!softDeleted) {
      return NextResponse.json({ error: 'Asset not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Asset moved to Trash (auto-deletes in 7 days)',
      data: softDeleted,
    });
  } catch (err: any) {
    console.error('Delete asset error:', err);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
