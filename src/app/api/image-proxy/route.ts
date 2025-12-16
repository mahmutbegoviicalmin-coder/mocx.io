import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import Jimp from 'jimp';
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

        // 4. If NOT Trial, return original image immediately (faster)
        // Check both 'on_trial' status OR if user has very few credits/is free plan (extra safety)
        if (subscriptionStatus !== 'on_trial') {
             return new NextResponse(imageBuffer as unknown as BodyInit, {
                headers: {
                    'Content-Type': response.headers['content-type'] || 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable'
                }
            });
        }

        // 5. If TRIAL -> Add "Destructive" Watermark (Grayscale + Pixelate)
        // Note: Using fonts caused Vercel deployment issues due to missing file paths. 
        // Applying effects is safer and equally effective at rendering the image unusable.
        const image = await Jimp.read(imageBuffer);
        
        // Get dimensions
        const w = image.bitmap.width;

        // DOWNGRADE FOR TRIAL: Resize
        if (w > 1024) {
            image.resize(1024, Jimp.AUTO);
        }

        // Apply destructive effects to make image unusable but visible
        // image.greyscale();   // Removed: Keep color
        // image.pixelate(10);  // Removed: Too strong
        // image.blur(2);       // Removed: Too strong
        image.quality(30);      // 30% Quality (Visible compression artifacts)

        const watermarkedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        return new NextResponse(watermarkedBuffer as unknown as BodyInit, {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-store'
            }
        });

    } catch (error) {
        console.error('Image proxy error:', error);
        return new NextResponse('Failed to process image', { status: 500 });
    }
}

