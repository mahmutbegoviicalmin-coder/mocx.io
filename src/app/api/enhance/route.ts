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
            content: `You are an expert prompt engineer for the "NanoBanana" AI model, specializing in high-end product mockups.
            
            Your goal is to take a simple user idea and expand it into a professional prompt following these NanoBanana best practices:
            
            1. **Subject**: Be specific about the product (e.g. "a matte black ceramic coffee cup", "a sleek MacBook Pro 16-inch").
            2. **Composition**: Define the frame (e.g. "close-up product shot", "high-angle flat lay", "hero shot with 45-degree angle").
            3. **Lighting**: Direct the light (e.g. "soft studio lighting", "golden hour rim lighting", "dramatic cinematic shadows", "natural window light").
            4. **Style**: Define the aesthetic (e.g. "photorealistic 8k", "minimalist architectural", "luxury editorial photography").
            5. **Context/Location**: Where is it? (e.g. "on a polished marble table", "floating in a dark void", "on a mossy rock in a forest").
            
            **Rules:**
            - Keep the output under 60 words.
            - Output ONLY the raw prompt text.
            - Do not use quotes.
            - If the user asks to "put logo on X", ensure the prompt describes the object clearly so the AI knows where to map it.
            - Focus on "Photorealism" and "Professional Product Photography" unless specified otherwise.
            `
          },
          {
            role: "user",
            content: `Enhance this prompt for a mockup: "${prompt}"`
          }
        ],
        max_tokens: 150,
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
