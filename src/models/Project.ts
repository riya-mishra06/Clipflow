import mongoose, { Schema, Document, Model } from 'mongoose';

export type ProjectKind = 'campaign' | 'practice' | 'original';
export type ProjectStatus = 'planned' | 'active' | 'in_review' | 'completed' | 'archived';

export interface IProjectTask {
  id: string;
  label: string;
  category: string;
  completed: boolean;
}

export interface IProjectDraft {
  id: string;
  version: string;
  filename: string;
  videoUrl: string;
  notes?: string;
  status: 'Ready' | 'In Review' | 'Approved';
  createdAt: string;
}

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
  scriptNotes?: string;
  tasks?: IProjectTask[];
  drafts?: IProjectDraft[];
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
    scriptNotes: { type: String, default: '' },
    tasks: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        category: { type: String, default: 'Custom' },
        completed: { type: Boolean, default: false },
      },
    ],
    drafts: [
      {
        id: { type: String, required: true },
        version: { type: String, required: true },
        filename: { type: String, required: true },
        videoUrl: { type: String, default: '' },
        notes: { type: String, default: '' },
        status: { type: String, enum: ['Ready', 'In Review', 'Approved'], default: 'Ready' },
        createdAt: { type: String, required: true },
      },
    ],
    estPayout: { type: String, default: '$140.00' },
    deadlineDays: { type: Number, default: 7 },
    deadlineDate: { type: String },
  },
  { timestamps: true }
);

ProjectSchema.index({ ownerId: 1, status: 1 });
ProjectSchema.index({ createdAt: -1 });

if (
  mongoose.models.Project &&
  (!mongoose.models.Project.schema.path('tasks') ||
    !mongoose.models.Project.schema.path('drafts'))
) {
  delete mongoose.models.Project;
}

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
