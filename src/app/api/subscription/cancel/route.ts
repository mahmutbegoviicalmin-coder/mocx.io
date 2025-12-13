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
    const subscriptionId = user.privateMetadata.subscriptionId;

    if (!subscriptionId) {
        return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    if (!process.env.LEMONSQUEEZY_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Call Lemon Squeezy API to cancel subscription
    const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Lemon Squeezy Cancel Error:', errorData);
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: response.status });
    }

    const data = await response.json();

    // Update local metadata to reflect cancellation (pending end of period)
    await client.users.updateUserMetadata(userId, {
        privateMetadata: {
            status: 'cancelled', // Mark as cancelled immediately in UI
            endsAt: data.data?.attributes?.ends_at // Keep the end date
        }
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Subscription cancelled successfully',
        endsAt: data.data?.attributes?.ends_at
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

