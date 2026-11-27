import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes safety cap

export interface MediaMetadata {
  durationSec: number;
  width: number;
  height: number;
  fps: number;
  aspectRatio: string;
  videoCodec: string | null;
  audioCodec: string | null;
  hasAudio: boolean;
  formatName: string;
  sizeBytes: number;
}

export class ProcessCancelledError extends Error {
  constructor(message = 'Media process cancelled') {
    super(message);
    this.name = 'ProcessCancelledError';
  }
}

/**
 * Runs a binary safely without shell interpolation (shell: false),
 * enforcing timeout and cooperative AbortSignal cancellation.
 */
function runProcess(
  command: string,
  args: string[],
  options: { timeoutMs?: number; signal?: AbortSignal } = {}
): Promise<{ stdout: string; stderr: string }> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      return reject(new ProcessCancelledError());
    }

    const child = spawn(command, args, {
      shell: false,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    let settled = false;

    const cleanup = () => {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', onAbort);
    };

    const killChild = () => {
      try {
        child.kill('SIGTERM');
        setTimeout(() => {
          try {
            if (!child.killed) child.kill('SIGKILL');
          } catch {}
        }, 1500);
      } catch {}
    };

    const onAbort = () => {
      if (settled) return;
      settled = true;
      cleanup();
      killChild();
      reject(new ProcessCancelledError());
    };

    options.signal?.addEventListener('abort', onAbort);

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      killChild();
      reject(new Error(`${command} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} exited with code ${code}: ${stderr.slice(-500)}`));
      }
    });
  });
}

function assertPositiveNumber(val: number, label: string) {
  if (!Number.isFinite(val) || val < 0) {
    throw new Error(`Invalid ${label}: ${val}`);
  }
}

export async function probeMedia(inputPath: string, signal?: AbortSignal): Promise<MediaMetadata> {
  const { stdout } = await runProcess(
    'ffprobe',
    ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', inputPath],
    { timeoutMs: 30_000, signal }
  );

  const parsed = JSON.parse(stdout || '{}');
  const streams: any[] = Array.isArray(parsed.streams) ? parsed.streams : [];
  const videoStream = streams.find((s) => s.codec_type === 'video');
  const audioStream = streams.find((s) => s.codec_type === 'audio');
  const format = parsed.format || {};

  const width = Number(videoStream?.width || 0);
  const height = Number(videoStream?.height || 0);
  let fps = 0;
  if (typeof videoStream?.r_frame_rate === 'string' && videoStream.r_frame_rate.includes('/')) {
    const [num, den] = videoStream.r_frame_rate.split('/').map(Number);
    if (den > 0) fps = Math.round((num / den) * 100) / 100;
  }

  return {
    durationSec: Math.round(Number(format.duration || 0) * 1000) / 1000,
    width,
    height,
    fps,
    aspectRatio: width && height ? `${width}:${height}` : 'unknown',
    videoCodec: videoStream?.codec_name || null,
    audioCodec: audioStream?.codec_name || null,
    hasAudio: Boolean(audioStream),
    formatName: String(format.format_name || 'unknown'),
    sizeBytes: Number(format.size || 0),
  };
}

export async function extractAudio(
  inputPath: string,
  outputWavPath: string,
  signal?: AbortSignal
): Promise<void> {
  await runProcess(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-vn',
      '-acodec',
      'pcm_s16le',
      '-ar',
      '16000',
      '-ac',
      '1',
      outputWavPath,
    ],
    { signal }
  );
}

export async function trimVideo(
  inputPath: string,
  outputPath: string,
  startSec: number,
  durationSec: number,
  signal?: AbortSignal
): Promise<void> {
  assertPositiveNumber(startSec, 'startSec');
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    throw new Error('durationSec must be greater than 0');
  }

  await runProcess(
    'ffmpeg',
    [
      '-y',
      '-ss',
      String(startSec),
      '-i',
      inputPath,
      '-t',
      String(durationSec),
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-c:a',
      'aac',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { signal }
  );
}

export async function splitVideo(
  inputPath: string,
  outputDir: string,
  segmentSec: number,
  signal?: AbortSignal
): Promise<string[]> {
  if (!Number.isFinite(segmentSec) || segmentSec <= 0) {
    throw new Error('segmentSec must be greater than 0');
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const pattern = path.join(outputDir, 'part_%03d.mp4');

  await runProcess(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-force_key_frames',
      `expr:gte(t,n_forced*${segmentSec})`,
      '-c:a',
      'aac',
      '-f',
      'segment',
      '-segment_time',
      String(segmentSec),
      '-reset_timestamps',
      '1',
      pattern,
    ],
    { signal }
  );

  const files = await fsp.readdir(outputDir);
  return files
    .filter((f) => f.startsWith('part_') && f.endsWith('.mp4'))
    .sort()
    .map((f) => path.join(outputDir, f));
}

