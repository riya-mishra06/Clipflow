import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';
import { Project } from '@/models/Project';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    await connectDB();
    const user = await getCurrentUser();

    const [campaigns, projects] = await Promise.all([
      Campaign.find({ availability: 'open' }).sort({ createdAt: -1 }).limit(30),
      user
        ? Project.find({
            ownerId: user.userId,
            status: { $nin: ['completed', 'archived'] },
          })
            .sort({ createdAt: -1 })
            .limit(30)
        : Promise.resolve([]),
    ]);

    const now = Date.now();

    const campaignEvents = campaigns.map((camp) => {
      const days = camp.deadlineDays || 7;
      const baseTime = camp.createdAt ? new Date(camp.createdAt).getTime() : now;
      const dueTime = baseTime + days * DAY_MS;
      const daysLeft = Math.max(0, Math.ceil((dueTime - now) / DAY_MS));

      return {
        id: camp._id.toString(),
        kind: 'campaign' as const,
        title: camp.title,
        subtitle: `${camp.brand} • $${camp.baseRate}`,
        dueDate: new Date(dueTime).toISOString(),
        daysLeft,
        urgency: daysLeft <= 2 ? 'urgent' : daysLeft <= 5 ? 'soon' : 'upcoming',
        href: `/campaigns/${camp._id.toString()}`,
      };
    });

    const projectEvents = projects.map((proj) => {
      const days = proj.deadlineDays || 7;
      const baseTime = proj.createdAt ? new Date(proj.createdAt).getTime() : now;
      const dueTime = baseTime + days * DAY_MS;
      const daysLeft = Math.max(0, Math.ceil((dueTime - now) / DAY_MS));

      return {
        id: proj._id.toString(),
        kind: 'project' as const,
        title: proj.title,
        subtitle: `${proj.campaignTitle || 'Direct Cut'} • ${proj.estPayout || '$140.00'}`,
        dueDate: new Date(dueTime).toISOString(),
        daysLeft,
        urgency: daysLeft <= 2 ? 'urgent' : daysLeft <= 5 ? 'soon' : 'upcoming',
        href: `/projects/${proj._id.toString()}`,
      };
    });

    const milestones = [...projectEvents, ...campaignEvents].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    return NextResponse.json({ data: milestones });
  } catch (err: any) {
    console.error('Calendar fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to load production schedule', data: [] },
      { status: 500 }
    );
  }
}
