import mongoose, { Schema, Document, Model } from 'mongoose';

export type AssetKind = 'upload' | 'link';
export type AssetCategory = 'video' | 'audio' | 'image' | 'document' | 'transcript' | 'other';
export type AssetStatus = 'pending' | 'ready' | 'failed';

export interface IAsset extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  kind: AssetKind;
  category: AssetCategory;
  mimeType?: string;
  sizeBytes?: number;
  durationMs?: number;
  externalUrl?: string;
  objectKey?: string;
  status: AssetStatus;
  tags: string[];
  projectTitle?: string;
  attachedProjectIds: mongoose.Types.ObjectId[];
  deletedAt?: Date;
  expireAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    kind: { type: String, enum: ['upload', 'link'], required: true },
    category: {
      type: String,
      enum: ['video', 'audio', 'image', 'document', 'transcript', 'other'],
      default: 'video',
    },
    mimeType: { type: String },
    sizeBytes: { type: Number, default: 0, min: 0 },
    durationMs: { type: Number },
    externalUrl: { type: String, trim: true },
    objectKey: { type: String },
    status: { type: String, enum: ['pending', 'ready', 'failed'], default: 'ready' },
    tags: [{ type: String }],
    projectTitle: { type: String },
    attachedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    deletedAt: { type: Date, default: null },
    expireAt: { type: Date, default: null },
  },
  { timestamps: true }
);

AssetSchema.index({ ownerId: 1, category: 1 });
AssetSchema.index({ createdAt: -1 });
// MongoDB TTL Index: automatically permanently deletes documents once expireAt time is reached
AssetSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Ensure hot-reload picks up new schema fields (like deletedAt / expireAt)
if (mongoose.models.Asset && !mongoose.models.Asset.schema.path('deletedAt')) {
  delete mongoose.models.Asset;
}

export const Asset: Model<IAsset> =
  mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
