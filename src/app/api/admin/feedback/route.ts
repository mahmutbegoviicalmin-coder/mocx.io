import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

const ALLOWED_EMAILS = [
  'mahmutbegoviic.almin@gmail.com',
  'dragomijatovic141@gmail.com'
];

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!ALLOWED_EMAILS.includes(email)) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { rows } = await db.sql`SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50`;

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Admin feedback error:', error);
    // Return empty array if table doesn't exist yet
    return NextResponse.json([]);
  }
}


