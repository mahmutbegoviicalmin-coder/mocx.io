import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { clerkClient } from '@clerk/nextjs/server';
import { CREDIT_PACKS } from '@/config/credits';
import { PLANS } from '@/config/plans';

// Helper to get Plan Name from Variant ID
const getPlanNameFromVariantId = (variantId: string | number) => {
  const vId = String(variantId);
  if (vId === String(PLANS.starter.monthly) || vId === String(PLANS.starter.yearly)) return 'Starter';
  if (vId === String(PLANS.pro.monthly) || vId === String(PLANS.pro.yearly)) return 'Pro';
  if (vId === String(PLANS.agency.monthly) || vId === String(PLANS.agency.yearly)) return 'Agency';
  return null;
};

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
    let userId = customData?.userId;

    console.log(`Received Lemon Squeezy event: ${eventName}`, { userId });

    const client = await clerkClient();

    // Auth First flow: We expect userId to be present in custom_data
    if (!userId) {
        console.log('Webhook received without userId in custom_data. Ignoring as per Auth First flow.');
        return NextResponse.json({ received: true, status: 'ignored_no_userid' });
    }

    if (eventName === 'order_created' || eventName === 'subscription_created') {
      const attributes = data.attributes;
      
      // Check if it's a credit pack purchase (order_created only, usually)
      // We check the first order item's variant_id
      const firstOrderItem = attributes.first_order_item;
      const variantId = firstOrderItem?.variant_id;
      
      const creditPack = CREDIT_PACKS.find(p => p.variantId === variantId);

      if (creditPack && userId) {
          // It's a credit pack purchase!
          console.log(`Credit pack purchased: ${creditPack.name} for user ${userId}`);
          
          // Fetch current credits to add to them
          const user = await client.users.getUser(userId);
          const currentCredits = (user.publicMetadata.credits as number) || 0;
          const newCredits = currentCredits + creditPack.credits;
          
          await client.users.updateUserMetadata(userId, {
             publicMetadata: {
                 credits: newCredits
             }
          });
          
          return NextResponse.json({ received: true, type: 'credit_pack' });
      }

      // If not a credit pack, assume it's a subscription (grant access)
      const subscriptionId = data.id;
      
      // Determine Plan Name strictly from Variant ID first, then fallback to variant_name
      const subscriptionVariantId = attributes.variant_id;
      const detectedPlanName = getPlanNameFromVariantId(subscriptionVariantId);
      
      const planName = detectedPlanName || attributes.variant_name || attributes.product_name || 'Unknown Plan';

      // Get customer portal URL if available (usually in data.attributes.urls.customer_portal)
      const customerPortalUrl = attributes.urls?.customer_portal;
      
      // Determine credits based on plan
      let credits = 100;
      if (planName.toLowerCase().includes('starter')) credits = 50;
      else if (planName.toLowerCase().includes('pro')) credits = 300;
      else if (planName.toLowerCase().includes('agency')) credits = 500;
      
      if (userId) {
          await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              subscriptionId: subscriptionId,
              status: attributes.status,
              variantId: attributes.variant_id,
              renewsAt: attributes.renews_at,
              endsAt: attributes.ends_at,
              customer_portal_url: customerPortalUrl,
              planName: planName
            },
            publicMetadata: {
              planName: planName,
              credits: credits
            }
          });
      }
    } else if (eventName === 'subscription_updated') {
      // Update status
      const attributes = data.attributes;
      const customerPortalUrl = attributes.urls?.customer_portal;
      
      if (userId) {
        await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              status: attributes.status,
              variantId: attributes.variant_id,
              renewsAt: attributes.renews_at,
              endsAt: attributes.ends_at,
              customer_portal_url: customerPortalUrl,
            }
          });
      }
    } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
       // Revoke access plan but KEEP remaining credits
       // User becomes Free Plan but can use leftover credits until they run out
       const attributes = data.attributes;
       if (userId) {
        await client.users.updateUserMetadata(userId, {
            privateMetadata: {
              status: attributes.status, // 'cancelled' or 'expired'
              endsAt: attributes.ends_at,
            },
            publicMetadata: {
              planName: 'Free Plan', // Revert to free
              // We do NOT reset credits to 0 here. 
              // Existing credits persist and user can use them until 0.
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
