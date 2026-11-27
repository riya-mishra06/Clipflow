import crypto from 'crypto';
import dns from 'dns/promises';
import net from 'net';
import { validateExternalFeedUrl } from '@/lib/security';
import { detectUrlInput, DetectedInput } from '@/lib/inputDetector';
import { mediaStorage } from '@/lib/storage';
import { Asset } from '@/models/Asset';

const MAX_REDIRECTS = 3;
const MAX_DIRECT_IMPORT_BYTES = 25 * 1024 * 1024; // 25 MB
const MAX_HTML_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
const REQUEST_TIMEOUT_MS = 10_000;

function isBlockedIpAddress(ip: string): boolean {
  const n = ip.toLowerCase();
  if (n === '::1' || n === '::' || n.startsWith('fc') || n.startsWith('fd') || n.startsWith('fe80:')) return true;
  const parts = n.split('.').map(Number);
  if (parts.length !== 4 || parts.some((x) => Number.isNaN(x))) return false;
  const [a, b] = parts;
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
}

async function assertResolvedHostPublic(hostname: string): Promise<void> {
  if (net.isIP(hostname)) {
    if (isBlockedIpAddress(hostname)) throw new Error('Resolved IP is private or loopback.');
    return;
  }
  const records = await dns.lookup(hostname, { all: true }).catch(() => []);
  for (const rec of records) {
    if (isBlockedIpAddress(rec.address)) {
      throw new Error('Target hostname resolves to a restricted private IP.');
    }
  }
}

export async function safeFetchWithRedirects(rawUrl: string): Promise<{ response: Response; finalUrl: string }> {
  let current = validateExternalFeedUrl(rawUrl).toString();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const parsed = validateExternalFeedUrl(current);
    await assertResolvedHostPublic(parsed.hostname);

    const res = await fetch(current, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        'User-Agent': 'Clipflow-UniversalIngestor/1.0',
        Accept: '*/*',
      },
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) throw new Error('Redirect response missing Location header.');
      current = new URL(location, current).toString();
      continue;
    }

    return { response: res, finalUrl: current };
  }

  throw new Error('Too many redirects while fetching external URL.');
}

function extractMetaTag(html: string, key: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${key}["']`,
    'i'
  );
  const m = html.match(re);
  return (m?.[1] || m?.[2] || '').trim();
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return (m?.[1] || '').replace(/\s+/g, ' ').trim();
}

function stripHtmlText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3500);
}

export interface UrlIngestResult {
  url: string;
  detected: DetectedInput;
  importMode: 'direct_import' | 'metadata_and_oembed' | 'metadata_and_text' | 'reference_only';
  title: string;
  description?: string;
  thumbnailUrl?: string;
  textExcerpt?: string;
  deduplicated?: boolean;
  asset?: Record<string, unknown> | null;
  notice: string;
}

