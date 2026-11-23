import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectKind = 'campaign' | 'practice' | 'original';
export type ProjectStatus = 'planned' | 'active' | 'completed' | 'archived';

export interface IProject extends Document {
  title: string;
  kind: ProjectKind;
  status: ProjectStatus;
  campaignId?: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  brief?: string;
  campaignSnapshot?: Record<string, any>;
  contentPlan?: {
    concept?: string;
    hook?: string;
    script?: string;
    targetPlatform?: string;
    targetDurationMs?: number;
    checklist?: Array<{ label: string; completed: boolean }>;
  };
  deadlineDate?: Date;
  deadlineAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    kind: { type: String, enum: ['campaign', 'practice', 'original'], default: 'campaign' },
    status: { type: String, enum: ['planned', 'active', 'completed', 'archived'], default: 'planned' },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    brief: { type: String },
    campaignSnapshot: { type: Schema.Types.Mixed },
    contentPlan: {
      concept: { type: String },
      hook: { type: String },
      script: { type: String },
      targetPlatform: { type: String },
      targetDurationMs: { type: Number },
      checklist: [{ label: String, completed: { type: Boolean, default: false } }],
    },
    deadlineDate: { type: Date },
    deadlineAt: { type: Date },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
