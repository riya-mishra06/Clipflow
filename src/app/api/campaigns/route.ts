import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';

export async function GET() {
  try {
    await connectDB();
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ data: campaigns });
  } catch (err: any) {
    // If DB is offline locally, return fallback demo items to keep UI responsive
    return NextResponse.json({
      data: [
        {
          _id: 'c1',
          title: 'SaaS Founder Podcast Highlights',
          brief: 'Clip 45-60s moments with viral retention hooks.',
          payoutTerms: '$80 / approved clip',
          availability: 'open',
          source: 'Whop',
          deadlineDate: '2026-12-10',
        },
        {
          _id: 'c2',
          title: 'AI Productivity Shorts Challenge',
          brief: 'Create engaging vertical walkthroughs under 45 seconds.',
          payoutTerms: '$120 / clip',
          availability: 'open',
          source: 'Content Rewards',
          deadlineDate: '2026-12-18',
        },
      ],
      warning: 'Fallback data served (check MONGODB_URI)',
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const campaign = await Campaign.create(body);
    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
