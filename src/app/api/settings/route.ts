import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getCurrentUser, signSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const UpdateProfileSchema = z.object({
  type: z.literal('profile').optional().default('profile'),
  displayName: z.string().trim().min(2, { message: 'Display name must be at least 2 characters' }).max(50),
  handle: z.string().trim().max(40).optional().default(''),
  bio: z.string().trim().max(300).optional().default(''),
  timeZone: z.string().trim().max(60).optional().default('UTC'),
  payoutDestination: z.string().trim().max(120).optional().default(''),
  notifications: z
    .object({
      bountyApproved: z.boolean(),
      deadlineAlert: z.boolean(),
    })
    .optional(),
});

const ChangePasswordSchema = z.object({
  type: z.literal('password'),
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }).max(100),
});

export async function GET() {
  try {
    await connectDB();
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await User.findById(session.userId).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (err: any) {
    console.error('Fetch settings error:', err);
    return NextResponse.json({ error: 'Failed to load profile settings' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();

    // 1. Password change flow
    if (body?.type === 'password') {
      const validation = ChangePasswordSchema.safeParse(body);
      if (!validation.success) {
        const firstError = validation.error.issues[0]?.message || 'Invalid password input';
        return NextResponse.json({ error: firstError }, { status: 400 });
      }

      const userDoc = await User.findById(session.userId);
      if (!userDoc) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(validation.data.currentPassword, userDoc.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const salt = await bcrypt.genSalt(10);
      userDoc.passwordHash = await bcrypt.hash(validation.data.newPassword, salt);
      await userDoc.save();

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    // 2. Profile update flow
    const validation = UpdateProfileSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid profile data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { type, ...fields } = validation.data;
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      { $set: fields },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Re-issue JWT cookie so sidebar displayName updates immediately
    const token = signSessionToken({
      userId: updatedUser._id.toString(),
      email: updatedUser.email,
      displayName: updatedUser.displayName,
    });

    const res = NextResponse.json({
      success: true,
      message: 'Profile settings saved',
      data: updatedUser,
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
    console.error('Update settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
