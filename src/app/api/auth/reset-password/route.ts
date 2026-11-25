import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

const ResetSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  code: z.string().trim().length(6, { message: 'Recovery code must be 6 digits' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const validation = ResetSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid reset input';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, code, newPassword } = validation.data;
    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetCode ||
      user.resetCode !== code ||
      !user.resetCodeExpiresAt ||
      user.resetCodeExpiresAt.getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: 'Invalid or expired recovery code' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetCode = null;
    user.resetCodeExpiresAt = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now sign in.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
