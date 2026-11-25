import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Campaign } from '@/models/Campaign';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ToggleBookmarkSchema = z.object({
  campaignId: z.string().trim().min(1, { message: 'Campaign ID is required' }),
});

export async function GET() {
  try {
    await connectDB();
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ savedIds: [], data: [] });
    }

    const user = await User.findById(session.userId).select('savedCampaignIds');
    const savedIds = (user?.savedCampaignIds || []).map((id) => id.toString());

    if (savedIds.length === 0) {
      return NextResponse.json({ savedIds: [], data: [] });
    }

    const campaigns = await Campaign.find({ _id: { $in: savedIds } }).sort({ createdAt: -1 });
    return NextResponse.json({ savedIds, data: campaigns });
  } catch (err: any) {
    console.error('Fetch saved campaigns error:', err);
    return NextResponse.json(
      { error: 'Failed to load saved campaigns', savedIds: [], data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required to bookmark' }, { status: 401 });
    }

    const body = await req.json();
    const validation = ToggleBookmarkSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 });
    }

    const { campaignId } = validation.data;
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID format' }, { status: 400 });
    }

    const user = await User.findById(session.userId).select('savedCampaignIds');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const existing = (user.savedCampaignIds || []).map((id) => id.toString());
    const alreadySaved = existing.includes(campaignId);

    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      alreadySaved
        ? { $pull: { savedCampaignIds: new mongoose.Types.ObjectId(campaignId) } }
        : { $addToSet: { savedCampaignIds: new mongoose.Types.ObjectId(campaignId) } },
      { new: true }
    ).select('savedCampaignIds');

    const savedIds = (updatedUser?.savedCampaignIds || []).map((id) => id.toString());

    return NextResponse.json({
      saved: !alreadySaved,
      savedIds,
    });
  } catch (err: any) {
    console.error('Toggle bookmark error:', err);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}
