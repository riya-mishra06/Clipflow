import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { AIGeneration } from '@/models/AIGeneration';
import { ClippingSession } from '@/models/ClippingSession';
import { getProviderRegistryStatus, validateAndDedupeSuggestions } from '@/lib/ai/orchestrator';

export const dynamic = 'force-dynamic';

const ManualImportSchema = z.object({
  generationId: z.string().min(1),
  manualJsonText: z.string().min(2),
});

const ImportedClipSuggestionSchema = z.object({
  title: z.string().min(1),
  startSec: z.number().min(0),
  endSec: z.number().positive(),
  hook: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  hashtags: z.array(z.string()).optional().default([]),
  seoKeywords: z.array(z.string()).optional().default([]),
  reason: z.string().optional().default(''),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required', data: [] }, { status: 401 });
    }

    await connectDB();
    const history = await AIGeneration.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({
      data: history,
      providers: getProviderRegistryStatus(),
    });
  } catch (err: any) {
    console.error('AI history fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch AI history', data: [] }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const validation = ManualImportSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid manual import payload' }, { status: 400 });
    }

    const { generationId, manualJsonText } = validation.data;
    if (!mongoose.Types.ObjectId.isValid(generationId)) {
      return NextResponse.json({ error: 'Generation record not found' }, { status: 404 });
    }

    await connectDB();
    const existing = await AIGeneration.findOne({ _id: generationId, userId: user.userId });
    if (!existing) {
      return NextResponse.json({ error: 'Generation record not found' }, { status: 404 });
    }

    let parsedRaw: unknown;
    try {
      const cleaned = manualJsonText.replace(/```json|```/g, '').trim();
      parsedRaw = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON response: please paste valid structured JSON.' },
        { status: 400 }
      );
    }

    if (typeof parsedRaw !== 'object' || parsedRaw === null || Array.isArray(parsedRaw)) {
      return NextResponse.json(
        { error: 'Invalid AI response structure: expected a JSON object.' },
        { status: 400 }
      );
    }

    let finalOutput = parsedRaw as Record<string, unknown>;
    if (existing.taskType === 'clip_moment_analysis') {
      const clipParsed = z
        .object({
          summary: z.string().optional().default('Manual AI-assisted clip recommendations imported.'),
          suggestions: z.array(ImportedClipSuggestionSchema).min(1),
        })
        .safeParse(finalOutput);

      if (!clipParsed.success) {
        return NextResponse.json(
          { error: 'Invalid clip recommendation JSON: expected { suggestions: [{ title, startSec, endSec, ... }] }.' },
          { status: 400 }
        );
      }

      let maxDur: number | undefined;
      if (existing.clippingSessionId) {
        const sess = await ClippingSession.findById(existing.clippingSessionId).select('sourceMetadata');
        maxDur = sess?.sourceMetadata?.durationSec;
      }

      const validSuggestions = validateAndDedupeSuggestions(clipParsed.data.suggestions, maxDur);
      if (validSuggestions.length === 0) {
        return NextResponse.json(
          { error: 'All imported clip timestamps were invalid, out of bounds, or overlapping.' },
          { status: 400 }
        );
      }

      finalOutput = {
        ...finalOutput,
        recommendationSource: 'manual_imported',
        summary: clipParsed.data.summary,
        suggestions: validSuggestions,
      };
    }

    existing.output = finalOutput;
    existing.status = 'completed';
    existing.recommendationSource = 'manual_imported';
    await existing.save();

    return NextResponse.json({ data: existing });
  } catch (err: any) {
    console.error('Manual AI import error:', err);
    return NextResponse.json({ error: 'Failed to import manual AI output' }, { status: 500 });
  }
}
