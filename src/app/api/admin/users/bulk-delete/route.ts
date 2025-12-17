import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

const ADMIN_EMAIL = 'mahmutbegoviic.almin@gmail.com';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (email !== ADMIN_EMAIL) return new NextResponse('Forbidden', { status: 403 });

    const { userIds } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    console.log(`Bulk deleting ${userIds.length} users...`);

    // Clerk API rate limits apply, so we process in chunks if needed
    // But for <50 users, Promise.all is fine.
    // However, Clerk deletes are irreversible.
    
    let deletedCount = 0;
    const errors: string[] = [];

    // Process in batches of 5 to be safe with rate limits
    const chunkSize = 5;
    for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        
        await Promise.all(chunk.map(async (id: string) => {
            try {
                await client.users.deleteUser(id);
                deletedCount++;
            } catch (err) {
                console.error(`Failed to delete user ${id}:`, err);
                errors.push(id);
            }
        }));
    }

    return NextResponse.json({ 
        success: true, 
        deletedCount,
        errors: errors.length > 0 ? errors : undefined 
    });

  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

