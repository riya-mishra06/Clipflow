import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { runAIOrchestration } from '@/lib/ai/orchestrator';

const GenerateHooksSchema = z.object({
  topic: z.string().trim().min(2, { message: 'Please enter a video topic or product' }).max(300),
  platform: z.string().trim().optional().default('Instagram Reels & TikTok'),
  tone: z.string().trim().optional().default('High Retention / Pattern Interrupt'),
  executionMode: z.enum(['local_free', 'direct_api', 'manual_assisted']).optional().default('local_free'),
  approvedPaidExecution: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to generate AI hooks' },
        { status: 401 }
      );
    }

    const ip = getClientIp(req);
    const rate = checkRateLimit(`ai-hooks:${user.userId}:${ip}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many AI requests. Please retry in ${rate.retryAfterSec}s.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const validation = GenerateHooksSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { topic, platform, tone, executionMode, approvedPaidExecution } = validation.data;
    await connectDB();

    const result = await runAIOrchestration({
      userId: user.userId,
      taskType: 'hook_generation',
      executionMode,
      approvedPaidExecution,
      promptText: topic,
      platform,
      tone,
    });

    const rawHooks = Array.isArray((result.output as any)?.hooks) ? (result.output as any).hooks : [];
    const hooks = rawHooks.map((item: any, idx: number) => ({
      id: item.id || `h-${Date.now()}-${idx + 1}`,
      hook: String(item.hook || ''),
      score: Number(item.score) || 88,
      retentionEstimate: String(item.retentionEstimate || '76% at 0:03'),
      pacingNote: String(item.pacingNote || ''),
      visualCue: String(item.visualCue || ''),
    }));

    return NextResponse.json({
      mode: result.provider === 'gemini' ? 'gemini' : 'fallback',
      provider: result.provider,
      generationId: result.generation._id,
      hooks,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to generate AI hooks' },
      { status: 400 }
    );
  }
}
