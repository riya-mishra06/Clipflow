import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { SocialAccount } from '@/models/SocialAccount';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const CreateChannelSchema = z.object({
  platform: z.enum(['instagram', 'youtube', 'tiktok']),
  category: z.enum(['clipping', 'ugc', 'brand', 'personal']).default('clipping'),
  accountName: z.string().trim().min(2, { message: 'Account name / handle is required' }).max(80),
  channelOrPageId: z.string().trim().max(120).optional().default(''),
  autoPublishEnabled: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    // Never leak OAuth access/refresh tokens to the client
    const channels = await SocialAccount.find({ ownerId: user.userId })
      .select('-accessToken -refreshToken')
      .sort({ createdAt: -1 });

    return NextResponse.json({ data: channels });
  } catch (err: any) {
    console.error('Fetch channels error:', err);
    return NextResponse.json(
      { error: 'Failed to load connected channels', data: [] },
      { status: 500 }
    );
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
    const validation = CreateChannelSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid channel data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { platform, category, accountName, channelOrPageId, autoPublishEnabled } = validation.data;

    const created = await SocialAccount.create({
      ownerId: user.userId,
      platform,
      category,
      accountName,
      channelOrPageId,
      accessToken: 'manual_channel_link',
      status: 'connected',
      settings: {
        autoPublishEnabled,
      },
    });

    const safeChannel = await SocialAccount.findById(created._id).select('-accessToken -refreshToken');
    return NextResponse.json({ data: safeChannel }, { status: 201 });
  } catch (err: any) {
    console.error('Connect channel error:', err);
    return NextResponse.json({ error: 'Failed to connect channel' }, { status: 500 });
  }
}
