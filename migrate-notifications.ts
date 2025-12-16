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
  console.log('Running migration for notifications...');
  try {
    // Create notifications table
    await db.sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_by_user_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('Table notifications created/verified.');

    // Create user_notifications table
    await db.sql`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        notification_id INTEGER REFERENCES notifications(id) ON DELETE CASCADE,
        read_at TIMESTAMP,
        deleted BOOLEAN DEFAULT FALSE,
        UNIQUE(user_id, notification_id)
      );
    `;
    console.log('Table user_notifications created/verified.');

  } catch (e) {
    console.error('Error creating tables:', e);
    process.exit(1);
  }
}

main();

