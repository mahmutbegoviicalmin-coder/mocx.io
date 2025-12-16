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

    const body = await request.json();
    let variantIdOrUrl = body.variantId;

    if (!variantIdOrUrl) {
        return NextResponse.json({ error: 'Plan identifier is required' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // CASE 1: It's a full URL (starts with http)
    if (String(variantIdOrUrl).startsWith('http')) {
        let checkoutUrl = variantIdOrUrl;
        const hasParams = checkoutUrl.includes('?');
        const separator = hasParams ? '&' : '?';
        
        // Append UI hiding params
        checkoutUrl += `${separator}checkout[custom][userId]=${userId}&checkout[email]=${encodeURIComponent(userEmail || '')}`;
        
        return NextResponse.json({ url: checkoutUrl });
    }

    // CASE 2: It's a Variant ID (number/string)
    if (!process.env.LEMONSQUEEZY_STORE_ID || !process.env.LEMONSQUEEZY_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

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
                    },
                    product_options: {
                        enabled_variants: [Number(variantIdOrUrl)], // THIS IS THE KEY! We only enable the selected variant.
                        redirect_url: 'https://mocx.io/dashboard',
                        receipt_button_text: 'Go to Dashboard',
                        receipt_thank_you_note: 'Thank you for subscribing to Mocx!'
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
                            id: String(variantIdOrUrl)
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
