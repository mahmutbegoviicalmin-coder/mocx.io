import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
// import Jimp from 'jimp'; // Removed
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    // 1. Auth Check
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Check User Status
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const subscriptionStatus = user.publicMetadata.subscriptionStatus as string | undefined;
        
        // 3. Fetch Image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // ALWAYS return original image (Frontend handles watermark & download protection)
        return new NextResponse(imageBuffer as unknown as BodyInit, {
            headers: {
                'Content-Type': response.headers['content-type'] || 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        });

        /* DEPRECATED DESTRUCTIVE LOGIC
        // 4. If NOT Trial, return original image immediately (faster)
        if (subscriptionStatus !== 'on_trial') { ... }
        // ... Jimp logic ...
        */

    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Failed to process image', { status: 500 });
    }
}

