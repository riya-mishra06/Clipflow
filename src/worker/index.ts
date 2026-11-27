import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  claimNextJob,
  completeJob,
  DEFAULT_LEASE_MS,
  failJob,
  heartbeatJob,
  isJobCancelling,
  markJobCancelledByWorker,
  recoverExpiredLeases,
  resolveBlockedDependencies,
  upsertWorkerHeartbeat,
  verifyJobLeaseOwnership,
} from '../lib/jobQueue.ts';
import {
  concatVideos,
  convertToVertical916,
  extractAudio,
  extractFrames,
  generateThumbnail,
  probeMedia,
  ProcessCancelledError,
  renderClipPipeline,
  renderSubtitles,
  sliceSrtForClip,
  splitVideo,
  transcribeAudio,
  trimVideo,
} from '../lib/mediaProcessor.ts';
import { Job, type IJob } from '../models/Job.ts';
import { Asset } from '../models/Asset.ts';
import { ClippingSession } from '../models/ClippingSession.ts';

function loadLocalEnv() {
  for (const file of ['.env.local', '.env']) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
      }
    }
  }
}

loadLocalEnv();

const WORKER_ID = `worker-${process.pid}-${crypto.randomUUID().slice(0, 8)}`;
const POLL_INTERVAL_MS = 1200;
const TEMP_RETENTION_MS = 60 * 60 * 1000;
let shuttingDown = false;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getMediaRoot(): string {
  return path.resolve(process.env.MEDIA_STORAGE_ROOT || path.join(process.cwd(), 'storage', 'media'));
}

function getTempRoot(): string {
  return path.resolve(process.env.MEDIA_TEMP_ROOT || path.join(process.cwd(), 'storage', 'temp'));
}

function resolveAssetPath(objectKey: string): string {
  const root = getMediaRoot();
  const normalized = objectKey.replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.resolve(root, normalized);
  if (!resolved.startsWith(root + path.sep)) {
    throw new Error('Invalid asset objectKey path');
  }
  return resolved;
}

async function getOwnedAssetPath(assetId: string, userId: string): Promise<{ asset: any; fullPath: string }> {
  if (!mongoose.Types.ObjectId.isValid(assetId)) {
    throw new Error('Invalid assetId');
  }
  const asset = await Asset.findOne({ _id: assetId, ownerId: userId });
  if (!asset || !asset.objectKey) {
    throw new Error('Source media asset not found or has no local file');
  }
  const fullPath = resolveAssetPath(asset.objectKey);
  if (!fs.existsSync(fullPath)) {
    throw new Error('Source media file missing on disk');
  }
  return { asset, fullPath };
}

async function publishDerivedAsset(params: {
  job: IJob;
  tempFilePath: string;
  name: string;
  category: 'video' | 'audio' | 'image' | 'document' | 'transcript';
  mimeType: string;
  ext: string;
  tags?: string[];
}): Promise<string> {
  // Fencing check: stale workers MUST NOT publish files or DB records
  const stillOwner = await verifyJobLeaseOwnership(
    params.job._id.toString(),
    WORKER_ID,
    params.job.claimVersion
  );
  if (!stillOwner) {
    throw new Error('Worker lease lost before publishing derived asset');
  }

  const ownerStr = params.job.userId.toString();
  const objectKey = `${ownerStr}/${crypto.randomUUID()}-${params.name.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 40)}${params.ext}`;
  const finalPath = resolveAssetPath(objectKey);
  await fsp.mkdir(path.dirname(finalPath), { recursive: true });
  await fsp.rename(params.tempFilePath, finalPath);

  const st = await fsp.stat(finalPath);
  const created = await Asset.create({
    ownerId: params.job.userId,
    name: params.name,
    kind: 'upload',
    category: params.category,
    mimeType: params.mimeType,
    sizeBytes: st.size,
    objectKey,
    attachedProjectIds: params.job.projectId ? [params.job.projectId] : [],
    status: 'ready',
    tags: params.tags || [],
    deletedAt: null,
    expireAt: null,
  });

  return created._id.toString();
}

