import mongoose, { Schema, Document, Model } from 'mongoose';

export type PipelineStatus = 'pending' | 'transcribing' | 'detecting_hooks' | 'generating_clip' | 'ready_for_review' | 'published' | 'failed';

export interface IClipJob extends Document {
  ownerId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  sourceUrl: string; // YouTube or Drive link
  status: PipelineStatus;
  detectedClips: Array<{
    title: string;
    hookText: string;
    startMs: number;
    endMs: number;
    viralScore?: number;
    videoKey?: string;
    musicTrack?: string;
  }>;
  targetAccounts: mongoose.Types.ObjectId[]; // ref: SocialAccount
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClipJobSchema = new Schema<IClipJob>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    sourceUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'transcribing', 'detecting_hooks', 'generating_clip', 'ready_for_review', 'published', 'failed'],
      default: 'pending',
    },
    detectedClips: [
      {
        title: { type: String },
        hookText: { type: String },
        startMs: { type: Number },
        endMs: { type: Number },
        viralScore: { type: Number },
        videoKey: { type: String },
        musicTrack: { type: String },
      },
    ],
    targetAccounts: [{ type: Schema.Types.ObjectId, ref: 'SocialAccount' }],
    error: { type: String },
  },
  { timestamps: true }
);

export const ClipJob: Model<IClipJob> =
  mongoose.models.ClipJob || mongoose.model<IClipJob>('ClipJob', ClipJobSchema);
