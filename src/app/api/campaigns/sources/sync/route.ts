import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { IngestSource } from '@/models/IngestSource';
import { getCurrentUser } from '@/lib/auth';
import { upsertExternalCampaigns, RawExternalCampaign } from '@/lib/campaignAdapter';
import { validateExternalFeedUrl } from '@/lib/security';

export const dynamic = 'force-dynamic';

const SyncSchema = z.object({
  sourceId: z.string().min(1),
  rawItems: z.array(z.any()).optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = SyncSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Valid sourceId is required' }, { status: 400 });
    }

    const { sourceId, rawItems } = validation.data;
    if (!mongoose.Types.ObjectId.isValid(sourceId)) {
      return NextResponse.json({ error: 'Invalid source ID' }, { status: 400 });
    }

    const source = await IngestSource.findOne({ _id: sourceId, ownerId: user.userId });
    if (!source) {
      return NextResponse.json({ error: 'Ingest source not found' }, { status: 404 });
    }

    let itemsToImport: RawExternalCampaign[] = [];

    if (Array.isArray(rawItems) && rawItems.length > 0) {
      itemsToImport = rawItems as RawExternalCampaign[];
    } else if (source.feedUrl) {
      let safeFeedUrl: URL;
      try {
        safeFeedUrl = validateExternalFeedUrl(source.feedUrl);
      } catch (urlErr: any) {
        return NextResponse.json(
          { error: urlErr.message || 'Invalid external feed URL' },
          { status: 400 }
        );
      }

      const feedRes = await fetch(safeFeedUrl.toString(), { cache: 'no-store', redirect: 'error' });
      if (!feedRes.ok) {
        source.status = 'error';
        source.lastError = `Feed returned HTTP ${feedRes.status}`;
        await source.save();
        return NextResponse.json(
          { error: `External feed returned HTTP ${feedRes.status}` },
          { status: 502 }
        );
      }

      const feedJson = await feedRes.json();
      itemsToImport = Array.isArray(feedJson)
        ? feedJson
        : Array.isArray(feedJson?.data)
        ? feedJson.data
        : Array.isArray(feedJson?.campaigns)
        ? feedJson.campaigns
        : [];
    } else {
      return NextResponse.json(
        { error: 'Provide a Feed URL on this source or paste JSON items to sync.' },
        { status: 400 }
      );
    }

    const result = await upsertExternalCampaigns(itemsToImport, source.provider, user.userId);

    source.status = 'operational';
    source.lastSyncedAt = new Date();
    source.syncedCount = (source.syncedCount || 0) + result.inserted;
    source.lastError = '';
    await source.save();

    return NextResponse.json({
      success: true,
      result,
      source,
    });
  } catch (err: any) {
    console.error('Sync source error:', err);
    return NextResponse.json(
      { error: 'Failed to sync external campaign source' },
      { status: 500 }
    );
  }
}
