import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    
    // Set credits to 2 and Plan to "Starter Plan" for testing
    await client.users.updateUserMetadata(userId, {
        publicMetadata: {
            credits: 2,
            planName: 'Starter Plan'
        }
    });

    return NextResponse.json({ success: true, message: 'Credits reset to 2 for testing.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset credits' }, { status: 500 });
  }
}

