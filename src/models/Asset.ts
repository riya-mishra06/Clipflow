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
  attachedProjectIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    kind: { type: String, enum: ['upload', 'link'], required: true },
    category: {
      type: String,
      enum: ['video', 'audio', 'image', 'document', 'transcript', 'other'],
      default: 'video',
    },
    mimeType: { type: String },
    sizeBytes: { type: Number },
    durationMs: { type: Number },
    externalUrl: { type: String },
    objectKey: { type: String },
    status: { type: String, enum: ['pending', 'ready', 'failed'], default: 'ready' },
    attachedProjectIds: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

export const Asset: Model<IAsset> =
  mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
