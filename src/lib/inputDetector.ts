export type InputSourceKind =
  | 'video'
  | 'image'
  | 'audio'
  | 'document'
  | 'subtitle'
  | 'url_video'
  | 'url_social'
  | 'url_product'
  | 'url_website'
  | 'text_prompt'
  | 'existing_asset';

export type PlatformType =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'twitch'
  | 'direct_media'
  | 'website'
  | 'local';

export type SupportLevel =
  | 'full_local_processing'
  | 'direct_import'
  | 'metadata_and_oembed'
  | 'metadata_and_text'
  | 'reference_only'
  | 'unsupported';

export interface DetectedInput {
  kind: InputSourceKind;
  platform: PlatformType;
  supportLevel: SupportLevel;
  label: string;
  explanation: string;
}

export interface UniversalInputItem {
  id: string;
  kind: InputSourceKind;
  platform: PlatformType;
  supportLevel: SupportLevel;
  label: string;
  assetId?: string;
  url?: string;
  text?: string;
  mimeType?: string;
  sizeBytes?: number;
  thumbnailUrl?: string;
  metadata?: Record<string, unknown>;
  status: 'ready' | 'uploading' | 'ingesting' | 'reference_only' | 'error';
  error?: string;
}

export function detectFileInput(filename: string, mimeType: string = ''): DetectedInput {
  const ext = filename.toLowerCase().split('.').pop() || '';
  const mime = mimeType.toLowerCase();

  if (mime.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv'].includes(ext)) {
    return {
      kind: 'video',
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: 'Video File',
      explanation: 'Local FFmpeg + Whisper processing & keyframe analysis',
    };
  }
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return {
      kind: 'image',
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: 'Image Reference',
      explanation: 'Image reference / vision analysis & brand asset',
    };
  }
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'aac', 'm4a'].includes(ext)) {
    return {
      kind: 'audio',
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: 'Audio File',
      explanation: 'Local Whisper speech transcription & analysis',
    };
  }
  if (['srt', 'vtt'].includes(ext) || mime === 'application/x-subrip' || mime === 'text/vtt') {
    return {
      kind: 'subtitle',
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: 'Subtitle / Transcript',
      explanation: 'Timestamped caption & script extraction',
    };
  }
  if (['pdf', 'txt', 'json'].includes(ext) || mime === 'application/pdf' || mime === 'text/plain' || mime === 'application/json') {
    return {
      kind: 'document',
      platform: 'local',
      supportLevel: 'full_local_processing',
      label: 'Document / Script',
      explanation: 'Document text & structured data extraction',
    };
  }

  return {
    kind: 'document',
    platform: 'local',
    supportLevel: 'unsupported',
    label: 'Unsupported File',
    explanation: 'Format is not supported for local ingestion',
  };
}

export function detectUrlInput(rawUrl: string): DetectedInput {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return {
      kind: 'url_website',
      platform: 'website',
      supportLevel: 'unsupported',
      label: 'Invalid URL',
      explanation: 'Enter a valid http:// or https:// URL',
    };
  }

  const host = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();

  if (host.includes('youtube.com') || host === 'youtu.be') {
    return {
      kind: 'url_video',
      platform: 'youtube',
      supportLevel: 'metadata_and_oembed',
      label: 'YouTube Video / Livestream',
      explanation: 'Official oEmbed metadata & thumbnail reference (upload local MP4 for full FFmpeg/Whisper processing)',
    };
  }

  if (host.includes('instagram.com')) {
    return {
      kind: 'url_social',
      platform: 'instagram',
      supportLevel: 'reference_only',
      label: 'Instagram Reel / Post',
      explanation: 'Reference-only link (platform restricts direct download; upload authorized local file for media processing)',
    };
  }

  if (host.includes('tiktok.com')) {
    return {
      kind: 'url_social',
      platform: 'tiktok',
      supportLevel: 'reference_only',
      label: 'TikTok Video',
      explanation: 'Reference-only link (upload authorized local file for media processing)',
    };
  }

  if (host.includes('twitch.tv')) {
    return {
      kind: 'url_video',
      platform: 'twitch',
      supportLevel: 'reference_only',
      label: 'Twitch Clip / VOD',
      explanation: 'Reference-only link (upload authorized local file for media processing)',
    };
  }

  if (/\.(mp4|mov|webm|mkv|mp3|wav|aac|m4a|jpg|jpeg|png|webp|txt|json|srt|vtt|pdf)(\?|$)/i.test(pathname)) {
    const ext = pathname.split('.').pop() || '';
    const isVideo = ['mp4', 'mov', 'webm', 'mkv'].includes(ext);
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
    const isAudio = ['mp3', 'wav', 'aac', 'm4a'].includes(ext);
    return {
      kind: isVideo ? 'url_video' : isImage ? 'image' : isAudio ? 'audio' : 'document',
      platform: 'direct_media',
      supportLevel: 'direct_import',
      label: isVideo ? 'Direct Video URL' : isImage ? 'Direct Image URL' : isAudio ? 'Direct Audio URL' : 'Direct Document URL',
      explanation: 'Authorized direct file URL (imported via SSRF-safe downloader)',
    };
  }

  const isProduct =
    pathname.includes('/product') ||
    pathname.includes('/dp/') ||
    host.includes('amazon.') ||
    host.includes('shopify') ||
    host.includes('whop.com') ||
    host.includes('flipkart.');

  return {
    kind: isProduct ? 'url_product' : 'url_website',
    platform: 'website',
    supportLevel: 'metadata_and_text',
    label: isProduct ? 'Product / Campaign Page' : 'Public Website Reference',
    explanation: 'Public page metadata & text extraction for AI context',
  };
}
