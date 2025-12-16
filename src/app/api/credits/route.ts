import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { CREDIT_PACKS } from '@/config/credits';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    const credits = user.publicMetadata.credits !== undefined ? (user.publicMetadata.credits as number) : 0;

    return NextResponse.json({ data: credits });
  } catch (error) {
    console.error('Credit check error:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packId } = await request.json();
    const pack = CREDIT_PACKS.find(p => p.id === packId);

    if (!pack || !pack.variantId) {
        return NextResponse.json({ error: 'Invalid pack ID' }, { status: 400 });
    }

    if (!process.env.LEMONSQUEEZY_STORE_ID || !process.env.LEMONSQUEEZY_API_KEY) {
        console.error('Missing Lemon Squeezy env vars');
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
                            userId: String(userId),
                            credits: String(pack.credits),
                            packId: String(pack.id)
                        },
                        email: userEmail
                    },
                    product_options: {
                        enabled_variants: [Number(pack.variantId)], // Only enable this credit pack
                        redirect_url: 'https://mocx.io/dashboard',
                        receipt_button_text: 'Go to Dashboard',
                        receipt_thank_you_note: 'Thank you for purchasing credits!'
                    }
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: String(process.env.LEMONSQUEEZY_STORE_ID)
                        }
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: String(pack.variantId)
                        }
                    }
                }
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error('Lemon Squeezy Checkout Error:', JSON.stringify(data, null, 2));
        const errorMessage = data.errors?.[0]?.detail || 'Failed to create checkout';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const checkoutUrl = data.data?.attributes?.url;

    return NextResponse.json({ url: checkoutUrl });

  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
