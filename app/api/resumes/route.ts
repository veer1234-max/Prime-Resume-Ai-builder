import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Resume } from '@/models/Resume';

export async function GET() {
  await connectToDatabase();
  const resumes = await Resume.find().sort({ updatedAt: -1 }).lean();
  return NextResponse.json(resumes);
}

export async function POST(request: Request) {
  await connectToDatabase();
  const body = await request.json();
  const resume = await Resume.create(body);
  return NextResponse.json(resume, { status: 201 });
}
