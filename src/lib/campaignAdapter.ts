import { Campaign } from '@/models/Campaign';
import type { SourceProvider } from '@/models/IngestSource';

export interface RawExternalCampaign {
  id?: string | number;
  externalId?: string;
  title?: string;
  name?: string;
  brand?: string;
  merchant?: string;
  advertiser?: string;
  category?: string;
  payoutModel?: string;
  baseRate?: number | string;
  payout?: number | string;
  ratePer1kViews?: number;
  aspectRatio?: string;
  difficulty?: string;
  brief?: string;
  description?: string;
  tags?: string[];
  deadlineDays?: number;
}

const PROVIDER_LABELS: Record<SourceProvider, string> = {
  whop: 'Whop',
  content_rewards: 'Content Rewards',
  cuelinks: 'Cuelinks Affiliate',
  youtube: 'YouTube Data API',
  custom_json: 'JSON Feed',
};

function normalizeExternalItem(
  raw: RawExternalCampaign,
  provider: SourceProvider,
  ownerId: string,
  index: number
) {
  const sourceLabel = PROVIDER_LABELS[provider] || 'External Feed';
  const title = (raw.title || raw.name || '').trim();
  const brand = (raw.brand || raw.merchant || raw.advertiser || sourceLabel).trim();
  const externalId = String(
    raw.externalId || raw.id || `${provider}_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${index}`
  );

  const rawRate = raw.baseRate ?? raw.payout ?? 50;
  const parsedRate =
    typeof rawRate === 'number'
      ? rawRate
      : parseFloat(String(rawRate).replace(/[^0-9.]/g, '')) || 50;

  const payoutModel =
    raw.payoutModel === 'CPM Views' || raw.payoutModel === 'Hybrid Base + Bonus'
      ? raw.payoutModel
      : 'Fixed Per Clip';

  const difficulty =
    raw.difficulty === 'Beginner' || raw.difficulty === 'Advanced'
      ? raw.difficulty
      : 'Intermediate';

  return {
    externalId,
    source: sourceLabel,
    title: title.slice(0, 120),
    brand: brand.slice(0, 80),
    category: raw.category || (provider === 'cuelinks' ? 'Lifestyle & Fitness' : 'Tech & AI'),
    payoutModel,
    baseRate: Math.max(0, parsedRate),
    ratePer1kViews: Number(raw.ratePer1kViews || 0),
    aspectRatio: raw.aspectRatio || '9:16',
    difficulty,
    brief: (raw.brief || raw.description || `Imported from ${sourceLabel}`).trim(),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String).slice(0, 8) : [provider],
    deadlineDays: Number(raw.deadlineDays || 14),
    availability: 'open' as const,
    ownerId,
  };
}

/**
 * Normalizes an array of external campaign items and upserts them into MongoDB Atlas.
 * Using (source + externalId) prevents duplicate campaigns on repeated syncs!
 */
export async function upsertExternalCampaigns(
  items: RawExternalCampaign[],
  provider: SourceProvider,
  ownerId: string
): Promise<{ inserted: number; updated: number; totalProcessed: number }> {
  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (!raw || !(raw.title || raw.name)) continue;

    const doc = normalizeExternalItem(raw, provider, ownerId, i);
    const result = await Campaign.updateOne(
      { source: doc.source, externalId: doc.externalId },
      { $set: doc },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      inserted += 1;
    } else if (result.matchedCount > 0) {
      updated += 1;
    }
  }

  return { inserted, updated, totalProcessed: inserted + updated };
}