async function processNoopTest(job: IJob, signal: AbortSignal): Promise<Record<string, unknown>> {
  const input = (job.input || {}) as { delayMs?: number; shouldFail?: boolean };
  const delayMs = Math.min(10_000, Math.max(50, Number(input.delayMs || 150)));

  await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 30, 'Running step 1/2');
  await sleep(delayMs);
  if (signal.aborted) throw new ProcessCancelledError();
  if (input.shouldFail) throw new Error('Simulated NOOP_TEST failure');

  await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 75, 'Running step 2/2');
  await sleep(delayMs);
  if (signal.aborted) throw new ProcessCancelledError();

  return { ok: true, workerId: WORKER_ID, completedAt: new Date().toISOString() };
}

async function processTempCleanup(job: IJob): Promise<Record<string, unknown>> {
  const activeCount = await Job.countDocuments({
    _id: { $ne: job._id },
    status: { $in: ['PROCESSING', 'CANCELLING'] },
  });
  if (activeCount > 0) {
    return { skipped: true, reason: 'Active processing jobs detected', removedCount: 0 };
  }

  const tempRoot = getTempRoot();
  if (!fs.existsSync(tempRoot)) return { skipped: false, removedCount: 0 };

  const cutoff = Date.now() - TEMP_RETENTION_MS;
  const entries = await fsp.readdir(tempRoot, { withFileTypes: true });
  let removedCount = 0;

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.tmp')) continue;
    const fullPath = path.join(tempRoot, entry.name);
    const st = await fsp.stat(fullPath);
    if (st.mtimeMs < cutoff) {
      await fsp.unlink(fullPath).catch(() => {});
      removedCount += 1;
    }
  }
  return { skipped: false, removedCount };
}

