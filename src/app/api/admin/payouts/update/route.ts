import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (userEmail !== ADMIN_EMAIL) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, status } = await request.json();

    if (!id || !['paid', 'declined'].includes(status)) {
        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await db.sql`
      UPDATE payout_requests 
      SET status = ${status} 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update payout error:', error);
    return NextResponse.json({ error: 'Failed to update payout' }, { status: 500 });
  }
}

