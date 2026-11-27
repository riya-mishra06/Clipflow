import mongoose, { Schema, Document } from 'mongoose';

export interface IRevokedToken extends Document {
  tokenHash: string;
  expiresAt: Date;
}

const RevokedTokenSchema = new Schema<IRevokedToken>({
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const RevokedToken =
  (mongoose.models.RevokedToken as mongoose.Model<IRevokedToken>) ||
  mongoose.model<IRevokedToken>('RevokedToken', RevokedTokenSchema);
