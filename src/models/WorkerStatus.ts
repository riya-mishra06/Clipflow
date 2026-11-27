import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkerStatus extends Document {
  workerId: string;
  hostname: string;
  pid: number;
  status: 'idle' | 'busy' | 'stopped';
  activeJobId?: mongoose.Types.ObjectId | null;
  lastSeenAt: Date;
  freeRamMb: number;
  totalRamMb: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkerStatusSchema = new Schema<IWorkerStatus>(
  {
    workerId: { type: String, required: true, unique: true },
    hostname: { type: String, default: 'localhost' },
    pid: { type: Number, required: true },
    status: { type: String, enum: ['idle', 'busy', 'stopped'], default: 'idle' },
    activeJobId: { type: Schema.Types.ObjectId, ref: 'Job', default: null },
    lastSeenAt: { type: Date, default: () => new Date() },
    freeRamMb: { type: Number, default: 0 },
    totalRamMb: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WorkerStatusSchema.index({ lastSeenAt: -1 });

export const WorkerStatus: Model<IWorkerStatus> =
  mongoose.models.WorkerStatus ||
  mongoose.model<IWorkerStatus>('WorkerStatus', WorkerStatusSchema);
