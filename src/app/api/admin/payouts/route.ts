import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (userEmail !== ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { rows } = await db.sql`
      SELECT * FROM payout_requests ORDER BY created_at DESC
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Fetch payouts error:', error);
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}

