import { AITaskType } from '@/lib/ai/types';

export interface TemplateDefinition {
  key: string;
  version: string;
  taskType: AITaskType;
  systemPrompt: string;
  outputSchemaName: string;
}

export const PROMPT_TEMPLATES: Record<AITaskType, TemplateDefinition> = {
  hook_generation: {
    key: 'hook_generation_v1',
    version: '1.0.0',
    taskType: 'hook_generation',
    systemPrompt:
      'You are a short-form video strategist. Return ONLY valid JSON with key "hooks" containing an array of 3 objects: { "hook": string, "score": number, "retentionEstimate": string, "pacingNote": string, "visualCue": string }.',
    outputSchemaName: 'HookGenerationResponse',
  },
  clip_moment_analysis: {
    key: 'clip_moment_analysis_v1',
    version: '1.1.0',
    taskType: 'clip_moment_analysis',
    systemPrompt:
      'Analyze the provided timestamped transcript and metadata. Suggest up to 3 non-overlapping clip ranges grounded strictly in the provided timestamps. Return ONLY valid JSON: { "summary": string, "suggestions": [{ "title": string, "startSec": number, "endSec": number, "hook": string, "caption": string, "hashtags": string[], "seoKeywords": string[], "reason": string }] }.',
    outputSchemaName: 'ClipMomentResponse',
  },
  multimodal_analysis: {
    key: 'multimodal_analysis_v1',
    version: '1.0.0',
    taskType: 'multimodal_analysis',
    systemPrompt:
      'Analyze all provided multimodal inputs (text, images, video frames/transcripts, documents, and website metadata). Return ONLY valid JSON: { "summary": string, "keyInsights": string[], "recommendedHooks": string[], "recommendedActions": string[], "caption": string, "hashtags": string[] }.',
    outputSchemaName: 'MultimodalAnalysisResponse',
  },
  document_analysis: {
    key: 'document_analysis_v1',
    version: '1.0.0',
    taskType: 'document_analysis',
    systemPrompt:
      'Extract key points, script beats, and content angles from the provided document or subtitle files. Return ONLY valid JSON: { "summary": string, "keyInsights": string[], "recommendedHooks": string[], "recommendedActions": string[] }.',
    outputSchemaName: 'DocumentAnalysisResponse',
  },
  website_analysis: {
    key: 'website_analysis_v1',
    version: '1.0.0',
    taskType: 'website_analysis',
    systemPrompt:
      'Analyze the provided product or reference webpage metadata and excerpt. Return ONLY valid JSON: { "summary": string, "keyInsights": string[], "recommendedHooks": string[], "recommendedActions": string[] }.',
    outputSchemaName: 'WebsiteAnalysisResponse',
  },
  caption_seo: {
    key: 'caption_seo_v1',
    version: '1.0.0',
    taskType: 'caption_seo',
    systemPrompt:
      'Generate a concise social caption, SEO keywords, and hashtags. Return ONLY valid JSON: { "caption": string, "hashtags": string[], "seoKeywords": string[] }.',
    outputSchemaName: 'CaptionSeoResponse',
  },
};
