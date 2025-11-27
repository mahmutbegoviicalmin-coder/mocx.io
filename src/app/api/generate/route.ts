import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, imageUrls } = await request.json();
    
    const hasImage = imageUrls && imageUrls.length > 0 && imageUrls[0] !== '';
    
    // Determine payload based on input
    const payload = {
      prompt: prompt,
      numImages: 1,
      // If we have an image, switch to IMAGETOIAMGE (typo preserved from docs), else TEXTTOIAMGE
      type: hasImage ? "IMAGETOIAMGE" : "TEXTTOIAMGE",
      image_size: "16:9", 
      callBackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/nanobanana`,
      ...(hasImage && { imageUrls: imageUrls })
    };

    console.log('Sending payload to NanoBanana:', payload);

    const response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.msg || 'Failed to generate image');
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
