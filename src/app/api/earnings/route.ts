import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Submission } from '@/models/Submission';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function parseAmount(value?: string): number {
  if (!value) return 0;
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  return Number.isNaN(num) ? 0 : num;
}

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const submissions = await Submission.find({ ownerId: user.userId })
      .sort({ createdAt: -1 })
      .limit(100);

    let availableBalance = 0;
    let lockedEscrow = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    const transactions = submissions.map((sub) => {
      const amount = parseAmount(sub.payoutAmount);
      if (sub.status === 'approved') {
        availableBalance += amount;
        approvedCount += 1;
      } else if (sub.status === 'pending_review') {
        lockedEscrow += amount;
        pendingCount += 1;
      }

      return {
        _id: sub._id,
        projectTitle: sub.projectTitle,
        campaignTitle: sub.campaignTitle,
        cutVersion: sub.cutVersion,
        amount,
        amountFormatted: `$${amount.toFixed(2)}`,
        status: sub.status,
        createdAt: sub.createdAt,
      };
    });

    return NextResponse.json({
      summary: {
        availableBalance,
        lockedEscrow,
        lifetimeYield: availableBalance,
        approvedCount,
        pendingCount,
        totalSubmissions: submissions.length,
      },
      transactions,
    });
  } catch (err: any) {
    console.error('Earnings fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to calculate creator earnings' },
      { status: 500 }
    );
  }
}
