import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  BudgetExceededError,
  OwnershipError,
  getProviderRegistryStatus,
  runAIOrchestration,
} from '@/lib/ai/orchestrator';

export const dynamic = 'force-dynamic';

const UniversalInputItemSchema = z.object({
  id: z.string(),
  kind: z.enum([
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
  ]),
  platform: z.enum(['youtube', 'instagram', 'tiktok', 'twitch', 'direct_media', 'website', 'local']),
  supportLevel: z.enum([
    'full_local_processing',
    'direct_import',
    'metadata_and_oembed',
    'metadata_and_text',
    'reference_only',
    'unsupported',
  ]),
  label: z.string(),
  assetId: z.string().optional(),
  url: z.string().optional(),
  text: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.number().optional(),
  thumbnailUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  status: z.enum(['ready', 'uploading', 'ingesting', 'reference_only', 'error']),
  error: z.string().optional(),
});

const AnalyzeRequestSchema = z.object({
  taskType: z
    .enum([
      'hook_generation',
      'clip_moment_analysis',
      'multimodal_analysis',
      'document_analysis',
      'website_analysis',
      'caption_seo',
    ])
    .default('multimodal_analysis'),
  executionMode: z.enum(['local_free', 'direct_api', 'manual_assisted']).default('local_free'),
  approvedPaidExecution: z.boolean().optional().default(false),
  preferredProvider: z.enum(['gemini', 'openai', 'local-heuristic']).optional(),
  projectId: z.string().optional(),
  clippingSessionId: z.string().optional(),
  promptText: z.string().max(8000).optional(),
  platform: z.string().max(100).optional(),
  tone: z.string().max(100).optional(),
  idempotencyKey: z.string().trim().min(4).max(120).optional(),
  inputs: z.array(UniversalInputItemSchema).max(20).optional().default([]),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  return NextResponse.json({ providers: getProviderRegistryStatus() });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const ip = getClientIp(req);
    const rate = checkRateLimit(`ai-analyze:${user.userId}:${ip}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many AI requests. Retry in ${rate.retryAfterSec}s.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const validation = AnalyzeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Invalid AI analysis request' },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await runAIOrchestration({
      ...validation.data,
      userId: user.userId,
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: any) {
    const msg = err?.message || 'AI orchestration failed';
    if (err instanceof OwnershipError) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    if (err instanceof BudgetExceededError) {
      return NextResponse.json({ error: msg }, { status: 402 });
    }
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
