import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const text = await request.text();
    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '');
    const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
    const signature = Buffer.from(request.headers.get('x-signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(text);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const customData = meta.custom_data || data.attributes.checkout_data?.custom;
    const userId = customData?.userId;

    console.log(`Received Lemon Squeezy event: ${eventName}`, { userId });

    if (!userId) {
        // If we don't have a userId, we can't link it to a user. 
        // Note: Sometimes we might want to look up by email if userId is missing.
        const email = data.attributes.user_email;
        if (!email) {
             return NextResponse.json({ message: 'No user ID or email found' }, { status: 200 });
        }
        // TODO: specific logic to find user by email if needed, but custom_data is preferred
    }

    const client = await clerkClient();

    if (eventName === 'order_created' || eventName === 'subscription_created') {
      // Grant access
      // We can store the subscription ID, status, and plan info
      const attributes = data.attributes;
      const subscriptionId = data.id; // For subscription_created, this is the sub ID. For order_created, it's order ID.
      // Note: For subscriptions, we care about 'subscription_created'. 'order_created' also fires but we might prefer the sub one.
      
      if (userId) {
          await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              subscriptionId: subscriptionId,
              status: attributes.status, // e.g. 'active'
              variantId: attributes.variant_id,
              renewsAt: attributes.renews_at,
              endsAt: attributes.ends_at,
              planName: attributes.product_name || 'Unknown Plan' // You might want to map variant_id to a cleaner name
            }
          });
      }
    } else if (eventName === 'subscription_updated') {
      // Update status (e.g. active -> past_due, or plan change)
      const attributes = data.attributes;
      if (userId) {
        await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              status: attributes.status,
              variantId: attributes.variant_id,
              renewsAt: attributes.renews_at,
              endsAt: attributes.ends_at,
            }
          });
      }
    } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
       // Revoke access or mark as cancelled
       // If cancelled, they might still have access until ends_at
       const attributes = data.attributes;
       if (userId) {
        await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              status: attributes.status, // 'cancelled' or 'expired'
              endsAt: attributes.ends_at,
            }
          });
       }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

