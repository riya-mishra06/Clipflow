import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  handle?: string;
  bio?: string;
  payoutDestination?: string;
  role: 'creator' | 'admin';
  timeZone: string;
  notifications?: {
    bountyApproved: boolean;
    deadlineAlert: boolean;
  };
  savedCampaignIds?: mongoose.Types.ObjectId[];
  resetCode?: string | null;
  resetCodeExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    handle: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    payoutDestination: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['creator', 'admin'],
      default: 'creator',
    },
    timeZone: {
      type: String,
      default: 'UTC',
    },
    notifications: {
      bountyApproved: { type: Boolean, default: true },
      deadlineAlert: { type: Boolean, default: true },
    },
    savedCampaignIds: [{ type: Schema.Types.ObjectId, ref: 'Campaign' }],
    resetCode: { type: String, default: null },
    resetCodeExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

if (
  mongoose.models.User &&
  (!mongoose.models.User.schema.path('handle') ||
    !mongoose.models.User.schema.path('savedCampaignIds') ||
    !mongoose.models.User.schema.path('resetCode'))
) {
  delete mongoose.models.User;
}

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
