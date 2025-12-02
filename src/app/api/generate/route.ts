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
    
    // Default to 0 credits if undefined to prevent free usage
    const credits = user.publicMetadata.credits !== undefined ? (user.publicMetadata.credits as number) : 0;
    const planName = (user.publicMetadata.planName as string) || 'Free Plan';

    // Strict check: If Free Plan and no credits, block.
    // This matches the frontend "isLocked" logic.
    if (planName === 'Free Plan' && credits < 1) {
        return NextResponse.json({ error: 'Upgrade to a paid plan or top up credits to generate.' }, { status: 403 });
    }

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

    // Deduct 1 credit upon successful API call and track usage
    const currentUsage = (user.publicMetadata.imagesGenerated as number) || 0;
    
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            credits: credits - 1,
            imagesGenerated: currentUsage + 1
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
