import crypto from 'crypto';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { Asset } from '@/models/Asset';
import { ClippingSession } from '@/models/ClippingSession';
import { AIGeneration, AnalysisCoverage } from '@/models/AIGeneration';
import { AIBudget } from '@/models/AIBudget';
import { getTempRoot, resolveAssetAbsolutePath } from '@/lib/storage';
import { extractAudio, extractFrames, probeMedia, transcribeAudio } from '@/lib/mediaProcessor';
import { PROMPT_TEMPLATES } from '@/lib/ai/promptTemplates';
import { OrchestratorRequest, ProviderInvokeResult, ResolvedMultimodalContext } from '@/lib/ai/types';
import { runLocalHeuristic } from '@/lib/ai/providers/localProvider';
import { estimateGeminiCostUsd, invokeGemini, isGeminiConfigured } from '@/lib/ai/providers/geminiProvider';
import { invokeOpenAI, isOpenAIConfigured } from '@/lib/ai/providers/openaiProvider';

const ClipSuggestionSchema = z.object({
  title: z.string().min(1),
  startSec: z.number().min(0),
  endSec: z.number().positive(),
  hook: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  hashtags: z.array(z.string()).optional().default([]),
  seoKeywords: z.array(z.string()).optional().default([]),
  reason: z.string().optional().default(''),
});

const ClipMomentResponseSchema = z.object({
  summary: z.string().optional().default(''),
  suggestions: z.array(ClipSuggestionSchema),
});

const HookResponseSchema = z.object({
  hooks: z.array(
    z.object({
      hook: z.string().min(1),
      score: z.number().optional(),
      retentionEstimate: z.string().optional(),
      pacingNote: z.string().optional(),
      visualCue: z.string().optional(),
    })
  ),
});

const GenericResponseSchema = z.record(z.string(), z.unknown());

export class BudgetExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetExceededError';
  }
}

export class OwnershipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OwnershipError';
  }
}

export function getProviderRegistryStatus() {
  return {
    local: { available: true, costUsd: 0 },
    manualAssisted: { available: true, costUsd: 0 },
    gemini: { available: isGeminiConfigured(), model: 'gemini-2.5-flash' },
    openai: { available: isOpenAIConfigured(), model: 'gpt-4o-mini' },
  };
}

function extractReadablePdfText(buf: Buffer): string {
  const raw = buf.toString('latin1');
  const matches = raw.match(/\(([^()]{3,120})\)/g) || [];
  const cleaned = matches
    .map((m) => m.slice(1, -1).replace(/\\[nrt]/g, ' '))
    .filter((s) => /[a-zA-Z]{2,}/.test(s))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.slice(0, 4000) || 'Binary/scanned PDF attached (no plain text stream extracted locally).';
}

export function validateAndDedupeSuggestions(
  rawSuggestions: Array<z.infer<typeof ClipSuggestionSchema>>,
  maxDurationSec?: number
) {
  const accepted: Array<z.infer<typeof ClipSuggestionSchema>> = [];
  for (const s of rawSuggestions) {
    if (!Number.isFinite(s.startSec) || !Number.isFinite(s.endSec)) continue;
    if (s.startSec < 0 || s.endSec <= s.startSec) continue;
    if (maxDurationSec && s.endSec > maxDurationSec + 0.5) continue;

    // Reject duplicate or heavily overlapping (>60%) recommendations
    const overlaps = accepted.some((prev) => {
      const inter = Math.min(prev.endSec, s.endSec) - Math.max(prev.startSec, s.startSec);
      const minDur = Math.min(prev.endSec - prev.startSec, s.endSec - s.startSec);
      return inter > 0 && minDur > 0 && inter / minDur > 0.6;
    });
    if (overlaps) continue;
    accepted.push(s);
  }
  return accepted;
}