async function processMediaJob(job: IJob, signal: AbortSignal): Promise<Record<string, unknown>> {
  const userId = job.userId.toString();
  const input = (job.input || {}) as Record<string, any>;
  const tempRoot = getTempRoot();
  await fsp.mkdir(tempRoot, { recursive: true });
  const tempArtifacts: string[] = [];

  try {
    if (job.type === 'MEDIA_ANALYSIS') {
      const { fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 30, 'Inspecting media with FFprobe');
      const metadata = await probeMedia(fullPath, signal);
      return { metadata };
    }

    if (job.type === 'AUDIO_EXTRACTION') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.wav`);
      tempArtifacts.push(outTmp);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, 'Extracting 16kHz mono WAV audio');
      await extractAudio(fullPath, outTmp, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `${asset.name} (Audio).wav`,
        category: 'audio',
        mimeType: 'audio/wav',
        ext: '.wav',
      });
      return { outputAssetId };
    }

    if (job.type === 'VIDEO_TRIM') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.mp4`);
      tempArtifacts.push(outTmp);
      const startSec = Number(input.startSec ?? 0);
      const durationSec = Number(input.durationSec ?? 5);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, 'Trimming video');
      await trimVideo(fullPath, outTmp, startSec, durationSec, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `${asset.name} (Trimmed).mp4`,
        category: 'video',
        mimeType: 'video/mp4',
        ext: '.mp4',
      });
      return { outputAssetId, startSec, durationSec };
    }

    if (job.type === 'VIDEO_SPLIT') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outDir = path.join(tempRoot, `split-${crypto.randomUUID()}`);
      tempArtifacts.push(outDir);
      const segmentSec = Number(input.segmentSec ?? 15);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, 'Splitting video');
      const parts = await splitVideo(fullPath, outDir, segmentSec, signal);
      const outputAssetIds: string[] = [];
      for (let i = 0; i < parts.length; i++) {
        const id = await publishDerivedAsset({
          job,
          tempFilePath: parts[i],
          name: `${asset.name} (Part ${i + 1}).mp4`,
          category: 'video',
          mimeType: 'video/mp4',
          ext: '.mp4',
        });
        outputAssetIds.push(id);
      }
      return { outputAssetIds, partCount: outputAssetIds.length };
    }

    if (job.type === 'VIDEO_CONCAT') {
      const assetIds: string[] = Array.isArray(input.assetIds) ? input.assetIds.map(String) : [];
      const paths: string[] = [];
      for (const aid of assetIds) {
        const { fullPath } = await getOwnedAssetPath(aid, userId);
        paths.push(fullPath);
      }
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.mp4`);
      const listTmp = path.join(tempRoot, `${crypto.randomUUID()}.txt`);
      tempArtifacts.push(outTmp, listTmp);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, 'Concatenating videos');
      await concatVideos(paths, outTmp, listTmp, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `Concatenated_${Date.now()}.mp4`,
        category: 'video',
        mimeType: 'video/mp4',
        ext: '.mp4',
      });
      return { outputAssetId };
    }

    if (job.type === 'SMART_CROP') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.mp4`);
      tempArtifacts.push(outTmp);
      const cropOffsetRatio = Number(input.cropOffsetRatio ?? 0.5);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, 'Converting to 9:16 (1080x1920)');
      await convertToVertical916(fullPath, outTmp, cropOffsetRatio, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `${asset.name} (9x16).mp4`,
        category: 'video',
        mimeType: 'video/mp4',
        ext: '.mp4',
      });
      return { outputAssetId, resolution: '1080x1920' };
    }

    if (job.type === 'THUMBNAIL_GENERATION') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.jpg`);
      tempArtifacts.push(outTmp);
      const timestampSec = Number(input.timestampSec ?? 1);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 40, 'Generating thumbnail');
      await generateThumbnail(fullPath, outTmp, timestampSec, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `${asset.name} (Thumb).jpg`,
        category: 'image',
        mimeType: 'image/jpeg',
        ext: '.jpg',
      });
      return { outputAssetId };
    }

    if (job.type === 'FRAME_EXTRACTION') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const outDir = path.join(tempRoot, `frames-${crypto.randomUUID()}`);
      tempArtifacts.push(outDir);
      const fps = Number(input.fps ?? 1);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 30, 'Extracting frames');
      const frames = await extractFrames(fullPath, outDir, fps, signal);
      const outputAssetIds: string[] = [];
      for (let i = 0; i < frames.length; i++) {
        const id = await publishDerivedAsset({
          job,
          tempFilePath: frames[i],
          name: `${asset.name}_frame_${i + 1}.jpg`,
          category: 'image',
          mimeType: 'image/jpeg',
          ext: '.jpg',
        });
        outputAssetIds.push(id);
      }
      return { outputAssetIds, frameCount: outputAssetIds.length };
    }

    if (job.type === 'TRANSCRIPTION') {
      const sourceAssetId = String(input.assetId || '');
      let wavPath: string;
      let baseName: string;

      if (sourceAssetId) {
        const { asset, fullPath } = await getOwnedAssetPath(sourceAssetId, userId);
        wavPath = fullPath;
        baseName = asset.name;
      } else if (input.sourceVideoAssetId) {
        // Fallback: extract audio from sourceVideoAssetId if not passed directly
        const { asset, fullPath } = await getOwnedAssetPath(String(input.sourceVideoAssetId), userId);
        wavPath = path.join(tempRoot, `${crypto.randomUUID()}.wav`);
        tempArtifacts.push(wavPath);
        await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 15, 'Extracting audio for transcription');
        await extractAudio(fullPath, wavPath, signal);
        baseName = asset.name;
      } else {
        throw new Error('assetId or sourceVideoAssetId is required for TRANSCRIPTION');
      }

      const model = input.model === 'tiny' ? 'tiny' : 'base';
      const threads = Math.min(6, Math.max(1, Number(input.cpuThreads ?? 4)));
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 25, `Transcribing with faster-whisper (${model})`);
      const transcript = await transcribeAudio(wavPath, model, threads, signal);

      const srtTmp = path.join(tempRoot, `${crypto.randomUUID()}.srt`);
      const vttTmp = path.join(tempRoot, `${crypto.randomUUID()}.vtt`);
      tempArtifacts.push(srtTmp, vttTmp);
      await fsp.writeFile(srtTmp, transcript.srt, 'utf8');
      await fsp.writeFile(vttTmp, transcript.vtt, 'utf8');

      const srtAssetId = await publishDerivedAsset({
        job,
        tempFilePath: srtTmp,
        name: `${baseName}.srt`,
        category: 'transcript',
        mimeType: 'application/x-subrip',
        ext: '.srt',
      });
      const vttAssetId = await publishDerivedAsset({
        job,
        tempFilePath: vttTmp,
        name: `${baseName}.vtt`,
        category: 'transcript',
        mimeType: 'text/vtt',
        ext: '.vtt',
      });

      if (input.clippingSessionId && mongoose.Types.ObjectId.isValid(String(input.clippingSessionId))) {
        await ClippingSession.updateOne(
          { _id: input.clippingSessionId, ownerId: job.userId },
          {
            $set: {
              transcript: {
                modelUsed: transcript.modelUsed,
                language: transcript.language,
                text: transcript.text,
                segments: transcript.segments,
                srtAssetId,
                vttAssetId,
              },
            },
          }
        );
      }

      return {
        modelUsed: transcript.modelUsed,
        language: transcript.language,
        duration: transcript.duration,
        elapsedSec: transcript.elapsedSec,
        pythonTracedPeakMb: transcript.pythonTracedPeakMb,
        processRssMb: transcript.processRssMb,
        processPeakRssMb: transcript.processPeakRssMb,
        text: transcript.text,
        segmentsCount: transcript.segments.length,
        wordsCount: transcript.words.length,
        srtAssetId,
        vttAssetId,
      };
    }

    if (job.type === 'CLIP_PIPELINE') {
      const sessionId = String(input.clippingSessionId || '');
      const clipId = String(input.clipId || '');
      const { asset, fullPath } = await getOwnedAssetPath(String(input.sourceAssetId || ''), userId);

      const startSec = Number(input.startSec ?? 0);
      const endSec = Number(input.endSec ?? startSec + 5);
      const durationSec = Math.max(0.5, endSec - startSec);
      const cropOffsetRatio = Number(input.cropOffsetRatio ?? 0.5);
      const clipTitle = String(input.clipTitle || `${asset.name} Clip`);

      if (sessionId && clipId && mongoose.Types.ObjectId.isValid(sessionId)) {
        await ClippingSession.updateOne(
          { _id: sessionId, ownerId: job.userId, 'clips.id': clipId },
          { $set: { 'clips.$.status': 'processing', 'clips.$.error': '' } }
        );
      }

      let slicedSrtPath: string | null = null;
      if (input.subtitleStyle?.enabled && input.srtAssetId) {
        try {
          const { fullPath: fullSrtPath } = await getOwnedAssetPath(String(input.srtAssetId), userId);
          const fullSrtText = await fsp.readFile(fullSrtPath, 'utf8');
          const sliced = sliceSrtForClip(fullSrtText, startSec, endSec);
          if (sliced.trim()) {
            slicedSrtPath = path.join(tempRoot, `${crypto.randomUUID()}.srt`);
            tempArtifacts.push(slicedSrtPath);
            await fsp.writeFile(slicedSrtPath, sliced, 'utf8');
          }
        } catch {}
      }

      let logoPath: string | null = null;
      if (input.logoAssetId) {
        try {
          const logo = await getOwnedAssetPath(String(input.logoAssetId), userId);
          logoPath = logo.fullPath;
        } catch {}
      }

      const outMp4 = path.join(tempRoot, `${crypto.randomUUID()}.mp4`);
      const outThumb = path.join(tempRoot, `${crypto.randomUUID()}.jpg`);
      tempArtifacts.push(outMp4, outThumb);

      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 35, `Rendering 9:16 clip (${clipTitle})`);
      await renderClipPipeline({
        inputPath: fullPath,
        outputPath: outMp4,
        startSec,
        durationSec,
        cropOffsetRatio,
        srtPath: slicedSrtPath,
        subtitleStyle: input.subtitleStyle,
        brandText: input.brandText ? String(input.brandText) : undefined,
        logoPath,
        signal,
      });

      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 80, 'Generating clip cover thumbnail');
      await generateThumbnail(outMp4, outThumb, Math.min(1, durationSec / 2), signal);

      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outMp4,
        name: `${clipTitle}.mp4`,
        category: 'video',
        mimeType: 'video/mp4',
        ext: '.mp4',
      });
      const thumbnailAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outThumb,
        name: `${clipTitle} (Cover).jpg`,
        category: 'image',
        mimeType: 'image/jpeg',
        ext: '.jpg',
        tags: ['generated-thumbnail', 'clip-cover'],
      });

      if (sessionId && clipId && mongoose.Types.ObjectId.isValid(sessionId)) {
        await ClippingSession.updateOne(
          { _id: sessionId, ownerId: job.userId, 'clips.id': clipId },
          {
            $set: {
              'clips.$.status': 'ready',
              'clips.$.outputAssetId': outputAssetId,
              'clips.$.thumbnailAssetId': thumbnailAssetId,
              'clips.$.error': '',
            },
          }
        );
      }

      return { outputAssetId, thumbnailAssetId, clipId, durationSec, resolution: '1080x1920' };
    }

    if (job.type === 'SUBTITLE_RENDER') {
      const { asset, fullPath } = await getOwnedAssetPath(String(input.assetId || ''), userId);
      const { fullPath: srtPath } = await getOwnedAssetPath(String(input.srtAssetId || ''), userId);
      const outTmp = path.join(tempRoot, `${crypto.randomUUID()}.mp4`);
      tempArtifacts.push(outTmp);
      await heartbeatJob(job._id.toString(), WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS, 30, 'Rendering burned-in subtitles');
      await renderSubtitles(fullPath, srtPath, outTmp, signal);
      const outputAssetId = await publishDerivedAsset({
        job,
        tempFilePath: outTmp,
        name: `${asset.name} (Subtitled).mp4`,
        category: 'video',
        mimeType: 'video/mp4',
        ext: '.mp4',
      });
      return { outputAssetId };
    }

    throw new Error(`Unsupported job type: ${job.type}`);
  } finally {
    for (const p of tempArtifacts) {
      await fsp.rm(p, { recursive: true, force: true }).catch(() => {});
    }
  }
}

async function runSingleJob(job: IJob) {
  const jobId = job._id.toString();
  const abortController = new AbortController();

  // Cooperative cancellation + periodic lease heartbeat
  const monitor = setInterval(async () => {
    try {
      if (await isJobCancelling(jobId)) {
        abortController.abort();
        return;
      }
      await heartbeatJob(jobId, WORKER_ID, job.claimVersion, DEFAULT_LEASE_MS);
      await upsertWorkerHeartbeat(WORKER_ID, 'busy', jobId);
    } catch {}
  }, 1000);

  try {
    await upsertWorkerHeartbeat(WORKER_ID, 'busy', jobId);
    let output: Record<string, unknown>;
    if (job.type === 'NOOP_TEST') {
      output = await processNoopTest(job, abortController.signal);
    } else if (job.type === 'TEMP_FILE_CLEANUP') {
      output = await processTempCleanup(job);
    } else {
      output = await processMediaJob(job, abortController.signal);
    }

    await completeJob(jobId, WORKER_ID, job.claimVersion, output);
  } catch (err: any) {
    if (err instanceof ProcessCancelledError || abortController.signal.aborted || (await isJobCancelling(jobId))) {
      await markJobCancelledByWorker(jobId, WORKER_ID, job.claimVersion);
    } else {
      await failJob(jobId, WORKER_ID, job.claimVersion, err?.message || 'Worker execution error');
    }
  } finally {
    clearInterval(monitor);
    await upsertWorkerHeartbeat(WORKER_ID, 'idle', null).catch(() => {});
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required for background worker');
  }

  await mongoose.connect(mongoUri, { bufferCommands: false });
  await upsertWorkerHeartbeat(WORKER_ID, 'idle', null);
  console.log(`[${WORKER_ID}] Connected to MongoDB. Polling jobs...`);

  process.on('SIGINT', () => { shuttingDown = true; });
  process.on('SIGTERM', () => { shuttingDown = true; });

  while (!shuttingDown) {
    try {
      await recoverExpiredLeases();
      await resolveBlockedDependencies();
      await upsertWorkerHeartbeat(WORKER_ID, 'idle', null);

      const job = await claimNextJob(WORKER_ID, DEFAULT_LEASE_MS);
      if (job) {
        await runSingleJob(job);
        continue;
      }
    } catch (err) {
      console.error(`[${WORKER_ID}] Loop error:`, err);
    }
    await sleep(POLL_INTERVAL_MS);
  }

  await upsertWorkerHeartbeat(WORKER_ID, 'stopped', null).catch(() => {});
  await mongoose.disconnect();
  console.log(`[${WORKER_ID}] Shutdown complete.`);
}

main().catch((err) => {
  console.error(`[${WORKER_ID}] Fatal worker error:`, err);
  process.exit(1);
});
