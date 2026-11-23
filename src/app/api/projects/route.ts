import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ updatedAt: -1 });
    return NextResponse.json({ data: projects });
  } catch (err: any) {
    return NextResponse.json({
      data: [
        {
          _id: 'p1',
          title: 'Episode 42 - AI Disruption Highlights',
          kind: 'campaign',
          status: 'active',
          deadlineDate: '2026-12-10',
        },
      ],
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const project = await Project.create(body);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
