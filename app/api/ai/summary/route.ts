import { NextResponse } from 'next/server';
import { getGeminiClient, getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ai = getGeminiClient();

    const prompt = `You are a resume writing assistant. Write a concise professional summary in 3-4 sentences.
Return only the summary text, with no title and no markdown.

Candidate information:
Name: ${body.fullName || 'Not provided'}
Target role: ${body.targetRole || 'Not provided'}
Years of experience: ${body.yearsOfExperience || 'Not provided'}
Top skills: ${Array.isArray(body.skills) ? body.skills.join(', ') : body.skills || 'Not provided'}
Work highlights: ${body.highlights || 'Not provided'}
Education: ${body.education || 'Not provided'}`;

    const response = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: prompt
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
  }
}
