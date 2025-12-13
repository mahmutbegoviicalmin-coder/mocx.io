import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { message, type = 'bug' } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let userEmail = 'anonymous';
    if (userId) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        userEmail = user.emailAddresses[0]?.emailAddress || 'unknown';
    }

    // Insert into DB
    await db.sql`
      INSERT INTO feedback (user_id, user_email, message, type)
      VALUES (${userId || 'anon'}, ${userEmail}, ${message}, ${type})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
