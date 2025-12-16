import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

async function assertAdmin() {
  const { userId } = await auth();
  if (!userId) return { ok: false as const, res: new NextResponse('Unauthorized', { status: 401 }) };

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  if (email !== ADMIN_EMAIL) return { ok: false as const, res: new NextResponse('Forbidden', { status: 403 }) };

  return { ok: true as const, userId };
}

export async function GET() {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.res;

  try {
    const { rows } = await db.sql`
      SELECT id, title, body, created_by_user_id, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[ADMIN_NOTIFICATIONS_GET]', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const admin = await assertAdmin();
  if (!admin.ok) return admin.res;

  try {
    const { title, body } = await request.json();
    if (!title || !body) return NextResponse.json({ error: 'title and body are required' }, { status: 400 });

    const { rows } = await db.sql`
      INSERT INTO notifications (title, body, created_by_user_id)
      VALUES (${title}, ${body}, ${admin.userId})
      RETURNING id, title, body, created_by_user_id, created_at
    `;

    return NextResponse.json({ success: true, notification: rows[0] });
  } catch (error) {
    console.error('[ADMIN_NOTIFICATIONS_POST]', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}


