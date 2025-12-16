import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db/sql';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'stefanpusicic27@gmail.com',
  'stefanpusicic27@protonmail.com'
];

export const dynamic = 'force-dynamic';

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

    // 1. Fetch Total Paid Out
    let totalPaidOut = 0;
    try {
        const { rows } = await db.sql`
            SELECT SUM(amount::numeric) as total 
            FROM payout_requests 
            WHERE status = 'paid' AND user_id = ${userId}
        `;
        if (rows[0]?.total) {
            totalPaidOut = parseFloat(rows[0].total);
        }
    } catch (e) {
        console.error('Failed to fetch payouts', e);
    }
    
    // 2. Get Manual Stats from Metadata
    const stats = (user.publicMetadata.affiliateStats as any) || {
        starter: 0,
        pro: 0,
        agency: 0,
        free: 0
    };

    const starterCount = Number(stats.starter) || 0;
    const proCount = Number(stats.pro) || 0;
    const agencyCount = Number(stats.agency) || 0;
    const freeCount = Number(stats.free) || 0;

    // 3. Calculate Revenue based on manual counts
    // Prices: Starter $19, Pro $39, Agency $79
    const totalRevenue = (starterCount * 19) + (proCount * 39) + (agencyCount * 79);

    // 4. Calculate Earnings (15%)
    const commission = totalRevenue * 0.15;
    const affiliateEarnings = Math.max(0, commission - totalPaidOut);

    return NextResponse.json({
        totalRevenue, // This is "sales volume"
        affiliateEarnings, // This is what they can withdraw
        planCounts: {
            starter: starterCount,
            pro: proCount,
            agency: agencyCount,
            free: freeCount
        }
    });
  } catch (error) {
    console.error('[AFFILIATE_STATS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
