import { createPool } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local in the root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const connectionString =
  process.env.STORAGE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error('No database connection string found in environment variables.');
  process.exit(1);
}

const db = createPool({ connectionString });

async function main() {
  console.log('Running manual migration for payout_requests...');
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS payout_requests (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        user_email TEXT NOT NULL,
        amount TEXT NOT NULL,
        method TEXT NOT NULL,
        details TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Table created successfully.');
  } catch (e) {
    console.error('Error creating table:', e);
    process.exit(1);
  }
}

main();

