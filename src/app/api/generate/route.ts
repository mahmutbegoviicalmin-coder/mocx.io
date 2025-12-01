import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    // Default to 2 credits if undefined ("po defaultu 2 kredita")
    const credits = user.publicMetadata.credits !== undefined ? (user.publicMetadata.credits as number) : 2;

    if (credits < 1) {
        return NextResponse.json({ error: 'Insufficient credits. Please top up.' }, { status: 403 });
    }

    const { prompt, imageUrls, aspectRatio } = await request.json();
    
    if (!process.env.NANOBANANA_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    const hasImage = imageUrls && imageUrls.length > 0 && imageUrls[0] !== '';

    // Docs: /api/v1/nanobanana/generate-pro
    const payload = {
      prompt: prompt,
      // Pro endpoint uses 'aspectRatio'
      aspectRatio: aspectRatio || "16:9", // Default to 16:9 if not provided
      resolution: "2K", 
      callBackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://mocx.io'}/api/webhook/nanobanana`,
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

    // Deduct 1 credit upon successful API call
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            credits: credits - 1
        }
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to process generation request' },
      { status: 500 }
    );
  }
}
