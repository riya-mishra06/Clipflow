import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

const ForgotSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address' }).toLowerCase(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = ForgotSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid email';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email } = validation.data;
    const user = await User.findOne({ email });

    let devResetCode: string | undefined;

    if (user) {
      const code = crypto.randomInt(100000, 999999).toString();
      user.resetCode = code;
      user.resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      await user.save();

      if (process.env.NODE_ENV !== 'production') {
        devResetCode = code;
        console.log(`[ClipFlow Dev Reset Code] ${email}: ${code}`);
      }
    }

    // Generic message prevents user enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists for that email, a 6-digit recovery code has been generated.',
      ...(devResetCode ? { devResetCode } : {}),
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'An error occurred while processing recovery request' },
      { status: 500 }
    );
  }
}
