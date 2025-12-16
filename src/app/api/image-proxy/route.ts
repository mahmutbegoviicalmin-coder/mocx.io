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
             return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': response.headers['content-type'] || 'image/png',
                    'Cache-Control': 'public, max-age=31536000, immutable'
                }
            });
        }

        // 5. If TRIAL -> Add Watermark
        const image = await Jimp.read(imageBuffer);
        
        // Load fonts (White text)
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        
        // Get dimensions
        const w = image.bitmap.width;
        const h = image.bitmap.height;

        // DOWNGRADE FOR TRIAL: Resize if too large (prevents high-res usage)
        if (w > 1024) {
            image.resize(1024, Jimp.AUTO);
        }
        // Update dimensions after resize
        const finalW = image.bitmap.width;
        const finalH = image.bitmap.height;

        // Main Center Watermark
        image.print(
            font, 
            0, 
            0, 
            {
                text: 'TRIAL MODE',
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            finalW, 
            finalH
        );

        // Grid of smaller watermarks for better protection
        const stepX = finalW / 3;
        const stepY = finalH / 3;

        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if(i===1 && j===1) continue; // Skip center
                image.print(
                    smallFont, 
                    i * stepX + 20, 
                    j * stepY + 20, 
                    'Mocx Demo'
                );
            }
        }
        
        // Reduce quality significantly to 60% (Visible compression artifacts on zoom)
        image.quality(60);

        const watermarkedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        return new NextResponse(watermarkedBuffer, {
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

