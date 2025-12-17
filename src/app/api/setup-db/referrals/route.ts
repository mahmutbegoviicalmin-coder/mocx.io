import { NextResponse } from 'next/server';
import { db } from '@/db/sql';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Use sql`` directly for raw queries if db.execute isn't available on the pool object
    await db.sql`
      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id TEXT NOT NULL,
        referred_user_id TEXT NOT NULL UNIQUE,
        referred_user_email TEXT,
        status TEXT DEFAULT 'free',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Add index if not exists
    await db.sql`CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);`;

    return NextResponse.json({ success: true, message: 'Referrals table created' });
  } catch (error) {
    console.error('Setup DB error:', error);
    return NextResponse.json({ error: 'Failed to setup DB', details: String(error) }, { status: 500 });
  }
}

