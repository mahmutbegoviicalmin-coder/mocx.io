import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const adminUser = await client.users.getUser(userId);
    const email = adminUser.emailAddresses[0]?.emailAddress;

    if (email !== ADMIN_EMAIL) {
        return new NextResponse('Forbidden', { status: 403 });
    }

    const { amount, action } = await req.json(); // action: 'add' | 'set'

    if (typeof amount !== 'number') {
        return NextResponse.json({ error: 'Amount must be a number' }, { status: 400 });
    }

    // Fetch ALL users (limit 500 max per call)
    // For now assuming < 500 users. If more, need pagination loop.
    const users = await client.users.getUserList({ limit: 500 });
    const userList = users.data;

    let updatedCount = 0;

    for (const user of userList) {
        const currentCredits = (user.publicMetadata.credits as number) || 0;
        let newCredits = 0;

        if (action === 'set') {
            newCredits = amount;
        } else if (action === 'add') {
            newCredits = currentCredits + amount;
        }

        // Prevent negative
        if (newCredits < 0) newCredits = 0;

        // Skip if no change needed (optimization)
        if (newCredits === currentCredits) continue;

        try {
            await client.users.updateUserMetadata(user.id, {
                publicMetadata: {
                    credits: newCredits
                }
            });
            updatedCount++;
        } catch (e) {
            console.error(`Failed to update user ${user.id}`, e);
        }
        
        // Small delay to prevent Clerk Rate Limits (Clerk allows ~20 req/s on free/dev, better safe than sorry)
        // await new Promise(r => setTimeout(r, 50)); 
    }

    return NextResponse.json({ success: true, updatedCount, totalUsers: userList.length });

  } catch (error) {
    console.error('Bulk credits error:', error);
    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
  }
}


