import { createPool } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createPool({
  connectionString: process.env.POSTGRES_URL
});

async function main() {
  try {
    const { rows } = await db.sql`SELECT count(*) as count FROM notifications`;
    console.log('Notifications count:', rows[0].count);
    
    const { rows: rows2 } = await db.sql`SELECT * FROM notifications LIMIT 5`;
    console.log('Sample notifications:', rows2);
  } catch (e) {
    console.error(e);
  }
}

main();

