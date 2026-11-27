import mongoose, { Schema, Document } from 'mongoose';

export interface IAIBudget extends Document {
  userId: mongoose.Types.ObjectId;
  periodKey: string;
  monthlyLimitUsd: number;
  reservedUsd: number;
  spentUsd: number;
  createdAt: Date;
  updatedAt: Date;
}

const AIBudgetSchema = new Schema<IAIBudget>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    periodKey: { type: String, required: true },
    monthlyLimitUsd: { type: Number, required: true, default: 0, min: 0 },
    reservedUsd: { type: Number, required: true, default: 0, min: 0 },
    spentUsd: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

AIBudgetSchema.index({ userId: 1, periodKey: 1 }, { unique: true });

export const AIBudget =
  (mongoose.models.AIBudget as mongoose.Model<IAIBudget>) ||
  mongoose.model<IAIBudget>('AIBudget', AIBudgetSchema);
