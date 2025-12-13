import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function GET() {
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

    // Fetch all users (limit to 100 for now)
    const userList = await client.users.getUserList({
      limit: 100,
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
    }));

    return NextResponse.json(users);
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
