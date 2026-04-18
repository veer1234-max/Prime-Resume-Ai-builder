import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Resume } from '@/models/Resume';

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Context) {
  await connectToDatabase();
  const { id } = await context.params;
  const resume = await Resume.findById(id).lean();

  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  return NextResponse.json(resume);
}

export async function PUT(request: Request, context: Context) {
  await connectToDatabase();
  const { id } = await context.params;
  const body = await request.json();
  const resume = await Resume.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }).lean();

  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  return NextResponse.json(resume);
}

export async function DELETE(_: Request, context: Context) {
  await connectToDatabase();
  const { id } = await context.params;
  const deleted = await Resume.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