export async function concatVideos(
  inputPaths: string[],
  outputPath: string,
  listFilePath: string,
  signal?: AbortSignal
): Promise<void> {
  if (!Array.isArray(inputPaths) || inputPaths.length === 0) {
    throw new Error('At least one input video is required for concatenation');
  }
  const listContent = inputPaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
    .join('\n');
  await fsp.writeFile(listFilePath, listContent, 'utf8');

  try {
    await runProcess(
      'ffmpeg',
      [
        '-y',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listFilePath,
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-movflags',
        '+faststart',
        outputPath,
      ],
      { signal }
    );
  } finally {
    await fsp.unlink(listFilePath).catch(() => {});
  }
}

/**
 * Converts video to vertical 9:16 (1080x1920) using basic center or manual horizontal offset cropping.
 */
export async function convertToVertical916(
  inputPath: string,
  outputPath: string,
  cropOffsetRatio: number = 0.5,
  signal?: AbortSignal
): Promise<void> {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(cropOffsetRatio) ? cropOffsetRatio : 0.5));
  // Scale height to 1920 preserving aspect ratio, then crop 1080x1920 at manual/center horizontal ratio
  const vf = `scale=-2:1920,crop=1080:1920:(iw-1080)*${clamped}:0`;

  await runProcess(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-vf',
      vf,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-c:a',
      'aac',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { signal }
  );
}

export async function generateThumbnail(
  inputPath: string,
  outputJpgPath: string,
  timestampSec: number = 1,
  signal?: AbortSignal
): Promise<void> {
  assertPositiveNumber(timestampSec, 'timestampSec');
  await runProcess(
    'ffmpeg',
    ['-y', '-ss', String(timestampSec), '-i', inputPath, '-vframes', '1', '-q:v', '2', outputJpgPath],
    { timeoutMs: 30_000, signal }
  );
}

export async function extractFrames(
  inputPath: string,
  outputDir: string,
  fps: number = 1,
  signal?: AbortSignal
): Promise<string[]> {
  if (!Number.isFinite(fps) || fps <= 0 || fps > 10) {
    throw new Error('fps must be between 0 and 10');
  }
  await fsp.mkdir(outputDir, { recursive: true });
  const pattern = path.join(outputDir, 'frame_%04d.jpg');

  await runProcess(
    'ffmpeg',
    ['-y', '-i', inputPath, '-vf', `fps=${fps}`, '-q:v', '3', pattern],
    { signal }
  );

  const files = await fsp.readdir(outputDir);
  return files
    .filter((f) => f.startsWith('frame_') && f.endsWith('.jpg'))
    .sort()
    .map((f) => path.join(outputDir, f));
}

/**
 * Escapes file path for FFmpeg libass subtitles filter on Windows/POSIX.
 */
function escapeFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/^([A-Za-z]):/, '$1\\:').replace(/'/g, "\\'");
}

export async function renderSubtitles(
  inputPath: string,
  srtPath: string,
  outputPath: string,
  signal?: AbortSignal
): Promise<void> {
  const escapedSrt = escapeFilterPath(path.resolve(srtPath));
  const vf = `subtitles='${escapedSrt}':force_style='Fontsize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Alignment=2,MarginV=48'`;

  await runProcess(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-vf',
      vf,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '23',
      '-c:a',
      'aac',
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { signal }
  );
}

export interface TranscriptionResult {
  modelUsed: string;
  language: string;
  languageProbability: number;
  duration: number;
  elapsedSec: number;
  pythonTracedPeakMb: number;
  processRssMb: number;
  processPeakRssMb: number;
  text: string;
  segments: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    words: Array<{ word: string; start: number; end: number; probability: number }>;
  }>;
  words: Array<{ word: string; start: number; end: number; probability: number }>;
  srt: string;
  vtt: string;
}

export async function transcribeAudio(
  wavPath: string,
  model: 'base' | 'tiny' = 'base',
  cpuThreads: number = 4,
  signal?: AbortSignal
): Promise<TranscriptionResult> {
  const pythonExe = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
  const scriptPath = path.join(process.cwd(), 'scripts', 'transcribe.py');
  if (!fs.existsSync(pythonExe)) {
    throw new Error('Python virtual environment (.venv) not found');
  }

  const { stdout } = await runProcess(
    pythonExe,
    [scriptPath, wavPath, model, String(cpuThreads)],
    { timeoutMs: 10 * 60 * 1000, signal }
  );

  return JSON.parse(stdout) as TranscriptionResult;
}

function parseSrtTimeToSec(t: string): number {
  const m = t.trim().match(/^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})$/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
}

