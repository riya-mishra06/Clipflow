import mongoose, { Schema, Document, Model } from 'mongoose';

export type Availability = 'open' | 'closed' | 'paused';

export interface ICampaign extends Document {
  title: string;
  brand: string;
  category: string;
  source: string;
  payoutModel: 'Fixed Per Clip' | 'CPM Views' | 'Hybrid Base + Bonus';
  baseRate: number; // e.g. 140
  ratePer1kViews?: number; // e.g. 4.5
  estPool?: string;
  aspectRatio: string; // e.g. '9:16'
  difficulty: string; // 'Beginner' | 'Intermediate' | 'Advanced'
  brief?: string;
  tags: string[];
  rules: string[];
  availability: Availability;
  deadlineDays?: number;
  deadlineDate?: string;
  spotsRemaining?: number;
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: 'Tech & AI' },
    source: { type: String, default: 'Manual' },
    payoutModel: {
      type: String,
      enum: ['Fixed Per Clip', 'CPM Views', 'Hybrid Base + Bonus'],
      default: 'Fixed Per Clip',
    },
    baseRate: { type: Number, required: true, min: 0 },
    ratePer1kViews: { type: Number, default: 0, min: 0 },
    estPool: { type: String, default: '$5,000 Pool' },
    aspectRatio: { type: String, default: '9:16' },
    difficulty: { type: String, default: 'Intermediate' },
    brief: { type: String, default: '' },
    tags: [{ type: String }],
    rules: [{ type: String }],
    availability: {
      type: String,
      enum: ['open', 'closed', 'paused'],
      default: 'open',
    },
    deadlineDays: { type: Number, default: 7 },
    deadlineDate: { type: String },
    spotsRemaining: { type: Number, default: 10 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Compound indexes for scalable search & filtering in MongoDB Atlas
CampaignSchema.index({ availability: 1, category: 1 });
CampaignSchema.index({ createdAt: -1 });
CampaignSchema.index({ brand: 1 });

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
