import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    let project = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (err: any) {
    console.error('Fetch project detail error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve project details' },
      { status: 500 }
    );
  }
}
