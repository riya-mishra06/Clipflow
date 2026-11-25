import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signSessionToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please provide a valid email address' })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`login:${ip}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please retry in ${rate.retryAfterSec}s.` },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      );
    }

    await connectDB();
    const body = await req.json();

    // 1. Zod Schema Validation
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid email or password format';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = validation.data;

    // 2. Lookup user
    const user = await User.findOne({ email });
    if (!user) {
      // Intentionally generic to prevent user enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Compare hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 4. Generate JWT
    const token = signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    });

    const res = NextResponse.json({
      data: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
    });

    res.cookies.set('clipflow_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    // Sanitize error logging: never expose raw DB errors
    console.error('Login internal error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}
