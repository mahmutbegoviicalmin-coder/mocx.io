import { createPool } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createPool({
  connectionString: process.env.POSTGRES_URL
});

async function main() {
  try {
    console.log('Adding deleted column to user_notifications...');
    await db.sql`
      ALTER TABLE user_notifications 
      ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
    `;
    console.log('Column deleted added successfully.');
  } catch (e) {
    console.error('Error adding column:', e);
  }
}

main();

