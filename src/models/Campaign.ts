import mongoose, { Schema, Document, Model } from 'mongoose';

export type Availability = 'unknown' | 'open' | 'closed';

export interface ICampaign extends Document {
  title: string;
  brief?: string;
  source?: string;
  externalId?: string;
  sourceUrl?: string;
  canonicalUrl?: string;
  eligibility?: string;
  requirements?: string;
  payoutTerms?: string;
  availability: Availability;
  deadlineDate?: Date;
  deadlineAt?: Date;
  deadlineTimeZone?: string;
  ownerId?: string; // null for public discovered campaigns
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true },
    brief: { type: String },
    source: { type: String, default: 'Manual' },
    externalId: { type: String },
    sourceUrl: { type: String },
    canonicalUrl: { type: String },
    eligibility: { type: String },
    requirements: { type: String },
    payoutTerms: { type: String },
    availability: { type: String, enum: ['unknown', 'open', 'closed'], default: 'unknown' },
    deadlineDate: { type: Date },
    deadlineAt: { type: Date },
    deadlineTimeZone: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
