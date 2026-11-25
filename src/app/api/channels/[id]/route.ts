import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialAccount } from '@/models/SocialAccount';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const UpdateChannelSchema = z.object({
  autoPublishEnabled: z.boolean().optional(),
  status: z.enum(['connected', 'expired', 'revoked']).optional(),
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
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = UpdateChannelSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid channel update' }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (typeof validation.data.autoPublishEnabled === 'boolean') {
      updateFields['settings.autoPublishEnabled'] = validation.data.autoPublishEnabled;
    }
    if (validation.data.status) {
      updateFields.status = validation.data.status;
    }

    const updated = await SocialAccount.findOneAndUpdate(
      { _id: id, ownerId: user.userId },
      { $set: updateFields },
      { new: true }
    ).select('-accessToken -refreshToken');

    if (!updated) {
      return NextResponse.json({ error: 'Channel not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (err: any) {
    console.error('Update channel error:', err);
    return NextResponse.json({ error: 'Failed to update channel' }, { status: 500 });
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
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const deleted = await SocialAccount.findOneAndDelete({ _id: id, ownerId: user.userId });
    if (!deleted) {
      return NextResponse.json({ error: 'Channel not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Channel disconnected' });
  } catch (err: any) {
    console.error('Delete channel error:', err);
    return NextResponse.json({ error: 'Failed to disconnect channel' }, { status: 500 });
  }
}
