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

    const { variantId } = await request.json();

    if (!variantId) {
        return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 });
    }

    if (!process.env.LEMONSQUEEZY_STORE_ID || !process.env.LEMONSQUEEZY_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Create Checkout via Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        body: JSON.stringify({
            data: {
                type: "checkouts",
                attributes: {
                    checkout_data: {
                        custom: {
                            userId: userId
                        },
                        email: userEmail
                    }
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: process.env.LEMONSQUEEZY_STORE_ID
                        }
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: String(variantId) // Ensure string
                        }
                    }
                }
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Lemon Squeezy Checkout Error:', JSON.stringify(data, null, 2));
        return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
    }

    const checkoutUrl = data.data?.attributes?.url;

    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
