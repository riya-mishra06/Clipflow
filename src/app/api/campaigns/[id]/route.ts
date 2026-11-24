import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Campaign } from '@/models/Campaign';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    let campaign = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      campaign = await Campaign.findById(id);
    }

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json({ data: campaign });
  } catch (err: any) {
    console.error('Fetch campaign detail error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve campaign details' },
      { status: 500 }
    );
  }
}
