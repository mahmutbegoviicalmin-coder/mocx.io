import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { rows } = await db.sql`
      SELECT
        n.id,
        n.title,
        n.body,
        n.created_at,
        un.read_at,
        un.deleted
      FROM notifications n
      LEFT JOIN user_notifications un
        ON un.notification_id = n.id AND un.user_id = ${userId}
      WHERE (un.deleted IS FALSE OR un.deleted IS NULL)
      ORDER BY n.created_at DESC
      LIMIT 50;
    `;

    const unreadCount = rows.reduce((acc: number, r: any) => (r.read_at ? acc : acc + 1), 0);

    return NextResponse.json({
      unreadCount,
      notifications: rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        createdAt: r.created_at,
        readAt: r.read_at,
        isRead: !!r.read_at,
      })),
    });
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error);
    return NextResponse.json({ unreadCount: 0, notifications: [] });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const body = await request.json();
    const action = body?.action as string | undefined;

    if (action === 'markAllRead') {
      await db.sql`
        INSERT INTO user_notifications (user_id, notification_id, read_at)
        SELECT ${userId}, n.id, NOW()
        FROM notifications n
        LEFT JOIN user_notifications un
          ON un.notification_id = n.id AND un.user_id = ${userId}
        WHERE un.id IS NULL
      `;
      return NextResponse.json({ success: true });
    }

    const notificationId = Number(body?.notificationId);
    if (!notificationId) return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });

    await db.sql`
      INSERT INTO user_notifications (user_id, notification_id, read_at)
      VALUES (${userId}, ${notificationId}, NOW())
      ON CONFLICT (user_id, notification_id)
      DO UPDATE SET read_at = EXCLUDED.read_at
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATIONS_POST]', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(request.url);
    const notificationId = Number(searchParams.get('id'));

    if (!notificationId) return NextResponse.json({ error: 'id required' }, { status: 400 });

    // Mark as deleted for this user
    await db.sql`
      INSERT INTO user_notifications (user_id, notification_id, read_at, deleted)
      VALUES (${userId}, ${notificationId}, NOW(), TRUE)
      ON CONFLICT (user_id, notification_id)
      DO UPDATE SET deleted = TRUE
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATIONS_DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}