export async function ingestExternalUrl(params: {
  url: string;
  userId: string;
  overrideKind?: DetectedInput['kind'];
}): Promise<UrlIngestResult> {
  const cleanUrl = validateExternalFeedUrl(params.url).toString();
  const detected = detectUrlInput(cleanUrl);
  if (params.overrideKind) {
    detected.kind = params.overrideKind;
  }

  // 1. YouTube: Official oEmbed API only (no unauthorized scraping/downloading)
  if (detected.platform === 'youtube') {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
      const { response } = await safeFetchWithRedirects(oembedUrl);
      if (response.ok) {
        const data = (await response.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };
        return {
          url: cleanUrl,
          detected,
          importMode: 'metadata_and_oembed',
          title: data.title || 'YouTube Video Reference',
          description: data.author_name ? `Channel: ${data.author_name}` : undefined,
          thumbnailUrl: data.thumbnail_url,
          asset: null,
          notice:
            'YouTube metadata & thumbnail imported via official oEmbed. Upload an authorized local MP4 for full FFmpeg/Whisper processing.',
        };
      }
    } catch {
      // Fall through to honest reference-only mode
    }
    return {
      url: cleanUrl,
      detected,
      importMode: 'reference_only',
      title: 'YouTube Reference Link',
      asset: null,
      notice:
        'YouTube link saved as a reference. Upload an authorized local copy for full FFmpeg/Whisper processing.',
    };
  }

  // 2. Social/Auth-gated platforms (Instagram, TikTok, Twitch): Reference-only, no bypass
  if (detected.supportLevel === 'reference_only') {
    return {
      url: cleanUrl,
      detected,
      importMode: 'reference_only',
      title: detected.label,
      asset: null,
      notice: `${detected.label} added as reference-only metadata. Platform restrictions prevent direct media download; upload an authorized local file for full processing.`,
    };
  }

  // 3. Direct Media / Document URL
  if (detected.supportLevel === 'direct_import') {
    const { response, finalUrl } = await safeFetchWithRedirects(cleanUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Remote server returned HTTP ${response.status} for direct URL.`);
    }

    const contentLength = Number(response.headers.get('content-length') || 0);
    if (contentLength > MAX_DIRECT_IMPORT_BYTES) {
      throw new Error('Remote file exceeds the 25 MB URL import limit.');
    }

    const rawMime = (response.headers.get('content-type') || 'application/octet-stream')
      .split(';')[0]
      .trim()
      .toLowerCase();
    const filename = new URL(finalUrl).pathname.split('/').pop() || 'imported-file';

    // Buffer stream up to 25 MB to compute SHA-256 for deduplication before saving
    const reader = response.body.getReader();
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_DIRECT_IMPORT_BYTES) {
        await reader.cancel().catch(() => {});
        throw new Error('Remote file exceeded the 25 MB URL import limit.');
      }
      chunks.push(Buffer.from(value));
    }

    const fileBuf = Buffer.concat(chunks, totalBytes);
    const sha256 = crypto.createHash('sha256').update(fileBuf).digest('hex');

    const existing = await Asset.findOne({ ownerId: params.userId, sha256, deletedAt: null });
    if (existing) {
      return {
        url: cleanUrl,
        detected,
        importMode: 'direct_import',
        title: existing.name,
        deduplicated: true,
        asset: existing.toObject() as unknown as Record<string, unknown>,
        notice: 'Duplicate file detected via SHA-256; reused existing Clipflow Vault asset.',
      };
    }

    const webStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(fileBuf));
        controller.close();
      },
    });

    const saved = await mediaStorage.saveFromStream(params.userId, filename, rawMime, webStream, totalBytes);
    const category = rawMime.startsWith('video/')
      ? 'video'
      : rawMime.startsWith('audio/')
      ? 'audio'
      : rawMime.startsWith('image/')
      ? 'image'
      : 'document';

    const asset = await Asset.create({
      ownerId: params.userId,
      name: filename.slice(0, 150),
      kind: 'upload',
      category,
      mimeType: rawMime,
      sizeBytes: saved.sizeBytes,
      objectKey: saved.objectKey,
      externalUrl: cleanUrl,
      sha256,
      status: 'ready',
      tags: ['url-imported'],
      deletedAt: null,
      expireAt: null,
    });

    return {
      url: cleanUrl,
      detected,
      importMode: 'direct_import',
      title: asset.name,
      deduplicated: false,
      asset: asset.toObject() as unknown as Record<string, unknown>,
      notice: 'Direct media file validated and imported into Clipflow Vault.',
    };
  }

  // 4. Public Website / Product / Affiliate Page
  const { response } = await safeFetchWithRedirects(cleanUrl);
  if (response.status === 401 || response.status === 403) {
    return {
      url: cleanUrl,
      detected,
      importMode: 'reference_only',
      title: new URL(cleanUrl).hostname,
      asset: null,
      notice: `Target page restricted automated access (HTTP ${response.status}). Stored as reference link only.`,
    };
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch webpage metadata (HTTP ${response.status}).`);
  }

  const reader = response.body?.getReader();
  const htmlChunks: Buffer[] = [];
  let bytes = 0;
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      htmlChunks.push(Buffer.from(value));
      if (bytes >= MAX_HTML_BYTES) {
        await reader.cancel().catch(() => {});
        break;
      }
    }
  }
  const html = Buffer.concat(htmlChunks).toString('utf8');
  const title = extractMetaTag(html, 'og:title') || extractTitle(html) || new URL(cleanUrl).hostname;
  const description = extractMetaTag(html, 'og:description') || extractMetaTag(html, 'description');
  const thumbnailUrl = extractMetaTag(html, 'og:image') || undefined;
  const textExcerpt = stripHtmlText(html);

  return {
    url: cleanUrl,
    detected,
    importMode: 'metadata_and_text',
    title,
    description,
    thumbnailUrl,
    textExcerpt,
    asset: null,
    notice: 'Public webpage metadata and text extracted safely.',
  };
}
