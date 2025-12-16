import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const privateMetadata = user.privateMetadata;

    return NextResponse.json({
      renewsAt: privateMetadata.renewsAt,
      endsAt: privateMetadata.endsAt,
      status: privateMetadata.status,
      customerPortalUrl: privateMetadata.customer_portal_url
    });
  } catch (error) {
    console.error('Failed to fetch subscription', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variantId } = await request.json(); // Note: In the frontend, we are passing the Checkout URL as 'variantId'

    if (!variantId) {
        return NextResponse.json({ error: 'Plan URL is required' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Construct the checkout URL with user data parameters
    // We use the provided URL (which is specific to a variant) and append user info
    let checkoutUrl = variantId;
    
    // Check if URL already has query params
    const hasParams = checkoutUrl.includes('?');
    const separator = hasParams ? '&' : '?';

    // Append custom data for webhook processing and prefill email
    // checkout[custom][userId] -> passes userId to webhook
    // checkout[email] -> prefills user email
    checkoutUrl += `${separator}checkout[custom][userId]=${userId}&checkout[email]=${encodeURIComponent(userEmail || '')}`;

    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
