import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'stefanpusicic27@gmail.com',
  'stefanpusicic27@protonmail.com'
];

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    // Normalize emails for comparison
    const normalizedUserEmail = email?.toLowerCase().trim();
    const isAllowed = ALLOWED_EMAILS.some(allowed => allowed.toLowerCase().trim() === normalizedUserEmail);

    if (!isAllowed) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    // 1. Fetch Earnings from Lemon Squeezy (Last 100 orders sum)
    let totalRevenue = 0;
    if (process.env.LEMONSQUEEZY_API_KEY) {
        try {
            const ordersRes = await fetch('https://api.lemonsqueezy.com/v1/orders?page[size]=100', {
                headers: { 
                    'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`, 
                    'Accept': 'application/vnd.api+json' 
                }
            });
            
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                // Total is in cents
                totalRevenue = ordersData.data.reduce((acc: number, order: any) => acc + order.attributes.total, 0) / 100;
            }
        } catch (e) {
            console.error('Failed to fetch LS revenue', e);
        }
    }
    
    // 2. Calculate Plan Counts
    const userList = await client.users.getUserList({ limit: 500 });
    
    const planCounts = {
        starter: 0,
        pro: 0,
        agency: 0,
        free: 0
    };

    userList.data.forEach(u => {
        let plan = (String(u.publicMetadata.planName) || 'Free Plan');
        
        // Normalize backend side as well
        if (plan.includes('Mocx')) {
            if (plan.toLowerCase().includes('pro')) plan = 'Pro';
            else if (plan.toLowerCase().includes('agency')) plan = 'Agency';
            else if (plan.toLowerCase().includes('starter')) plan = 'Starter';
            else plan = plan.replace('Mocx', '').trim() || 'Starter';
        }
        if (plan.includes('Starter') && plan.includes('Pro')) plan = 'Pro';
        if (plan.includes('Starter') && plan.includes('Agency')) plan = 'Agency';

        const planLower = plan.toLowerCase();

        if (planLower.includes('pro')) {
            planCounts.pro++;
        } else if (planLower.includes('agency')) {
            planCounts.agency++;
        } else if (planLower.includes('starter')) {
            planCounts.starter++;
        } else {
            planCounts.free++;
        }
    });

    // Calculate 15% commission
    const affiliateEarnings = totalRevenue * 0.15;

    return NextResponse.json({
        totalRevenue,
        affiliateEarnings,
        planCounts
    });
  } catch (error) {
    console.error('[AFFILIATE_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

