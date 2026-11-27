import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { ingestExternalUrl } from '@/lib/urlIngestor';

export const dynamic = 'force-dynamic';

const IngestUrlSchema = z.object({
  url: z.string().trim().min(8).max(2048),
  overrideKind: z
    .enum([
      'video',
      'image',
      'audio',
      'document',
      'subtitle',
      'url_video',
      'url_social',
      'url_product',
      'url_website',
      'text_prompt',
      'existing_asset',
    ])
    .optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const ip = getClientIp(req);
    const rate = checkRateLimit(`ingest-url:${user.userId}:${ip}`, 25, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many URL import requests. Retry in ${rate.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validation = IngestUrlSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid URL request' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await ingestExternalUrl({
      url: validation.data.url,
      userId: user.userId,
      overrideKind: validation.data.overrideKind,
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to ingest URL' },
      { status: 400 }
    );
  }
}
