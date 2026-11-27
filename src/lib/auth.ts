import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import { RevokedToken } from '@/models/RevokedToken';

const COOKIE_NAME = 'clipflow_session';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

export interface TokenPayload {
  userId: string;
  email: string;
  displayName: string;
}

export function signSessionToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifySessionToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function revokeSessionToken(token: string): Promise<void> {
  if (!token) return;
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await connectDB();
  await RevokedToken.updateOne(
    { tokenHash: hashToken(token) },
    { $setOnInsert: { tokenHash: hashToken(token), expiresAt } },
    { upsert: true }
  );
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;

  await connectDB();
  const revoked = await RevokedToken.exists({ tokenHash: hashToken(token) });
  if (revoked) return null;
  return payload;
}
