import crypto from 'crypto';
import os from 'os';
import mongoose from 'mongoose';
import { Job, HEAVY_MEDIA_JOB_TYPES, type IJob, type JobType } from '../models/Job.ts';
import { WorkerStatus } from '../models/WorkerStatus.ts';

export const DEFAULT_LEASE_MS = 60_000;

export class IdempotencyConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IdempotencyConflictError';
  }
}

export function computeInputHash(payload: {
  type: JobType;
  projectId?: string | null;
  dependencies?: string[];
  input?: Record<string, unknown>;
}): string {
  const canonical = JSON.stringify({
    type: payload.type,
    projectId: payload.projectId || null,
    dependencies: payload.dependencies || [],
    input: payload.input || {},
  });
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

export interface EnqueueJobParams {
  userId: string;
  type: JobType;
  projectId?: string | null;
  dependencies?: string[];
  priority?: number;
  maxAttempts?: number;
  input?: Record<string, unknown>;
  idempotencyKey?: string;
  scheduledAt?: Date | null;
}

export async function enqueueJob(
  params: EnqueueJobParams
): Promise<{ job: IJob; deduplicated: boolean }> {
  const cleanKey = params.idempotencyKey?.trim() || undefined;
  const validDeps = (params.dependencies || []).filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  // Verify dependency ownership if dependencies are provided
  if (validDeps.length > 0) {
    const ownedCount = await Job.countDocuments({
      _id: { $in: validDeps },
      userId: params.userId,
    });
    if (ownedCount !== validDeps.length) {
      throw new Error('One or more dependency jobs were not found or unauthorized.');
    }
  }

  const inputHash = computeInputHash({
    type: params.type,
    projectId: params.projectId,
    dependencies: validDeps,
    input: params.input,
  });

  if (cleanKey) {
    const existing = await Job.findOne({
      userId: params.userId,
      idempotencyKey: cleanKey,
    });
    if (existing) {
      if (existing.inputHash !== inputHash) {
        throw new IdempotencyConflictError(
          'Idempotency key already used with a different job payload.'
        );
      }
      return { job: existing, deduplicated: true };
    }
  }

  const now = new Date();
  const nextRunAt = params.scheduledAt && params.scheduledAt > now ? params.scheduledAt : now;

  try {
    const job = await Job.create({
      userId: params.userId,
      projectId:
        params.projectId && mongoose.Types.ObjectId.isValid(params.projectId)
          ? params.projectId
          : null,
      dependencies: validDeps,
      type: params.type,
      status: params.scheduledAt && params.scheduledAt > now ? 'SCHEDULED' : 'QUEUED',
      priority: params.priority ?? 3,
      maxAttempts: params.maxAttempts ?? 3,
      input: params.input ?? {},
      inputHash,
      idempotencyKey: cleanKey,
      scheduledAt: params.scheduledAt ?? null,
      nextRunAt,
      currentStage: validDeps.length > 0 ? 'Waiting on dependencies' : 'Queued',
    });
    return { job, deduplicated: false };
  } catch (err: any) {
    if (err?.code === 11000 && cleanKey) {
      const existing = await Job.findOne({
        userId: params.userId,
        idempotencyKey: cleanKey,
      });
      if (existing) {
        if (existing.inputHash !== inputHash) {
          throw new IdempotencyConflictError(
            'Idempotency key already used with a different job payload.'
          );
        }
        return { job: existing, deduplicated: true };
      }
    }
    throw err;
  }
}

/**
 * Marks queued jobs as FAILED/CANCELLED if any of their parent dependencies failed or were cancelled.
 */
export async function resolveBlockedDependencies(): Promise<number> {
  const waiting = await Job.find({
    status: { $in: ['QUEUED', 'RETRY_SCHEDULED', 'SCHEDULED'] },
    dependencies: { $exists: true, $ne: [] },
  }).limit(50);

  let updatedCount = 0;
  for (const job of waiting) {
    const parents = await Job.find({ _id: { $in: job.dependencies } }).select('status');
    const failedParent = parents.find((p) => p.status === 'FAILED');
    const cancelledParent = parents.find((p) => p.status === 'CANCELLED');

    if (failedParent || cancelledParent) {
      const targetStatus = failedParent ? 'FAILED' : 'CANCELLED';
      await Job.updateOne(
        { _id: job._id, status: job.status },
        {
          $set: {
            status: targetStatus,
            currentStage: failedParent
              ? 'Blocked: parent dependency failed'
              : 'Cancelled: parent dependency cancelled',
            error: failedParent
              ? { message: 'Parent dependency job failed', code: 'DEPENDENCY_FAILED' }
              : null,
          },
        }
      );
      updatedCount += 1;
    }
  }
  return updatedCount;
}

/**
 * Checks whether all dependency IDs of a job have COMPLETED.
 */
async function areDependenciesCompleted(deps: mongoose.Types.ObjectId[]): Promise<boolean> {
  if (!deps || deps.length === 0) return true;
  const completedCount = await Job.countDocuments({
    _id: { $in: deps },
    status: 'COMPLETED',
  });
  return completedCount === deps.length;
}

/**
 * Atomically claims the next eligible job, enforcing:
 * 1. Global heavy-media concurrency = 1 across all workers.
 * 2. Dependency completion check before claiming child jobs.
 * 3. Atomic findOneAndUpdate + claimVersion fencing.
 */
export async function claimNextJob(
  workerId: string,
  leaseMs: number = DEFAULT_LEASE_MS
): Promise<IJob | null> {
  const now = new Date();
  const leaseExpiresAt = new Date(now.getTime() + leaseMs);

  const activeHeavyCount = await Job.countDocuments({
    status: { $in: ['PROCESSING', 'CANCELLING'] },
    type: { $in: HEAVY_MEDIA_JOB_TYPES },
  });

  const baseFilter: Record<string, unknown> = {
    status: { $in: ['QUEUED', 'RETRY_SCHEDULED', 'SCHEDULED'] },
    nextRunAt: { $lte: now },
    approvalStatus: { $in: ['NOT_REQUIRED', 'APPROVED'] },
  };
  if (activeHeavyCount > 0) {
    baseFilter.type = { $nin: HEAVY_MEDIA_JOB_TYPES };
  }

  const candidates = await Job.find(baseFilter)
    .sort({ priority: -1, createdAt: 1 })
    .limit(10);

  for (const candidate of candidates) {
    const ready = await areDependenciesCompleted(candidate.dependencies);
    if (!ready) continue;

    // Re-check heavy concurrency right inside atomic filter for safety
    if (HEAVY_MEDIA_JOB_TYPES.includes(candidate.type)) {
      const heavyRunning = await Job.countDocuments({
        status: { $in: ['PROCESSING', 'CANCELLING'] },
        type: { $in: HEAVY_MEDIA_JOB_TYPES },
      });
      if (heavyRunning > 0) continue;
    }

    const claimed = await Job.findOneAndUpdate(
      {
        _id: candidate._id,
        status: { $in: ['QUEUED', 'RETRY_SCHEDULED', 'SCHEDULED'] },
        claimVersion: candidate.claimVersion,
      },
      {
        $set: {
          status: 'PROCESSING',
          workerId,
          leaseExpiresAt,
          lastHeartbeatAt: now,
          startedAt: candidate.startedAt || now,
          currentStage: 'Claimed by worker',
        },
        $inc: {
          claimVersion: 1,
          attempts: 1,
        },
      },
      { new: true }
    );

    if (claimed) return claimed;
  }

  return null;
}

export async function isJobCancelling(jobId: string): Promise<boolean> {
  const doc = await Job.findById(jobId).select('status');
  return doc?.status === 'CANCELLING' || doc?.status === 'CANCELLED';
}

export async function markJobCancelledByWorker(
  jobId: string,
  workerId: string,
  claimVersion: number
): Promise<boolean> {
  const res = await Job.findOneAndUpdate(
    {
      _id: jobId,
      workerId,
      claimVersion,
      status: { $in: ['PROCESSING', 'CANCELLING'] },
    },
    {
      $set: {
        status: 'CANCELLED',
        currentStage: 'Cancelled cooperatively by worker',
        leaseExpiresAt: null,
      },
    },
    { new: true }
  );
  return Boolean(res);
}

/**
 * Extends lease and updates progress ONLY if workerId + claimVersion still match.
 */
export async function heartbeatJob(
  jobId: string,
  workerId: string,
  claimVersion: number,
  leaseMs: number = DEFAULT_LEASE_MS,
  progress?: number,
  currentStage?: string
): Promise<boolean> {
  const now = new Date();
  const update: Record<string, unknown> = {
    lastHeartbeatAt: now,
    leaseExpiresAt: new Date(now.getTime() + leaseMs),
  };
  if (typeof progress === 'number') update.progress = Math.max(0, Math.min(100, progress));
  if (currentStage) update.currentStage = currentStage;

  const res = await Job.findOneAndUpdate(
    {
      _id: jobId,
      workerId,
      claimVersion,
      status: 'PROCESSING',
    },
    { $set: update },
    { new: true }
  );
  return Boolean(res);
}

/**
 * Checks if worker still owns the job before publishing external files/assets.
 */
export async function verifyJobLeaseOwnership(
  jobId: string,
  workerId: string,
  claimVersion: number
): Promise<boolean> {
  const count = await Job.countDocuments({
    _id: jobId,
    workerId,
    claimVersion,
    status: 'PROCESSING',
  });
  return count === 1;
}

export async function completeJob(
  jobId: string,
  workerId: string,
  claimVersion: number,
  output: Record<string, unknown>
): Promise<boolean> {
  const res = await Job.findOneAndUpdate(
    {
      _id: jobId,
      workerId,
      claimVersion,
      status: 'PROCESSING',
    },
    {
      $set: {
        status: 'COMPLETED',
        progress: 100,
        currentStage: 'Completed',
        output,
        completedAt: new Date(),
        leaseExpiresAt: null,
      },
    },
    { new: true }
  );
  return Boolean(res);
}

export async function failJob(
  jobId: string,
  workerId: string,
  claimVersion: number,
  errorMessage: string
): Promise<boolean> {
  const job = await Job.findOne({ _id: jobId, workerId, claimVersion, status: 'PROCESSING' });
  if (!job) return false;

  const canRetry = job.attempts < job.maxAttempts;
  const backoffMs = Math.min(60_000, 1_000 * Math.pow(2, job.attempts));
  const nextStatus = canRetry ? 'RETRY_SCHEDULED' : 'FAILED';

  const res = await Job.findOneAndUpdate(
    { _id: jobId, workerId, claimVersion, status: 'PROCESSING' },
    {
      $set: {
        status: nextStatus,
        currentStage: canRetry ? 'Retry scheduled' : 'Failed',
        nextRunAt: canRetry ? new Date(Date.now() + backoffMs) : job.nextRunAt,
        leaseExpiresAt: null,
        error: { message: errorMessage },
      },
    },
    { new: true }
  );
  return Boolean(res);
}

export async function recoverExpiredLeases(): Promise<{ requeued: number; failed: number }> {
  const now = new Date();
  const expired = await Job.find({
    status: { $in: ['PROCESSING', 'CANCELLING'] },
    leaseExpiresAt: { $lt: now },
  }).limit(50);

  let requeued = 0;
  let failed = 0;

  for (const job of expired) {
    if (job.status === 'CANCELLING') {
      await Job.updateOne(
        { _id: job._id, claimVersion: job.claimVersion, status: 'CANCELLING' },
        {
          $set: {
            status: 'CANCELLED',
            currentStage: 'Cancelled after lease expiry',
            leaseExpiresAt: null,
            workerId: null,
          },
        }
      );
      continue;
    }

    const canRetry = job.attempts < job.maxAttempts;
    const updated = await Job.findOneAndUpdate(
      { _id: job._id, claimVersion: job.claimVersion, status: 'PROCESSING' },
      {
        $set: {
          status: canRetry ? 'RETRY_SCHEDULED' : 'FAILED',
          currentStage: canRetry ? 'Recovered after lease expiry' : 'Failed (lease expired)',
          nextRunAt: now,
          leaseExpiresAt: null,
          workerId: null,
          error: { message: 'Worker lease expired before completion' },
        },
      },
      { new: true }
    );
    if (updated) {
      if (canRetry) requeued += 1;
      else failed += 1;
    }
  }

  return { requeued, failed };
}

export async function upsertWorkerHeartbeat(
  workerId: string,
  status: 'idle' | 'busy' | 'stopped',
  activeJobId?: string | null
) {
  await WorkerStatus.findOneAndUpdate(
    { workerId },
    {
      $set: {
        workerId,
        hostname: os.hostname(),
        pid: process.pid,
        status,
        activeJobId: activeJobId ? new mongoose.Types.ObjectId(activeJobId) : null,
        lastSeenAt: new Date(),
        freeRamMb: Math.round(os.freemem() / (1024 * 1024)),
        totalRamMb: Math.round(os.totalmem() / (1024 * 1024)),
      },
    },
    { upsert: true, new: true }
  );
}
