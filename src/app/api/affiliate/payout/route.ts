import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if today is the 1st of the month
    const today = new Date();
    if (today.getDate() !== 1) {
        return NextResponse.json({ error: 'Payout requests are only allowed on the 1st of each month.' }, { status: 403 });
    }

    const { amount, method, details } = await request.json();

    if (!amount || !method || !details) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Convert details object to JSON string if it's not already
    const detailsString = typeof details === 'string' ? details : JSON.stringify(details);

    await db.sql`
      INSERT INTO payout_requests (user_id, user_email, amount, method, details, status)
      VALUES (${userId}, ${userEmail}, ${String(amount)}, ${method}, ${detailsString}, 'pending')
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payout request error:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}

