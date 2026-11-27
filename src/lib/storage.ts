import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

export const MAX_UPLOAD_BYTES = 250 * 1024 * 1024; // 250 MB
const MIN_FREE_DISK_BYTES = 256 * 1024 * 1024; // Keep at least 256 MB free buffer

const ALLOWED_MIME_PREFIXES = ['video/', 'audio/', 'image/'];
const ALLOWED_EXACT_MIMES = new Set([
  'application/pdf',
  'application/json',
  'text/json',
  'text/plain',
  'application/x-subrip',
  'text/vtt',
]);

export interface StorageProvider {
  saveFromStream(
    ownerId: string,
    originalName: string,
    mimeType: string,
    webStream: ReadableStream<Uint8Array>,
    declaredSize?: number
  ): Promise<{ objectKey: string; sizeBytes: number }>;
  stat(objectKey: string): Promise<{ sizeBytes: number } | null>;
  readWebStream(objectKey: string, start?: number, end?: number): ReadableStream<Uint8Array>;
  delete(objectKey: string): Promise<void>;
  getDiskStatus(): Promise<{ freeBytes: number; totalBytes: number }>;
}

function getStorageRoot(): string {
  const configured = process.env.MEDIA_STORAGE_ROOT || path.join(process.cwd(), 'storage', 'media');
  return path.resolve(/*turbopackIgnore: true*/ configured);
}

export function getTempRoot(): string {
  const configured = process.env.MEDIA_TEMP_ROOT || path.join(process.cwd(), 'storage', 'temp');
  return path.resolve(/*turbopackIgnore: true*/ configured);
}

function resolveSafePath(objectKey: string): string {
  const root = getStorageRoot();
  const normalizedKey = objectKey.replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.resolve(/*turbopackIgnore: true*/ root, normalizedKey);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error('Invalid storage key path');
  }
  return resolved;
}

export function resolveAssetAbsolutePath(objectKey: string): string {
  return resolveSafePath(objectKey);
}

export function validateUploadMetadata(mimeType: string, sizeBytes: number): void {
  if (sizeBytes <= 0) {
    throw new Error('Uploaded file cannot be empty.');
  }
  if (sizeBytes > MAX_UPLOAD_BYTES) {
    throw new Error('File exceeds the 250 MB local upload limit.');
  }
  const cleanMime = (mimeType || '').toLowerCase().split(';')[0].trim();
  const allowed =
    ALLOWED_MIME_PREFIXES.some((prefix) => cleanMime.startsWith(prefix)) ||
    ALLOWED_EXACT_MIMES.has(cleanMime);
  if (!allowed) {
    throw new Error(
      `Unsupported file type (${cleanMime || 'unknown'}). Allowed: video, audio, image, PDF, SRT/VTT/TXT.`
    );
  }
}

/**
 * Inspects file magic bytes on disk to prevent spoofed MIME types (e.g. .exe renamed to .mp4).
 */
export async function validateFileMagicBytes(filePath: string, mimeType: string): Promise<void> {
  const handle = await fsp.open(/*turbopackIgnore: true*/ filePath, 'r');
  try {
    const header = Buffer.alloc(16);
    const { bytesRead } = await handle.read(header, 0, 16, 0);
    if (bytesRead === 0) {
      throw new Error('Uploaded file is empty.');
    }

    const cleanMime = (mimeType || '').toLowerCase().split(';')[0].trim();

    // Reject Windows PE executables (.exe/.dll) or ELF binaries regardless of MIME
    if ((header[0] === 0x4d && header[1] === 0x5a) || (header[0] === 0x7f && header.subarray(1, 4).toString('ascii') === 'ELF')) {
      throw new Error('Executable binaries are not permitted.');
    }

    if (cleanMime === 'video/mp4' || cleanMime === 'video/quicktime') {
      const ftyp = header.subarray(4, 8).toString('ascii');
      if (ftyp !== 'ftyp') {
        throw new Error('Invalid MP4/MOV file signature (missing ftyp header).');
      }
      return;
    }

    if (cleanMime === 'video/webm') {
      const isEbml = header[0] === 0x1a && header[1] === 0x45 && header[2] === 0xdf && header[3] === 0xa3;
      if (!isEbml) throw new Error('Invalid WebM file signature.');
      return;
    }

    if (cleanMime === 'image/png') {
      const isPng = header[0] === 0x89 && header.subarray(1, 4).toString('ascii') === 'PNG';
      if (!isPng) throw new Error('Invalid PNG file signature.');
      return;
    }

    if (cleanMime === 'image/jpeg' || cleanMime === 'image/jpg') {
      const isJpg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
      if (!isJpg) throw new Error('Invalid JPEG file signature.');
      return;
    }

    if (cleanMime === 'image/webp') {
      if (header.subarray(0, 4).toString('ascii') !== 'RIFF' || header.subarray(8, 12).toString('ascii') !== 'WEBP') {
        throw new Error('Invalid WebP file signature.');
      }
      return;
    }

    if (cleanMime === 'audio/wav' || cleanMime === 'audio/wave') {
      if (header.subarray(0, 4).toString('ascii') !== 'RIFF' || header.subarray(8, 12).toString('ascii') !== 'WAVE') {
        throw new Error('Invalid WAV file signature.');
      }
      return;
    }

    if (cleanMime === 'audio/mpeg' || cleanMime === 'audio/mp3') {
      const isId3 = header.subarray(0, 3).toString('ascii') === 'ID3';
      const isFrameSync = header[0] === 0xff && (header[1] & 0xe0) === 0xe0;
      if (!isId3 && !isFrameSync) {
        throw new Error('Invalid MP3 file signature.');
      }
      return;
    }

    if (cleanMime === 'application/pdf') {
      if (header.subarray(0, 5).toString('ascii') !== '%PDF-') {
        throw new Error('Invalid PDF file signature.');
      }
      return;
    }

    if (cleanMime === 'text/plain' || cleanMime === 'text/vtt' || cleanMime === 'application/x-subrip') {
      if (header.subarray(0, bytesRead).includes(0x00)) {
        throw new Error('Invalid text/subtitle file (binary null bytes detected).');
      }
    }
  } finally {
    await handle.close();
  }
}

