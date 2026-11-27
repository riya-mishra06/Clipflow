import mongoose, { Schema, Document, Model } from 'mongoose';

export type JobType =
  | 'NOOP_TEST'
  | 'TEMP_FILE_CLEANUP'
  | 'MEDIA_ANALYSIS'
  | 'AUDIO_EXTRACTION'
  | 'VIDEO_TRIM'
  | 'VIDEO_SPLIT'
  | 'VIDEO_CONCAT'
  | 'SMART_CROP'
  | 'THUMBNAIL_GENERATION'
  | 'FRAME_EXTRACTION'
  | 'TRANSCRIPTION'
  | 'SUBTITLE_RENDER'
  | 'CLIP_PIPELINE';

export const HEAVY_MEDIA_JOB_TYPES: JobType[] = [
  'MEDIA_ANALYSIS',
  'AUDIO_EXTRACTION',
  'VIDEO_TRIM',
  'VIDEO_SPLIT',
  'VIDEO_CONCAT',
  'SMART_CROP',
  'THUMBNAIL_GENERATION',
  'FRAME_EXTRACTION',
  'TRANSCRIPTION',
  'SUBTITLE_RENDER',
  'CLIP_PIPELINE',
];

export type JobStatus =
  | 'QUEUED'
  | 'AWAITING_APPROVAL'
  | 'SCHEDULED'
  | 'PROCESSING'
  | 'RETRY_SCHEDULED'
  | 'CANCELLING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export type ApprovalStatus = 'NOT_REQUIRED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IJob extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId?: mongoose.Types.ObjectId | null;
  projectId?: mongoose.Types.ObjectId | null;
  parentJobId?: mongoose.Types.ObjectId | null;
  type: JobType;
  status: JobStatus;
  priority: number; // 1 (Background) to 5 (Critical)
  progress: number;
  currentStage: string;
  dependencies: mongoose.Types.ObjectId[];
  input: Record<string, unknown>;
  inputHash: string;
  output: Record<string, unknown> | null;
  attempts: number;
  maxAttempts: number;
  workerId: string | null;
  leaseExpiresAt: Date | null;
  lastHeartbeatAt: Date | null;
  claimVersion: number;
  idempotencyKey?: string;
  approvalStatus: ApprovalStatus;
  estimatedCost: number;
  actualCost: number | null;
  currency: string;
  scheduledAt: Date | null;
  nextRunAt: Date;
  error: { message: string; code?: string } | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspaceId: { type: Schema.Types.ObjectId, default: null },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    parentJobId: { type: Schema.Types.ObjectId, ref: 'Job', default: null },
    type: {
      type: String,
      enum: [
        'NOOP_TEST',
        'TEMP_FILE_CLEANUP',
        'MEDIA_ANALYSIS',
        'AUDIO_EXTRACTION',
        'VIDEO_TRIM',
        'VIDEO_SPLIT',
        'VIDEO_CONCAT',
        'SMART_CROP',
        'THUMBNAIL_GENERATION',
        'FRAME_EXTRACTION',
        'TRANSCRIPTION',
        'SUBTITLE_RENDER',
        'CLIP_PIPELINE',
      ],
      required: true,
    },
    status: {
      type: String,
      enum: [
        'QUEUED',
        'AWAITING_APPROVAL',
        'SCHEDULED',
        'PROCESSING',
        'RETRY_SCHEDULED',
        'CANCELLING',
        'COMPLETED',
        'FAILED',
        'CANCELLED',
      ],
      default: 'QUEUED',
    },
    priority: { type: Number, default: 3, min: 1, max: 5 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    currentStage: { type: String, default: 'Queued' },
    dependencies: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    input: { type: Schema.Types.Mixed, default: {} },
    inputHash: { type: String, required: true },
    output: { type: Schema.Types.Mixed, default: null },
    attempts: { type: Number, default: 0, min: 0 },
    maxAttempts: { type: Number, default: 3, min: 1, max: 10 },
    workerId: { type: String, default: null },
    leaseExpiresAt: { type: Date, default: null },
    lastHeartbeatAt: { type: Date, default: null },
    claimVersion: { type: Number, default: 0, min: 0 },
    idempotencyKey: { type: String, trim: true },
    approvalStatus: {
      type: String,
      enum: ['NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED'],
      default: 'NOT_REQUIRED',
    },
    estimatedCost: { type: Number, default: 0, min: 0 },
    actualCost: { type: Number, default: null },
    currency: { type: String, default: 'USD' },
    scheduledAt: { type: Date, default: null },
    nextRunAt: { type: Date, default: () => new Date() },
    error: { type: Schema.Types.Mixed, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Queue polling index
JobSchema.index({ status: 1, priority: -1, nextRunAt: 1, createdAt: 1 });
// Lease recovery sweep index
JobSchema.index({ status: 1, leaseExpiresAt: 1 });
// User job listing index
JobSchema.index({ userId: 1, createdAt: -1 });
// Partial unique index for non-empty idempotency keys per user
JobSchema.index(
  { userId: 1, idempotencyKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      idempotencyKey: { $type: 'string', $gt: '' },
    },
  }
);

if (
  mongoose.models.Job &&
  !(mongoose.models.Job.schema.path('type') as any)?.enumValues?.includes('CLIP_PIPELINE')
) {
  delete mongoose.models.Job;
}

export const Job: Model<IJob> =
  mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
