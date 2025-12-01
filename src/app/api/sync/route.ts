import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

// This is a manual sync tool to fix accounts that missed the webhook
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail || !process.env.LEMONSQUEEZY_API_KEY) {
        return NextResponse.json({ error: 'Configuration error or missing email' }, { status: 500 });
    }

    console.log(`Syncing subscription for ${userEmail}...`);

    // 1. Fetch Subscriptions from Lemon Squeezy
    const response = await fetch(`https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${userEmail}&include=variant`, {
        headers: {
            'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
            'Accept': 'application/vnd.api+json'
        }
    });

    if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch from Lemon Squeezy' }, { status: 500 });
    }

    const data = await response.json();
    
    // Find the first active subscription
    const activeSub = data.data?.find((sub: any) => 
        ['active', 'on_trial'].includes(sub.attributes.status)
    );

    if (!activeSub) {
        // No active subscription found -> Set to Free Plan / 0 Credits
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                planName: 'Free Plan',
                credits: 0
            }
        });
        return NextResponse.json({ message: 'No active subscription found. Reset to Free Plan.' });
    }

    // 2. Determine Credits based on Product Name
    const productName = activeSub.attributes.product_name || 'Unknown Plan';
    let credits = 0;

    // Logic must match your requirements: Starter=100, Pro=300, Agency=500
    if (productName.toLowerCase().includes('starter')) credits = 100;
    else if (productName.toLowerCase().includes('pro')) credits = 300;
    else if (productName.toLowerCase().includes('agency')) credits = 500;

    // 3. Update Clerk Metadata
    await client.users.updateUserMetadata(userId, {
        privateMetadata: {
            subscriptionId: activeSub.id,
            status: activeSub.attributes.status,
            variantId: activeSub.attributes.variant_id,
            renewsAt: activeSub.attributes.renews_at,
            endsAt: activeSub.attributes.ends_at,
            planName: productName
        },
        publicMetadata: {
            planName: productName, // This will show "Starter Plan" etc.
            credits: credits       // This will show 100, 300, or 500
        }
    });

    return NextResponse.json({ 
        success: true, 
        message: `Synced successfully! Plan: ${productName}, Credits: ${credits}` 
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

