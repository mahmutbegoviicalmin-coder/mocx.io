import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function GET() {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (email !== ADMIN_EMAIL) return new NextResponse('Forbidden', { status: 403 });

    // 1. Fetch Total Users
    const totalUsers = await client.users.getCount();

    // 2. Fetch Earnings from Lemon Squeezy (Last 100 orders sum)
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

    // 3. Fetch NanoBanana API Balance & Calculate Costs
    let apiBalance = null;
    let totalCost = 0;

    if (process.env.NANOBANANA_API_KEY) {
        try {
            // Attempt to fetch user info/balance
            const balanceRes = await fetch('https://api.nanobananaapi.ai/api/v1/common/credit', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`, 
                    'Content-Type': 'application/json' 
                }
            });
            
            if (balanceRes.ok) {
                const balanceData = await balanceRes.json();
                console.log('NanoBanana Balance Data:', balanceData);
                
                // Check correct path to credit value based on API docs or response
                // Assuming data.data or data.credit based on previous logs
                if (balanceData.data?.credit !== undefined) {
                    apiBalance = balanceData.data.credit;
                } else if (typeof balanceData.data === 'number') {
                    apiBalance = balanceData.data;
                } else if (balanceData.credit !== undefined) {
                    apiBalance = balanceData.credit;
                }
            }
        } catch (e) {
            console.error('Failed to fetch NanoBanana balance', e);
        }
    }
    
    // Calculate estimated cost based on total images generated
    // Cost per image is approx $0.09 (based on $5/1000 credits package where 1 image = 18 credits)
    const COST_PER_IMAGE = 0.09;
    
    const userList = await client.users.getUserList({ limit: 500 });
    
    let totalImagesGenerated = 0;
    
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

        const generated = Number(u.publicMetadata.imagesGenerated) || 0;
        totalImagesGenerated += generated;

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

    totalCost = totalImagesGenerated * COST_PER_IMAGE;

    return NextResponse.json({
        totalUsers,
        totalRevenue,
        planCounts,
        apiBalance,
        totalCost,
        totalImagesGenerated
    });
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
