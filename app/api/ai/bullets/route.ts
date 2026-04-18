import { NextResponse } from 'next/server';
import { getGeminiClient, getGeminiModel } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ai = getGeminiClient();

    const prompt = `You are a resume writing assistant. Improve the following job description bullet points.
Rewrite them to sound polished, results-oriented, and ATS-friendly.
Keep them truthful and concise.
Return valid JSON only in this exact shape:
{"bullets":["bullet 1","bullet 2","bullet 3"]}

Role: ${body.title || 'Not provided'}
Company: ${body.company || 'Not provided'}
Original bullets:
${Array.isArray(body.bullets) ? body.bullets.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') : body.bullets || 'Not provided'}`;

    const response = await ai.models.generateContent({
      model: getGeminiModel(),
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{"bullets":[]}');
    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to improve bullets.' }, { status: 500 });
  }
}
