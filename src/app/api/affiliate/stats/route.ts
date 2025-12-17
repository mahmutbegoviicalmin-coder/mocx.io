import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db/sql';
import { referrals } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { drizzleDb } from '@/db/sql';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'stefanpusicic27@gmail.com',
  'stefanpusicic27@protonmail.com'
];

// Define Stefan's emails specifically
const STEFAN_EMAILS = [
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

    let starterCount = Number(stats.starter) || 0;
    let proCount = Number(stats.pro) || 0;
    let agencyCount = Number(stats.agency) || 0;
    let freeCount = Number(stats.free) || 0;

    // --- REALTIME LOGIC FOR STEFAN ---
    const isStefan = STEFAN_EMAILS.includes(normalizedUserEmail || '');
    
    if (isStefan) {
        try {
            // Count ALL users globally who are on 'Free Plan' or have no planName
            // Since we are moving away from Clerk Metadata for heavy queries, 
            // and we don't have a local users table synced perfectly, 
            // we will use Clerk API to get the total count if possible, 
            // OR if you want a rough estimate from local DB if you had one.
            
            // BETTER APPROACH: Since we can't query Clerk metadata easily for counts without listing all users,
            // we will assume 'Total Users in Clerk' - 'Paid Users (Manual Counts)'.
            
            // Actually, Clerk's getCount() returns total user count.
            const totalUsersCount = await client.users.getCount();
            
            // Subtract manual paid counts to estimate Free users
            // This is a good approximation since everyone starts as Free.
            freeCount = totalUsersCount - (starterCount + proCount + agencyCount);
            
            if (freeCount < 0) freeCount = 0;

        } catch (e) {
            console.error('Failed to fetch realtime stats for Stefan', e);
        }
    }
    // ---------------------------------

    // 3. Calculate Revenue based on manual counts (Stefan's revenue is still manual for paid plans)
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