async function resolveMultimodalContext(req: OrchestratorRequest): Promise<{
  ctx: ResolvedMultimodalContext;
  cleanupPaths: string[];
  maxDurationSec?: number;
}> {
  const cleanupPaths: string[] = [];
  let maxDurationSec: number | undefined;
  const ctx: ResolvedMultimodalContext = {
    promptText: (req.promptText || '').trim(),
    platform: req.platform || 'Instagram Reels & YouTube Shorts',
    tone: req.tone || 'High Retention / Clear Storytelling',
    transcriptText: '',
    transcriptSegments: [],
    documentExcerpts: [],
    websiteExcerpts: [],
    imageParts: [],
    videoSummaries: [],
    analysisCoverage: 'text_only',
    inputDescriptors: [],
  };

  if (req.clippingSessionId) {
    const sess = await ClippingSession.findOne({ _id: req.clippingSessionId, ownerId: req.userId });
    if (!sess) {
      throw new OwnershipError('Clipping session not found or unauthorized');
    }
    maxDurationSec = sess.sourceMetadata?.durationSec;
    if (sess.transcript?.text) {
      ctx.transcriptText = sess.transcript.text;
      ctx.transcriptSegments = (sess.transcript.segments || []).map((s) => ({
        start: s.start,
        end: s.end,
        text: s.text,
      }));
      ctx.analysisCoverage = 'transcript_only';
    }
  }

  for (const item of req.inputs || []) {
    ctx.inputDescriptors.push({
      kind: item.kind,
      label: item.label,
      assetId: item.assetId,
      url: item.url,
      detectedPlatform: item.platform,
      supportLevel: item.supportLevel,
    });

    if (item.kind === 'text_prompt' && item.text) {
      ctx.promptText = [ctx.promptText, item.text].filter(Boolean).join('\n');
      continue;
    }

    if (item.url && !item.assetId) {
      ctx.websiteExcerpts.push({
        url: item.url,
        title: String(item.metadata?.title || item.label || item.url),
        description: item.metadata?.description ? String(item.metadata.description) : undefined,
        textExcerpt: item.metadata?.textExcerpt ? String(item.metadata.textExcerpt) : undefined,
      });
      continue;
    }

    if (!item.assetId) continue;

    const asset = await Asset.findOne({ _id: item.assetId, ownerId: req.userId, deletedAt: null });
    if (!asset || !asset.objectKey) {
      throw new OwnershipError('Referenced asset not found or unauthorized');
    }

    const absPath = resolveAssetAbsolutePath(asset.objectKey);
    if (!fs.existsSync(absPath)) continue;

    if (asset.category === 'image') {
      const buf = await fsp.readFile(absPath);
      if (buf.length <= 5 * 1024 * 1024) {
        ctx.imageParts.push({
          label: asset.name,
          mimeType: asset.mimeType || 'image/jpeg',
          base64: buf.toString('base64'),
        });
      }
    } else if (asset.category === 'audio') {
      // Actual local speech transcription for audio assets
      const wavTmp = path.join(getTempRoot(), `ai-audio-${crypto.randomUUID()}.wav`);
      cleanupPaths.push(wavTmp);
      try {
        await extractAudio(absPath, wavTmp);
        const tr = await transcribeAudio(wavTmp, 'base', 4);
        if (tr.text) {
          ctx.transcriptText = [ctx.transcriptText, tr.text].filter(Boolean).join('\n');
          ctx.transcriptSegments.push(
            ...tr.segments.map((s) => ({ start: s.start, end: s.end, text: s.text }))
          );
        }
      } catch {
        ctx.documentExcerpts.push({
          name: asset.name,
          kind: 'audio',
          excerpt: 'Audio file attached (no speech detected or transcription skipped).',
        });
      }
    } else if (asset.category === 'video') {
      const meta = await probeMedia(absPath).catch(() => null);
      let framesExtracted = 0;

      if (req.executionMode === 'direct_api') {
        const frameDir = path.join(getTempRoot(), `ai-frames-${crypto.randomUUID()}`);
        cleanupPaths.push(frameDir);
        const dur = meta?.durationSec || 10;
        const fps = Math.max(0.1, Math.min(1, 4 / dur));
        const frames = await extractFrames(absPath, frameDir, fps).catch(() => []);
        for (const f of frames.slice(0, 4)) {
          const buf = await fsp.readFile(f);
          framesExtracted += 1;
          ctx.imageParts.push({
            label: `${asset.name} frame ${framesExtracted}`,
            mimeType: 'image/jpeg',
            base64: buf.toString('base64'),
          });
        }
      }

      ctx.videoSummaries.push({
        label: asset.name,
        durationSec: meta?.durationSec,
        resolution: meta ? `${meta.width}x${meta.height}` : undefined,
        framesExtracted,
      });
    } else if (asset.category === 'document' || asset.category === 'transcript') {
      const buf = await fsp.readFile(absPath);
      const isPdf = asset.mimeType === 'application/pdf' || asset.name.toLowerCase().endsWith('.pdf');
      const excerpt = isPdf ? extractReadablePdfText(buf) : buf.toString('utf8').slice(0, 6000);
      ctx.documentExcerpts.push({
        name: asset.name,
        kind: asset.category,
        excerpt,
      });
    }
  }

  const hasFramesOrImages = ctx.imageParts.length > 0;
  const hasTranscript = Boolean(ctx.transcriptText || ctx.transcriptSegments.length > 0);
  const hasDocs = ctx.documentExcerpts.length > 0;
  const hasWeb = ctx.websiteExcerpts.length > 0;

  let coverage: AnalysisCoverage = 'text_only';
  if (hasFramesOrImages && hasTranscript) coverage = 'multimodal_frames_and_transcript';
  else if (hasFramesOrImages) coverage = 'image_vision';
  else if (hasTranscript) coverage = 'transcript_only';
  else if (hasDocs) coverage = 'document_text';
  else if (hasWeb) coverage = 'metadata_reference_only';

  ctx.analysisCoverage = coverage;
  return { ctx, cleanupPaths, maxDurationSec };
}

