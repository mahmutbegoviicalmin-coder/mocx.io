import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/sql';

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const { rows } = await db.sql`
        SELECT * FROM payout_requests 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
    `;
    
    return NextResponse.json(rows);
}

