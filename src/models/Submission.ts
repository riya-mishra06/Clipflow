import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubmissionStatus = 'pending_review' | 'approved' | 'changes_requested';

export interface ISubmission extends Document {
  ownerId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  projectTitle: string;
  campaignId?: mongoose.Types.ObjectId;
  campaignTitle: string;
  videoUrl: string;
  cutVersion: string;
  notes?: string;
  status: SubmissionStatus;
  payoutAmount: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    projectTitle: { type: String, required: true, trim: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    campaignTitle: { type: String, default: 'Direct Brand Submission', trim: true },
    videoUrl: { type: String, required: true, trim: true },
    cutVersion: { type: String, default: 'v1.0', trim: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'changes_requested'],
      default: 'pending_review',
    },
    payoutAmount: { type: String, default: '$140.00' },
  },
  { timestamps: true }
);

SubmissionSchema.index({ ownerId: 1, status: 1 });
SubmissionSchema.index({ createdAt: -1 });

if (mongoose.models.Submission && !mongoose.models.Submission.schema.path('videoUrl')) {
  delete mongoose.models.Submission;
}

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
