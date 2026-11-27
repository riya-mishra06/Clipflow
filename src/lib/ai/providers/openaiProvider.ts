import { AITaskType, ProviderInvokeResult, ResolvedMultimodalContext } from '@/lib/ai/types';
import { buildManualPromptPack } from '@/lib/ai/providers/localProvider';

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function invokeOpenAI(
  taskType: AITaskType,
  ctx: ResolvedMultimodalContext
): Promise<ProviderInvokeResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const promptText = buildManualPromptPack(taskType, ctx);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    signal: AbortSignal.timeout(30_000),
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API HTTP ${res.status}`);
  }

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  const inputTokens = Number(data?.usage?.prompt_tokens || 0);
  const outputTokens = Number(data?.usage?.completion_tokens || 0);
  const estimatedCostUsd = Number(((inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6).toFixed(6));

  return {
    provider: 'openai',
    aiModel: 'gpt-4o-mini',
    output: parsed,
    inputTokens,
    outputTokens,
    estimatedCostUsd,
    promptPreview: promptText,
    status: 'completed',
  };
}
