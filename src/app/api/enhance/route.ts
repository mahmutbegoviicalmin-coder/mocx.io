import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key missing' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Fast and cheap, good for this
        messages: [
          {
            role: "system",
            content: "You are an expert prompt engineer for AI image generation (specifically for product mockups). Rewrite the user's prompt to be more descriptive, photorealistic, and professional. Focus on lighting (e.g. 'soft studio lighting', 'cinematic'), textures, and composition. Keep it under 40 words. Output ONLY the raw enhanced prompt text, no quotes or explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      throw new Error(data.error?.message || 'Failed to enhance prompt');
    }

    const enhancedPrompt = data.choices[0]?.message?.content?.trim();

    return NextResponse.json({ enhancedPrompt });
  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
}

