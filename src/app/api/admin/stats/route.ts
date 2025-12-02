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

    // 3. Fetch NanoBanana API Balance
    let apiBalance = null;
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
                
                if (balanceData.code === 200 && balanceData.data !== undefined) {
                    apiBalance = balanceData.data;
                }
            }
        } catch (e) {
            console.error('Failed to fetch NanoBanana balance', e);
        }
    }

    // 4. Calculate Plan Counts
    // Fetching up to 500 users to calculate stats. For larger scale, this should be indexed or cached.
    const userList = await client.users.getUserList({ limit: 500 });
    
    const planCounts = {
        starter: 0,
        pro: 0,
        agency: 0,
        free: 0
    };

    userList.data.forEach(u => {
        const plan = (String(u.publicMetadata.planName) || 'Free Plan').toLowerCase();
        
        if (plan.includes('starter') || plan.includes('mocx')) {
            planCounts.starter++;
        } else if (plan.includes('pro')) {
            planCounts.pro++;
        } else if (plan.includes('agency')) {
            planCounts.agency++;
        } else {
            planCounts.free++;
        }
    });

    return NextResponse.json({
        totalUsers,
        totalRevenue,
        planCounts,
        apiBalance
    });
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
