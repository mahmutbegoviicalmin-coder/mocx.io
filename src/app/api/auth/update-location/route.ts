import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get country from request header (passed from middleware/client)
    const { country } = await req.json();

    if (!country) {
      return new NextResponse('Missing country', { status: 400 });
    }

    const client = await clerkClient();
    
    // Check if user already has location set to avoid unnecessary updates
    const user = await client.users.getUser(userId);
    if (user.publicMetadata.country === country) {
        return NextResponse.json({ success: true, message: 'Already up to date' });
    }

    // Update user metadata with country
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        country: country
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPDATE_LOCATION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

