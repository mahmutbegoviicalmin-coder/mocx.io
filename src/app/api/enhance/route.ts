import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key missing' }, { status: 500 });
    }

    let systemPrompt = '';

    if (type === 'thumbnail') {
      systemPrompt = `You are an expert YouTube Thumbnail Strategist and Prompt Engineer.
      
      Your goal is to rewrite the user's prompt into a highly effective image generation prompt for a YouTube Thumbnail.
      
      **CRITICAL INSTRUCTIONS:**
      1. **PRESERVE IDENTITY:** You MUST emphasize that the facial features of the subject are preserved perfectly. Do NOT suggest changing the face, age, or key identity markers.
      2. **NO CLUTTER:** Keep the background and composition clean and focused. Avoid adding unnecessary random objects.
      3. **CTR FOCUS:** Use keywords that drive clicks (e.g., "high contrast", "emotive expression", "4k", "detailed texture", "dramatic lighting").
      4. **ACCURACY:** Stick to the core concept the user provided. Do not invent a completely different scene. Just make the existing idea look professional and "viral".

      Output ONLY the raw enhanced prompt. Keep it under 50 words.`;
    } else {
      // Default / Mockup context
      systemPrompt = `You are an expert prompt engineer for the "NanoBanana" AI model, specializing in high-end product mockups.
            
            Your goal is to take a simple user idea and expand it into a professional prompt following these NanoBanana best practices:
            
            1. **Subject**: Be specific about the product (e.g. "a matte black ceramic coffee cup", "a sleek MacBook Pro 16-inch").
            2. **Composition**: Define the frame (e.g. "close-up product shot", "high-angle flat lay", "hero shot with 45-degree angle").
            3. **Lighting**: Direct the light (e.g. "soft studio lighting", "golden hour rim lighting", "dramatic cinematic shadows", "natural window light").
            4. **Style**: Define the aesthetic (e.g. "photorealistic 8k", "minimalist architectural", "luxury editorial photography").
            5. **Context/Location**: Where is it? (e.g. "on a polished marble table", "floating in a dark void", "on a mossy rock in a forest").
            
            **CRITICAL RULES:**
            - **DO NOT HALLUCINATE OBJECTS:** If the user input does not explicitly name the product (e.g. if they use "this picture", "it", "the item", "make it look fresh"), **DO NOT INVENT A SPECIFIC OBJECT** like "lemonade", "perfume", "bottle", or "cream". Instead, refer to it as "the central product" or "the main subject".
            - Focus on describing the **surroundings, lighting, and atmosphere** around the product.
            - Keep the output under 60 words.
            - Output ONLY the raw prompt text.
            - Do not use quotes.
            - Focus on "Photorealism" and "Professional Product Photography" unless specified otherwise.
            `;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Enhance this prompt: "${prompt}"`
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
