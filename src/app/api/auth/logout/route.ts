import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revokeSessionToken } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('clipflow_session')?.value;
  if (token) {
    await revokeSessionToken(token).catch(() => {});
  }

  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Clear the authentication session cookie
  res.cookies.set('clipflow_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Instantly expires the cookie
  });

  return res;
}