function formatSecToSrtTime(sec: number): string {
  const msTotal = Math.max(0, Math.round(sec * 1000));
  const hrs = Math.floor(msTotal / 3_600_000);
  const mins = Math.floor((msTotal % 3_600_000) / 60_000);
  const secs = Math.floor((msTotal % 60_000) / 1000);
  const ms = msTotal % 1000;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

/**
 * Slices a full-video SRT string to [startSec, endSec] and shifts timestamps to start at 00:00:00,000.
 */
export function sliceSrtForClip(srtText: string, startSec: number, endSec: number): string {
  const blocks = srtText.trim().split(/\r?\n\r?\n/);
  const out: string[] = [];
  let idx = 1;

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    if (lines.length < 3) continue;
    const timeLine = lines[1];
    const parts = timeLine.split('-->');
    if (parts.length !== 2) continue;
    const s = parseSrtTimeToSec(parts[0]);
    const e = parseSrtTimeToSec(parts[1]);
    if (e <= startSec || s >= endSec) continue;

    const shiftedStart = Math.max(0, s - startSec);
    const shiftedEnd = Math.min(endSec - startSec, e - startSec);
    if (shiftedEnd <= shiftedStart) continue;

    out.push(`${idx}\n${formatSecToSrtTime(shiftedStart)} --> ${formatSecToSrtTime(shiftedEnd)}\n${lines.slice(2).join('\n')}`);
    idx += 1;
  }

  return out.length > 0 ? out.join('\n\n') + '\n' : '';
}

function hexToAssColor(hex: string): string {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return '&H00FFFFFF';
  const r = clean.slice(0, 2);
  const g = clean.slice(2, 4);
  const b = clean.slice(4, 6);
  return `&H00${b}${g}${r}`.toUpperCase();
}

/**
 * Single-pass Clipping Studio render:
 * Trims [startSec, durationSec], applies basic 9:16 center/manual crop (1080x1920),
 * optional styled SRT captions, optional brand text, and optional logo overlay.
 */
export async function renderClipPipeline(params: {
  inputPath: string;
  outputPath: string;
  startSec: number;
  durationSec: number;
  cropOffsetRatio?: number;
  srtPath?: string | null;
  subtitleStyle?: {
    fontSize?: number;
    primaryColor?: string;
    position?: 'bottom' | 'center' | 'top';
  };
  brandText?: string;
  logoPath?: string | null;
  signal?: AbortSignal;
}): Promise<void> {
  assertPositiveNumber(params.startSec, 'startSec');
  if (!Number.isFinite(params.durationSec) || params.durationSec <= 0) {
    throw new Error('durationSec must be greater than 0');
  }

  const ratio = Math.max(
    0,
    Math.min(1, Number.isFinite(params.cropOffsetRatio) ? Number(params.cropOffsetRatio) : 0.5)
  );

  const filters: string[] = [`scale=-2:1920,crop=1080:1920:(iw-1080)*${ratio}:0`];

  if (params.srtPath && fs.existsSync(params.srtPath)) {
    const escapedSrt = escapeFilterPath(path.resolve(params.srtPath));
    const fontSize = Math.min(42, Math.max(10, Number(params.subtitleStyle?.fontSize || 18)));
    const assColor = hexToAssColor(params.subtitleStyle?.primaryColor || '#FFFFFF');
    const pos = params.subtitleStyle?.position || 'bottom';
    const alignment = pos === 'top' ? 6 : pos === 'center' ? 5 : 2;
    const marginV = pos === 'center' ? 0 : 64;
    filters.push(
      `subtitles='${escapedSrt}':force_style='Fontsize=${fontSize},PrimaryColour=${assColor},OutlineColour=&H00000000,Outline=2,Alignment=${alignment},MarginV=${marginV}'`
    );
  }

  if (params.brandText && params.brandText.trim()) {
    const safeText = params.brandText
      .trim()
      .slice(0, 60)
      .replace(/\\/g, '\\\\')
      .replace(/:/g, '\\:')
      .replace(/'/g, "\\'");
    const fontCandidates = [
      'C:/Windows/Fonts/arial.ttf',
      'C:/Windows/Fonts/segoeui.ttf',
      '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    ];
    const fontPath = fontCandidates.find((p) => fs.existsSync(p));
    const fontOpt = fontPath ? `fontfile='${escapeFilterPath(fontPath)}':` : '';
    filters.push(
      `drawtext=${fontOpt}text='${safeText}':fontcolor=white@0.85:fontsize=30:x=48:y=64:box=1:boxcolor=black@0.45:boxborderw=10`
    );
  }

  const args: string[] = [
    '-y',
    '-ss',
    String(params.startSec),
    '-i',
    params.inputPath,
  ];

  if (params.logoPath && fs.existsSync(params.logoPath)) {
    args.push('-i', params.logoPath);
    const baseChain = filters.join(',');
    const filterComplex = `[0:v]${baseChain}[base];[1:v]scale=120:-1[logo];[base][logo]overlay=W-w-40:48[vout]`;
    args.push(
      '-t',
      String(params.durationSec),
      '-filter_complex',
      filterComplex,
      '-map',
      '[vout]',
      '-map',
      '0:a?'
    );
  } else {
    args.push('-t', String(params.durationSec), '-vf', filters.join(','));
  }

  args.push(
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '23',
    '-c:a',
    'aac',
    '-movflags',
    '+faststart',
    params.outputPath
  );

  await runProcess('ffmpeg', args, { signal: params.signal });
}
