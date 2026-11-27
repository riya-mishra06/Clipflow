import { AITaskType, ProviderInvokeResult, ResolvedMultimodalContext } from '@/lib/ai/types';
import { buildManualPromptPack } from '@/lib/ai/providers/localProvider';

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function estimateGeminiCostUsd(ctx: ResolvedMultimodalContext): number {
  const textChars =
    ctx.promptText.length +
    ctx.transcriptText.length +
    ctx.documentExcerpts.reduce((acc, d) => acc + d.excerpt.length, 0) +
    ctx.websiteExcerpts.reduce((acc, w) => acc + (w.textExcerpt?.length || 0), 0);
  const estInputTokens = Math.ceil(textChars / 4) + ctx.imageParts.length * 258;
  const estOutputTokens = 500;
  // Conservative Gemini 2.5 Flash estimate ($0.15 / 1M input, $0.60 / 1M output)
  const cost = (estInputTokens / 1_000_000) * 0.15 + (estOutputTokens / 1_000_000) * 0.6;
  return Number(Math.max(0.0001, cost).toFixed(6));
}

export async function invokeGemini(
  taskType: AITaskType,
  ctx: ResolvedMultimodalContext
): Promise<ProviderInvokeResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const promptText = buildManualPromptPack(taskType, ctx);
  const parts: Array<Record<string, unknown>> = [{ text: promptText }];

  // Attach extracted keyframes or image references (never raw large video binaries)
  for (const img of ctx.imageParts.slice(0, 6)) {
    parts.push({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64,
      },
    });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(30_000),
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  const inputTokens = Number(data?.usageMetadata?.promptTokenCount || 0);
  const outputTokens = Number(data?.usageMetadata?.candidatesTokenCount || 0);
  const estimatedCostUsd = estimateGeminiCostUsd(ctx);

  return {
    provider: 'gemini',
    aiModel: 'gemini-2.5-flash',
    output: parsed,
    inputTokens,
    outputTokens,
    estimatedCostUsd,
    promptPreview: promptText,
    status: 'completed',
  };
}
