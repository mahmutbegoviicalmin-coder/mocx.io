import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, imageUrls } = await request.json();
    
    if (!process.env.NANOBANANA_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    const hasImage = imageUrls && imageUrls.length > 0 && imageUrls[0] !== '';

    // Using the PRO endpoint which seems more robust and has different params
    // Docs: /api/v1/nanobanana/generate-pro
    const payload = {
      prompt: prompt,
      // Pro endpoint uses 'aspectRatio' instead of 'image_size'
      aspectRatio: "16:9", 
      // Pro endpoint uses 'resolution'
      resolution: "2K", 
      callBackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mocx.io'}/api/webhook/nanobanana`,
      // Only include imageUrls if present
      ...(hasImage && { imageUrls: imageUrls })
    };

    console.log('Sending payload to NanoBanana Pro:', payload);

    const response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('NanoBanana Pro Response:', data);

    if (!response.ok || (data.code && data.code !== 200)) {
      console.error('API Error Response:', data);
      return NextResponse.json(
          { error: data.message || data.msg || 'Failed to start generation', details: data }, 
          { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to process generation request' },
      { status: 500 }
    );
  }
}
