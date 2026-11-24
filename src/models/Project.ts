import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectKind = 'campaign' | 'practice' | 'original';
export type ProjectStatus = 'planned' | 'active' | 'in_review' | 'completed' | 'archived';

export interface IProject extends Document {
  title: string;
  kind: ProjectKind;
  status: ProjectStatus;
  campaignId?: mongoose.Types.ObjectId;
  campaignTitle?: string;
  ownerId: mongoose.Types.ObjectId;
  brief?: string;
  targetPlatform: string;
  aspectRatio: string;
  targetDuration?: string;
  resolution?: string;
  conceptHook?: string;
  estPayout?: string;
  deadlineDays?: number;
  deadlineDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    kind: { type: String, enum: ['campaign', 'practice', 'original'], default: 'campaign' },
    status: {
      type: String,
      enum: ['planned', 'active', 'in_review', 'completed', 'archived'],
      default: 'active',
    },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    campaignTitle: { type: String, default: 'Custom Direct Cut' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    brief: { type: String, default: '' },
    targetPlatform: { type: String, default: 'Instagram Reels & TikTok' },
    aspectRatio: { type: String, default: '9:16 Vertical' },
    targetDuration: { type: String, default: '45 seconds' },
    resolution: { type: String, default: '1080x1920 (60fps)' },
    conceptHook: { type: String, default: '' },
    estPayout: { type: String, default: '$140.00' },
    deadlineDays: { type: Number, default: 7 },
    deadlineDate: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.index({ ownerId: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
