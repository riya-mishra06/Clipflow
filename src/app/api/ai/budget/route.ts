import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { AIBudget } from '@/models/AIBudget';

export const dynamic = 'force-dynamic';

function currentPeriodKey(): string {
  return new Date().toISOString().slice(0, 7);
}

const UpdateBudgetSchema = z.object({
  monthlyLimitUsd: z.number().min(0).max(500),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  await connectDB();
  const periodKey = currentPeriodKey();
  const budget = await AIBudget.findOneAndUpdate(
    { userId: user.userId, periodKey },
    { $setOnInsert: { userId: user.userId, periodKey, monthlyLimitUsd: 0, reservedUsd: 0, spentUsd: 0 } },
    { upsert: true, new: true }
  );
  return NextResponse.json({ data: budget });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const body = await req.json();
  const parsed = UpdateBudgetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid budget limit (0 - 500 USD)' }, { status: 400 });
  }
  await connectDB();
  const periodKey = currentPeriodKey();
  const budget = await AIBudget.findOneAndUpdate(
    { userId: user.userId, periodKey },
    {
      $set: { monthlyLimitUsd: parsed.data.monthlyLimitUsd },
      $setOnInsert: { userId: user.userId, periodKey, reservedUsd: 0, spentUsd: 0 },
    },
    { upsert: true, new: true }
  );
  return NextResponse.json({ data: budget });
}
