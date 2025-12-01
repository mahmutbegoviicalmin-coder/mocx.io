import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const privateMetadata = user.privateMetadata;

    return NextResponse.json({
      renewsAt: privateMetadata.renewsAt,
      endsAt: privateMetadata.endsAt,
      status: privateMetadata.status,
      customerPortalUrl: privateMetadata.customer_portal_url
    });
  } catch (error) {
    console.error('Failed to fetch subscription', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

