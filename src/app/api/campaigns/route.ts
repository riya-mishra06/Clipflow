import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';
import { getCurrentUser } from '@/lib/auth';

const CreateCampaignSchema = z.object({
  title: z.string().trim().min(3, { message: 'Title must be at least 3 characters' }).max(120),
  brand: z.string().trim().min(2, { message: 'Brand name must be at least 2 characters' }).max(80),
  category: z.string().default('Tech & AI'),
  source: z.string().default('Manual Entry'),
  payoutModel: z.enum(['Fixed Per Clip', 'CPM Views', 'Hybrid Base + Bonus']).default('Fixed Per Clip'),
  baseRate: z.number().min(0, { message: 'Base rate must be 0 or higher' }),
  ratePer1kViews: z.number().min(0).default(0),
  estPool: z.string().default('$5,000 Pool'),
  aspectRatio: z.string().default('9:16'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
  brief: z.string().default(''),
  tags: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
  deadlineDays: z.number().default(7),
  deadlineDate: z.string().optional(),
  spotsRemaining: z.number().default(10),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const filter: Record<string, any> = { availability: 'open' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } },
      ];
    }

    const campaigns = await Campaign.find(filter).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ data: campaigns });
  } catch (err: any) {
    console.error('Fetch campaigns error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve campaigns from database', data: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUser();
    const body = await req.json();

    // 1. Zod schema validation
    const validation = CreateCampaignSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid campaign submission data';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    // 2. Insert into MongoDB Atlas
    const campaignData = {
      ...validation.data,
      ownerId: user ? user.userId : undefined,
    };

    const campaign = await Campaign.create(campaignData);
    return NextResponse.json({ data: campaign }, { status: 201 });
  } catch (err: any) {
    console.error('Create campaign error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while saving the campaign.' },
      { status: 500 }
    );
  }
}
