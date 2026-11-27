import { AIExecutionMode, AnalysisCoverage } from '@/models/AIGeneration';
import { UniversalInputItem } from '@/lib/inputDetector';

export type AITaskType =
  | 'hook_generation'
  | 'clip_moment_analysis'
  | 'multimodal_analysis'
  | 'document_analysis'
  | 'website_analysis'
  | 'caption_seo';

export interface ResolvedMultimodalContext {
  promptText: string;
  platform: string;
  tone: string;
  transcriptText: string;
  transcriptSegments: Array<{ start: number; end: number; text: string }>;
  documentExcerpts: Array<{ name: string; kind: string; excerpt: string }>;
  websiteExcerpts: Array<{ url: string; title: string; description?: string; textExcerpt?: string }>;
  imageParts: Array<{ label: string; mimeType: string; base64: string }>;
  videoSummaries: Array<{ label: string; durationSec?: number; resolution?: string; framesExtracted: number }>;
  analysisCoverage: AnalysisCoverage;
  inputDescriptors: Array<{
    kind: string;
    label: string;
    assetId?: string;
    url?: string;
    detectedPlatform?: string;
    supportLevel?: string;
  }>;
}

export interface ProviderInvokeResult {
  provider: 'local-heuristic' | 'manual-assisted' | 'gemini' | 'openai';
  aiModel: string;
  output: Record<string, unknown>;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  promptPreview?: string;
  status: 'completed' | 'awaiting_manual_import';
}

export interface OrchestratorRequest {
  userId: string;
  taskType: AITaskType;
  executionMode: AIExecutionMode;
  approvedPaidExecution?: boolean;
  preferredProvider?: 'gemini' | 'openai' | 'local-heuristic';
  projectId?: string;
  clippingSessionId?: string;
  promptText?: string;
  platform?: string;
  tone?: string;
  inputs?: UniversalInputItem[];
}
