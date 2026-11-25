import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialAccount } from '@/models/SocialAccount';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const SyncChannelSchema = z.object({
  channelId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = SyncChannelSchema.safeParse(body);
    if (!validation.success || !mongoose.Types.ObjectId.isValid(validation.data.channelId)) {
      return NextResponse.json({ error: 'Valid channelId is required' }, { status: 400 });
    }

    const account = await SocialAccount.findOne({
      _id: validation.data.channelId,
      ownerId: user.userId,
    });

    if (!account) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    if (account.platform !== 'youtube') {
      return NextResponse.json(
        { error: `Live stats sync currently supports YouTube channels. (${account.platform} OAuth coming soon.)` },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'YOUTUBE_API_KEY is not configured in .env.local yet. Add it from Google Cloud Console to fetch live YouTube stats.',
        },
        { status: 400 }
      );
    }

    // Determine whether user provided a YouTube Channel ID (UC...) or @handle
    const identifier = (account.channelOrPageId || account.accountName).trim();
    const queryParam = identifier.startsWith('UC')
      ? `id=${encodeURIComponent(identifier)}`
      : `forHandle=${encodeURIComponent(identifier.startsWith('@') ? identifier : `@${identifier}`)}`;

    const ytUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${queryParam}&key=${apiKey}`;
    const ytRes = await fetch(ytUrl, { cache: 'no-store' });

    if (!ytRes.ok) {
      return NextResponse.json(
        { error: `YouTube API returned HTTP ${ytRes.status}. Verify your YOUTUBE_API_KEY.` },
        { status: 502 }
      );
    }

    const ytJson = await ytRes.json();
    const item = ytJson?.items?.[0];
    if (!item) {
      return NextResponse.json(
        { error: `No YouTube channel found matching "${identifier}". Check the @handle or UC... Channel ID.` },
        { status: 404 }
      );
    }

    account.stats = {
      subscribers: Number(item.statistics?.subscriberCount || 0).toLocaleString(),
      totalViews: Number(item.statistics?.viewCount || 0).toLocaleString(),
      videoCount: Number(item.statistics?.videoCount || 0).toLocaleString(),
      lastSyncedAt: new Date(),
    };
    if (item.id && !account.channelOrPageId) {
      account.channelOrPageId = item.id;
    }
    await account.save();

    const safeAccount = await SocialAccount.findById(account._id).select('-accessToken -refreshToken');
    return NextResponse.json({ success: true, data: safeAccount });
  } catch (err: any) {
    console.error('YouTube sync error:', err);
    return NextResponse.json({ error: 'Failed to sync YouTube channel stats' }, { status: 500 });
  }
}
