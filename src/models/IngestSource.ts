import mongoose, { Schema, Document, Model } from 'mongoose';

export type SourceProvider = 'whop' | 'content_rewards' | 'cuelinks' | 'youtube' | 'custom_json';
export type SourceStatus = 'operational' | 'idle' | 'error';

export interface IIngestSource extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  provider: SourceProvider;
  feedUrl?: string;
  status: SourceStatus;
  lastSyncedAt?: Date;
  syncedCount: number;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IngestSourceSchema = new Schema<IIngestSource>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    provider: {
      type: String,
      enum: ['whop', 'content_rewards', 'cuelinks', 'youtube', 'custom_json'],
      default: 'custom_json',
    },
    feedUrl: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['operational', 'idle', 'error'],
      default: 'idle',
    },
    lastSyncedAt: { type: Date },
    syncedCount: { type: Number, default: 0 },
    lastError: { type: String, default: '' },
  },
  { timestamps: true }
);

IngestSourceSchema.index({ ownerId: 1, createdAt: -1 });

export const IngestSource: Model<IIngestSource> =
  mongoose.models.IngestSource || mongoose.model<IIngestSource>('IngestSource', IngestSourceSchema);
