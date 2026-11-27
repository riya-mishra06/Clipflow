import mongoose, { Schema, Document } from 'mongoose';

export interface IPromptTemplate extends Document {
  key: string;
  version: string;
  taskType: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchemaName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromptTemplateSchema = new Schema<IPromptTemplate>(
  {
    key: { type: String, required: true, trim: true },
    version: { type: String, required: true, default: '1.0.0' },
    taskType: { type: String, required: true, trim: true },
    systemPrompt: { type: String, required: true },
    userPromptTemplate: { type: String, required: true },
    outputSchemaName: { type: String, required: true, default: 'GenericAIResponse' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PromptTemplateSchema.index({ key: 1, version: 1 }, { unique: true });

export const PromptTemplate =
  (mongoose.models.PromptTemplate as mongoose.Model<IPromptTemplate>) ||
  mongoose.model<IPromptTemplate>('PromptTemplate', PromptTemplateSchema);
