import mongoose, { Schema, Document, Model } from 'mongoose';

export type ClipStatus = 'draft' | 'queued' | 'processing' | 'ready' | 'failed';

export interface IClippingItem {
  id: string;
  title: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  cropMode: 'center' | 'manual';
  cropOffsetRatio: number; // 0.0 (left) to 1.0 (right), 0.5 = center
  subtitleStyle: {
    enabled: boolean;
    fontSize: number;
    primaryColor: string;
    position: 'bottom' | 'center' | 'top';
  };
  brandText?: string;
  logoAssetId?: string;
  status: ClipStatus;
  jobId?: string;
  outputAssetId?: string;
  thumbnailAssetId?: string;
  error?: string;
}

export interface IClippingSession extends Document {
  ownerId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  title: string;
  sourceAssetId: mongoose.Types.ObjectId;
  sourceMetadata?: {
    durationSec?: number;
    width?: number;
    height?: number;
    fps?: number;
    aspectRatio?: string;
    videoCodec?: string | null;
    audioCodec?: string | null;
    hasAudio?: boolean;
    sizeBytes?: number;
  };
  transcript?: {
    modelUsed?: string;
    language?: string;
    text?: string;
    segments?: Array<{
      id: number;
      start: number;
      end: number;
      text: string;
      words?: Array<{ word: string; start: number; end: number }>;
    }>;
    srtAssetId?: string;
    vttAssetId?: string;
  };
  clips: IClippingItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ClippingItemSchema = new Schema<IClippingItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    startSec: { type: Number, required: true, min: 0 },
    endSec: { type: Number, required: true, min: 0.5 },
    durationSec: { type: Number, required: true, min: 0.5 },
    cropMode: { type: String, enum: ['center', 'manual'], default: 'center' },
    cropOffsetRatio: { type: Number, default: 0.5, min: 0, max: 1 },
    subtitleStyle: {
      enabled: { type: Boolean, default: true },
      fontSize: { type: Number, default: 18, min: 10, max: 42 },
      primaryColor: { type: String, default: '#FFFFFF' },
      position: { type: String, enum: ['bottom', 'center', 'top'], default: 'bottom' },
    },
    brandText: { type: String, default: '' },
    logoAssetId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'queued', 'processing', 'ready', 'failed'],
      default: 'draft',
    },
    jobId: { type: String, default: '' },
    outputAssetId: { type: String, default: '' },
    thumbnailAssetId: { type: String, default: '' },
    error: { type: String, default: '' },
  },
  { _id: false }
);

const ClippingSessionSchema = new Schema<IClippingSession>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    sourceAssetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    sourceMetadata: { type: Schema.Types.Mixed, default: null },
    transcript: { type: Schema.Types.Mixed, default: null },
    clips: { type: [ClippingItemSchema], default: [] },
  },
  { timestamps: true }
);

ClippingSessionSchema.index({ ownerId: 1, createdAt: -1 });
ClippingSessionSchema.index({ projectId: 1 });

export const ClippingSession: Model<IClippingSession> =
  mongoose.models.ClippingSession ||
  mongoose.model<IClippingSession>('ClippingSession', ClippingSessionSchema);
