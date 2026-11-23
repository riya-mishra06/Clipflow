import mongoose, { Schema, Document, Model } from 'mongoose';

export type SocialPlatform = 'instagram' | 'youtube' | 'tiktok';
export type AccountCategory = 'clipping' | 'ugc' | 'brand' | 'personal';

export interface ISocialAccount extends Document {
  ownerId: mongoose.Types.ObjectId;
  platform: SocialPlatform;
  category: AccountCategory;
  accountName: string;
  channelOrPageId?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  status: 'connected' | 'expired' | 'revoked';
  settings: {
    autoPublishEnabled: boolean;
    defaultHashtags?: string[];
    scheduleDelayMinutes?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SocialAccountSchema = new Schema<ISocialAccount>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, enum: ['instagram', 'youtube', 'tiktok'], required: true },
    category: { type: String, enum: ['clipping', 'ugc', 'brand', 'personal'], default: 'clipping' },
    accountName: { type: String, required: true },
    channelOrPageId: { type: String },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    tokenExpiresAt: { type: Date },
    status: { type: String, enum: ['connected', 'expired', 'revoked'], default: 'connected' },
    settings: {
      autoPublishEnabled: { type: Boolean, default: false },
      defaultHashtags: [{ type: String }],
      scheduleDelayMinutes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const SocialAccount: Model<ISocialAccount> =
  mongoose.models.SocialAccount || mongoose.model<ISocialAccount>('SocialAccount', SocialAccountSchema);
