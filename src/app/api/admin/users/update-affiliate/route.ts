import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function POST(req: Request) {
  try {
    const { userId: adminUserId } = await auth();
    if (!adminUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const client = await clerkClient();
    const adminUser = await client.users.getUser(adminUserId);
    const adminEmail = adminUser.emailAddresses[0]?.emailAddress;

    if (adminEmail !== ADMIN_EMAIL) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { targetUserId, stats } = await req.json();

    if (!targetUserId || !stats) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Update user metadata
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        affiliateStats: stats
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_UPDATE_AFFILIATE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