export async function runAIOrchestration(
  req: OrchestratorRequest & { idempotencyKey?: string }
) {
  const t0 = performance.now();
  const tmpl = PROMPT_TEMPLATES[req.taskType];

  if (req.idempotencyKey) {
    const existing = await AIGeneration.findOne({
      userId: req.userId,
      idempotencyKey: req.idempotencyKey,
    });
    if (existing) {
      return {
        generation: existing,
        deduplicated: true,
        estimatedCostUsd: existing.estimatedCostUsd,
        analysisCoverage: existing.analysisCoverage,
        provider: existing.provider,
        aiModel: existing.aiModel,
        output: existing.output || {},
        status: existing.status,
      };
    }
  }

  const { ctx, cleanupPaths, maxDurationSec } = await resolveMultimodalContext(req);
  const periodKey = new Date().toISOString().slice(0, 7);
  let reservedCost = 0;

  try {
    let result: ProviderInvokeResult;
    const estCost = req.executionMode === 'direct_api' ? estimateGeminiCostUsd(ctx) : 0;

    if (req.executionMode === 'direct_api') {
      if (!req.approvedPaidExecution) {
        throw new BudgetExceededError(
          `Direct AI API execution requires explicit user approval (estimated cost: $${estCost.toFixed(6)}).`
        );
      }

      // Ensure default $0.00 budget document exists for current period
      await AIBudget.findOneAndUpdate(
        { userId: req.userId, periodKey },
        { $setOnInsert: { userId: req.userId, periodKey, monthlyLimitUsd: 0, reservedUsd: 0, spentUsd: 0 } },
        { upsert: true }
      );

      // Atomic budget reservation (default monthlyLimitUsd = 0 blocks all paid calls unless raised)
      const reserved = await AIBudget.findOneAndUpdate(
        {
          userId: req.userId,
          periodKey,
          $expr: {
            $lte: [{ $add: ['$spentUsd', '$reservedUsd', estCost] }, '$monthlyLimitUsd'],
          },
        },
        { $inc: { reservedUsd: estCost } },
        { new: true }
      );

      if (!reserved) {
        throw new BudgetExceededError(
          `Monthly AI budget exceeded or set to $0.00 default zero-spending limit. Raise budget or use Local Free / Manual Assisted mode.`
        );
      }
      reservedCost = estCost;

      if (req.preferredProvider === 'openai' && isOpenAIConfigured()) {
        result = await invokeOpenAI(req.taskType, ctx);
      } else if (isGeminiConfigured()) {
        result = await invokeGemini(req.taskType, ctx);
      } else {
        throw new Error('No external AI API key configured.');
      }

      // Commit spent cost atomically
      await AIBudget.updateOne(
        { userId: req.userId, periodKey },
        { $inc: { reservedUsd: -reservedCost, spentUsd: result.estimatedCostUsd } }
      );
      reservedCost = 0;
    } else if (req.executionMode === 'manual_assisted') {
      result = runLocalHeuristic(req.taskType, ctx, 'manual_assisted');
    } else {
      result = runLocalHeuristic(req.taskType, ctx, 'local_free');
    }

    // Strict task-specific Zod validation + clip timestamp/overlap sanitization
    let validatedOutput: Record<string, unknown>;
    if (req.taskType === 'clip_moment_analysis' && result.status === 'completed') {
      const parsed = ClipMomentResponseSchema.parse(result.output);
      validatedOutput = {
        ...result.output,
        summary: parsed.summary,
        suggestions: validateAndDedupeSuggestions(parsed.suggestions, maxDurationSec),
      };
    } else if (req.taskType === 'hook_generation' && result.status === 'completed') {
      HookResponseSchema.parse(result.output);
      validatedOutput = GenericResponseSchema.parse(result.output);
    } else {
      validatedOutput = GenericResponseSchema.parse(result.output);
    }

    const recommendationSource =
      result.provider === 'gemini' || result.provider === 'openai'
        ? 'llm_generated'
        : result.provider === 'manual-assisted'
        ? 'manual_imported'
        : 'rule_based';

    const latencyMs = Math.round(performance.now() - t0);

    const record = await AIGeneration.create({
      userId: req.userId,
      projectId: req.projectId || null,
      clippingSessionId: req.clippingSessionId || null,
      taskType: req.taskType,
      provider: result.provider,
      aiModel: result.aiModel,
      mode: req.executionMode,
      promptTemplateKey: tmpl.key,
      promptVersion: tmpl.version,
      analysisCoverage: ctx.analysisCoverage,
      inputs: ctx.inputDescriptors,
      estimatedCostUsd: result.estimatedCostUsd,
      approvedPaidExecution: Boolean(req.approvedPaidExecution),
      usage: {
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        framesAnalyzed: ctx.imageParts.length,
        latencyMs,
      },
      promptPreview: result.promptPreview,
      idempotencyKey: req.idempotencyKey,
      recommendationSource,
      output: validatedOutput,
      status: result.status,
    });

    return {
      generation: record,
      deduplicated: false,
      estimatedCostUsd: result.estimatedCostUsd,
      analysisCoverage: ctx.analysisCoverage,
      provider: result.provider,
      aiModel: result.aiModel,
      recommendationSource,
      output: validatedOutput,
      status: result.status,
    };
  } catch (err) {
    if (reservedCost > 0) {
      await AIBudget.updateOne(
        { userId: req.userId, periodKey },
        { $inc: { reservedUsd: -reservedCost } }
      ).catch(() => {});
    }
    throw err;
  } finally {
    for (const p of cleanupPaths) {
      await fsp.rm(p, { recursive: true, force: true }).catch(() => {});
    }
  }
}
