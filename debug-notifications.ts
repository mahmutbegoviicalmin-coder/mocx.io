import { createPool } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createPool({
  connectionString: process.env.POSTGRES_URL
});

const USER_ID = 'user_366yR5mRzudiE2eBn9snRXcWMi9'; // Admin user from previous logs

async function main() {
  try {
    console.log('Checking notifications table...');
    const { rows: allNotifs } = await db.sql`SELECT * FROM notifications`;
    console.log('All notifications:', allNotifs);

    console.log('Checking user_notifications table...');
    const { rows: userNotifs } = await db.sql`SELECT * FROM user_notifications WHERE user_id = ${USER_ID}`;
    console.log('User notifications:', userNotifs);

    console.log('Running the query used in API...');
    const { rows: result } = await db.sql`
      SELECT
        n.id,
        n.title,
        n.body,
        n.created_at,
        un.read_at,
        un.deleted
      FROM notifications n
      LEFT JOIN user_notifications un
        ON un.notification_id = n.id AND un.user_id = ${USER_ID}
      WHERE (un.deleted IS FALSE OR un.deleted IS NULL)
      ORDER BY n.created_at DESC
      LIMIT 50;
    `;
    console.log('API Query Result:', result);

  } catch (e) {
    console.error(e);
  }
}

main();