export function buildSafeObjectKey(ownerId: string, originalName: string): string {
  const safeOwner = ownerId.replace(/[^a-zA-Z0-9_-]/g, '');
  const ext = path.extname(originalName).replace(/[^a-zA-Z0-9.]/g, '').slice(0, 12);
  const base =
    path
      .basename(originalName, path.extname(originalName))
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 48) || 'asset';
  return `${safeOwner}/${crypto.randomUUID()}-${base}${ext}`;
}

export class InsufficientStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientStorageError';
  }
}

export class LocalStorageProvider implements StorageProvider {
  async getDiskStatus() {
    const root = getStorageRoot();
    await fsp.mkdir(/*turbopackIgnore: true*/ root, { recursive: true });
    const stats = await fsp.statfs(root);
    return {
      freeBytes: Number(stats.bavail) * Number(stats.bsize),
      totalBytes: Number(stats.blocks) * Number(stats.bsize),
    };
  }

  async saveFromStream(
    ownerId: string,
    originalName: string,
    mimeType: string,
    webStream: ReadableStream<Uint8Array>,
    declaredSize: number = 0
  ) {
    const { freeBytes } = await this.getDiskStatus();
    if (freeBytes < declaredSize + MIN_FREE_DISK_BYTES) {
      throw new InsufficientStorageError(
        'Insufficient local disk space available for media upload.'
      );
    }

    const tempRoot = getTempRoot();
    await fsp.mkdir(/*turbopackIgnore: true*/ tempRoot, { recursive: true });
    const tempPath = path.join(/*turbopackIgnore: true*/ tempRoot, `${crypto.randomUUID()}.tmp`);

    try {
      const nodeReadable = Readable.fromWeb(webStream as any);
      const writeStream = fs.createWriteStream(/*turbopackIgnore: true*/ tempPath);
      await pipeline(nodeReadable, writeStream);

      const st = await fsp.stat(/*turbopackIgnore: true*/ tempPath);
      if (st.size <= 0) {
        throw new Error('Uploaded file cannot be empty.');
      }
      if (st.size > MAX_UPLOAD_BYTES) {
        throw new Error('File exceeds the 250 MB local upload limit.');
      }

      await validateFileMagicBytes(tempPath, mimeType);

      const objectKey = buildSafeObjectKey(ownerId, originalName);
      const finalPath = resolveSafePath(objectKey);
      await fsp.mkdir(/*turbopackIgnore: true*/ path.dirname(finalPath), { recursive: true });
      await fsp.rename(/*turbopackIgnore: true*/ tempPath, finalPath);

      return { objectKey, sizeBytes: st.size };
    } catch (err) {
      await fsp.unlink(/*turbopackIgnore: true*/ tempPath).catch(() => {});
      throw err;
    }
  }

  async stat(objectKey: string) {
    try {
      const fullPath = resolveSafePath(objectKey);
      const st = await fsp.stat(/*turbopackIgnore: true*/ fullPath);
      if (!st.isFile()) return null;
      return { sizeBytes: st.size };
    } catch {
      return null;
    }
  }

  readWebStream(objectKey: string, start?: number, end?: number): ReadableStream<Uint8Array> {
    const fullPath = resolveSafePath(objectKey);
    const nodeStream = fs.createReadStream(
      /*turbopackIgnore: true*/ fullPath,
      typeof start === 'number' && typeof end === 'number' ? { start, end } : undefined
    );
    return Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;
  }

  async delete(objectKey: string) {
    try {
      const fullPath = resolveSafePath(objectKey);
      await fsp.unlink(/*turbopackIgnore: true*/ fullPath);
    } catch {
      // Ignore if file already missing on disk
    }
  }
}

export const mediaStorage: StorageProvider = new LocalStorageProvider();
