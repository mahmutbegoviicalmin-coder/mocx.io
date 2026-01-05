import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (email !== ADMIN_EMAIL) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || undefined;

    // Fetch users with pagination
    const userList = await client.users.getUserList({
      limit,
      offset,
      query: search,
      orderBy: '-created_at'
    });

    const users = userList.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses[0]?.emailAddress,
      firstName: u.firstName,
      lastName: u.lastName,
      imageUrl: u.imageUrl,
      lastSignInAt: u.lastSignInAt,
      createdAt: u.createdAt,
      publicMetadata: u.publicMetadata,
      privateMetadata: u.privateMetadata,
      // Attempt to infer location/IP if possible in future or via client-side enrichment
      lastActiveAt: u.lastActiveAt,
      // @ts-ignore - Clerk type might not have it explicitly but it's available in some versions
      location: (u as any).lastActiveSessionId ? null : null, 
    }));

    return NextResponse.json({
        users,
        totalCount: userList.totalCount
    });
  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
      const session = await auth();
      const userId = session.userId;
  
      if (!userId) return new NextResponse('Unauthorized', { status: 401 });
  
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses[0]?.emailAddress;
  
      if (email !== ADMIN_EMAIL) return new NextResponse('Forbidden', { status: 403 });
  
      const { targetUserId, action, value } = await req.json();
  
      if (!targetUserId || !action) {
          return new NextResponse('Missing fields', { status: 400 });
      }
  
      if (action === 'update_credits') {
          await client.users.updateUserMetadata(targetUserId, {
              publicMetadata: { credits: Number(value) }
          });
      } else if (action === 'update_plan') {
          await client.users.updateUserMetadata(targetUserId, {
              publicMetadata: { planName: String(value) }
          });
      } else {
          return new NextResponse('Invalid action', { status: 400 });
      }
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('[ADMIN_USERS_PATCH]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }

export async function DELETE(req: Request) {
    try {
      const session = await auth();
      const userId = session.userId;
  
      if (!userId) return new NextResponse('Unauthorized', { status: 401 });
  
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses[0]?.emailAddress;
  
      if (email !== ADMIN_EMAIL) return new NextResponse('Forbidden', { status: 403 });
  
      const { targetUserId } = await req.json();

      if (!targetUserId) {
          return new NextResponse('Missing targetUserId', { status: 400 });
      }

      await client.users.deleteUser(targetUserId);
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('[ADMIN_USERS_DELETE]', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
}
