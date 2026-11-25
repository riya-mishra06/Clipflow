import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';
import { Project } from '@/models/Project';
import { Asset } from '@/models/Asset';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();

    if (!user) {
      const [openCampaignsCount, recentCampaigns] = await Promise.all([
        Campaign.countDocuments({ availability: 'open' }),
        Campaign.find({ availability: 'open' }).sort({ createdAt: -1 }).limit(3),
      ]);

      return NextResponse.json({
        authenticated: false,
        stats: {
          pipelineValue: 0,
          activeProjectsCount: 0,
          openCampaignsCount,
          vaultAssetsCount: 0,
        },
        recentProjects: [],
        recentCampaigns,
      });
    }

    const [
      openCampaignsCount,
      userProjects,
      vaultAssetsCount,
      recentCampaigns,
    ] = await Promise.all([
      Campaign.countDocuments({ availability: 'open' }),
      Project.find({ ownerId: user.userId }).sort({ createdAt: -1 }).limit(50),
      Asset.countDocuments({ ownerId: user.userId, deletedAt: null }),
      Campaign.find({ availability: 'open' }).sort({ createdAt: -1 }).limit(3),
    ]);

    // Calculate total pipeline value from user's projects' estPayout (e.g. "$140.00" -> 140)
    const pipelineValue = userProjects.reduce((sum, proj) => {
      const numeric = parseFloat((proj.estPayout || '0').replace(/[^0-9.]/g, ''));
      return sum + (Number.isNaN(numeric) ? 0 : numeric);
    }, 0);

    return NextResponse.json({
      authenticated: true,
      stats: {
        pipelineValue,
        activeProjectsCount: userProjects.length,
        openCampaignsCount,
        vaultAssetsCount,
      },
      recentProjects: userProjects.slice(0, 5),
      recentCampaigns,
    });
  } catch (err: any) {
    console.error('Dashboard fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to load dashboard overview' },
      { status: 500 }
    );
  }
}
