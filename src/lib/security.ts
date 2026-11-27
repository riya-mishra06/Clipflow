import crypto from 'crypto';
import net from 'net';

/**
 * Escapes RegExp metacharacters from user-supplied search strings
 * to prevent MongoDB regex syntax errors and ReDoS.
 */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Hashes a 6-digit OTP reset code with SHA-256 before storing in MongoDB.
 */
export function hashResetCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Constant-time comparison between a plain OTP code and its stored SHA-256 hash.
 */
export function verifyResetCode(code: string, storedHash: string): boolean {
  const candidate = Buffer.from(hashResetCode(code), 'hex');
  const expected = Buffer.from(storedHash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

function isPrivateOrLocalIp(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe80:')) {
    return true;
  }
  const parts = normalized.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return false;
  const [a, b] = parts;
  if (a === 10 || a === 127 || a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

/**
 * Validates an external feed URL against SSRF (requires HTTPS public host).
 */
export function validateExternalFeedUrl(rawUrl: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid feed URL format.');
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('Only HTTPS feed URLs are permitted.');
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    (net.isIP(host) && isPrivateOrLocalIp(host))
  ) {
    throw new Error('Private or local network feed URLs are not permitted.');
  }

  return parsed;
}
