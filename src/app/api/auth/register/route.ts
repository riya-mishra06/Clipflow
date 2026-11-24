import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signSessionToken } from '@/lib/auth';

const RegisterSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, { message: 'Display name must be at least 2 characters long' })
    .max(50, { message: 'Display name cannot exceed 50 characters' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password cannot exceed 100 characters' }),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // 1. Zod Schema Validation
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, displayName } = validation.data;

    // 2. Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // 3. Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create user record
    const user = await User.create({
      email,
      passwordHash,
      displayName,
    });

    // 5. Generate secure JWT cookie
    const token = signSessionToken({
      userId: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    });

    const res = NextResponse.json(
      {
        data: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
        },
      },
      { status: 201 }
    );

    res.cookies.set('clipflow_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err: any) {
    // Sanitize error logging: never expose raw DB errors to client
    console.error('Registration internal error:', err);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during registration. Please try again later.' },
      { status: 500 }
    );
  }
}
