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
    
    const { prompt, imageUrls, aspectRatio, mode } = await request.json();

    // Default to 0 credits if undefined to prevent free usage
    const credits = user.publicMetadata.credits !== undefined ? (user.publicMetadata.credits as number) : 0;
    const planName = (user.publicMetadata.planName as string) || 'Free Plan';

    // Determine Cost
    const COST = mode === 'thumbnail' ? 5 : 1;

    // Strict check: If Free Plan and no credits, block.
    if (planName === 'Free Plan' && credits < 1) {
        return NextResponse.json({ error: 'Upgrade to a paid plan or top up credits to generate.' }, { status: 403 });
    }

    // Check Balance
    if (credits < COST) {
        return NextResponse.json({ error: `Insufficient credits. This action requires ${COST} credits.` }, { status: 403 });
    }

    // Check Plan Restriction for Thumbnail Mode
    if (mode === 'thumbnail') {
        const isPro = planName.toLowerCase().includes('pro') || planName.toLowerCase().includes('agency');
        if (!isPro) {
             return NextResponse.json({ error: 'Thumbnail Recreator is exclusively available for Pro and Agency plans.' }, { status: 403 });
        }
    }

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

    let response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    let data = await response.json();

    // RETRY LOGIC: If we get a specific internal error, try once more
    if (!response.ok || (data.code && data.code !== 200)) {
        const errorMsg = JSON.stringify(data).toLowerCase();
        // Check for known "flakey" errors like Director, Timeout, or generic internal server errors
        if (errorMsg.includes('director') || errorMsg.includes('prediction') || response.status >= 500) {
            console.warn('First attempt failed with internal error, retrying in 2s...', data);
            
            // Wait 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Retry the exact same request
            response = await fetch('https://api.nanobananaapi.ai/api/v1/nanobanana/generate-pro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
                },
                body: JSON.stringify(payload),
            });
            
            data = await response.json();
            console.log('Retry Response:', data);
        }
    }

    console.log('NanoBanana Pro Response:', data);

    if (!response.ok || (data.code && data.code !== 200)) {
      console.error('API Error Response:', data);
      
      // Extract friendly error message if possible
      let errorMessage = data.message || data.msg || data.error || 'Failed to start generation';
      
      // Handle specific "Director" errors which are internal AI model errors
      if (errorMessage.includes('Director:')) {
          errorMessage = 'AI Model Error: The image could not be generated with this specific prompt/image combination. Please try a slightly different prompt or image.';
      }

      return NextResponse.json(
          { error: errorMessage, details: data }, 
          { status: 400 }
      );
    }

    // Deduct credits upon successful API call and track usage
    const currentUsage = (user.publicMetadata.imagesGenerated as number) || 0;
    
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            credits: credits - COST,
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
