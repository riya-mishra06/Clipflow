import mongoose, { Schema, Document } from 'mongoose';

export type AIExecutionMode = 'local_free' | 'direct_api' | 'manual_assisted';
export type AnalysisCoverage =
  | 'text_only'
  | 'transcript_only'
  | 'multimodal_frames_and_transcript'
  | 'image_vision'
  | 'document_text'
  | 'metadata_reference_only';

export interface IAIGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId | null;
  clippingSessionId?: mongoose.Types.ObjectId | null;
  taskType: string;
  provider: 'local-heuristic' | 'manual-assisted' | 'gemini' | 'openai';
  aiModel: string;
  mode: AIExecutionMode;
  promptTemplateKey: string;
  promptVersion: string;
  analysisCoverage: AnalysisCoverage;
  inputs: Array<{
    kind: string;
    label: string;
    assetId?: string;
    url?: string;
    detectedPlatform?: string;
    supportLevel?: string;
  }>;
  estimatedCostUsd: number;
  approvedPaidExecution: boolean;
  usage: {
    inputTokens: number;
    outputTokens: number;
    framesAnalyzed: number;
    latencyMs: number;
  };
  promptPreview?: string;
  idempotencyKey?: string;
  recommendationSource?: 'rule_based' | 'llm_generated' | 'manual_imported';
  output: Record<string, unknown> | null;
  status: 'completed' | 'awaiting_manual_import' | 'failed';
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIGenerationSchema = new Schema<IAIGeneration>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    clippingSessionId: { type: Schema.Types.ObjectId, ref: 'ClippingSession', default: null },
    taskType: { type: String, required: true, index: true },
    provider: {
      type: String,
      enum: ['local-heuristic', 'manual-assisted', 'gemini', 'openai'],
      required: true,
    },
    aiModel: { type: String, required: true },
    mode: {
      type: String,
      enum: ['local_free', 'direct_api', 'manual_assisted'],
      required: true,
    },
    promptTemplateKey: { type: String, required: true },
    promptVersion: { type: String, required: true },
    analysisCoverage: {
      type: String,
      enum: [
        'text_only',
        'transcript_only',
        'multimodal_frames_and_transcript',
        'image_vision',
        'document_text',
        'metadata_reference_only',
      ],
      required: true,
    },
    inputs: {
      type: [
        {
          kind: String,
          label: String,
          assetId: String,
          url: String,
          detectedPlatform: String,
          supportLevel: String,
        },
      ],
      default: [],
    },
    estimatedCostUsd: { type: Number, default: 0 },
    approvedPaidExecution: { type: Boolean, default: false },
    usage: {
      inputTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
      framesAnalyzed: { type: Number, default: 0 },
      latencyMs: { type: Number, default: 0 },
    },
    promptPreview: { type: String },
    idempotencyKey: { type: String },
    recommendationSource: {
      type: String,
      enum: ['rule_based', 'llm_generated', 'manual_imported'],
      default: 'rule_based',
    },
    output: { type: Schema.Types.Mixed, default: null },
    status: {
      type: String,
      enum: ['completed', 'awaiting_manual_import', 'failed'],
      default: 'completed',
    },
    error: { type: String },
  },
  { timestamps: true }
);

AIGenerationSchema.index({ userId: 1, createdAt: -1 });
AIGenerationSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
);

export const AIGeneration =
  (mongoose.models.AIGeneration as mongoose.Model<IAIGeneration>) ||
  mongoose.model<IAIGeneration>('AIGeneration', AIGenerationSchema);
