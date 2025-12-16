import { createPool } from '@vercel/postgres';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const db = createPool({
  connectionString: process.env.POSTGRES_URL
});

async function main() {
  try {
    console.log('Ensuring unique constraint on user_notifications...');
    await db.sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'user_notifications_user_id_notification_id_key'
        ) THEN
          ALTER TABLE user_notifications ADD CONSTRAINT user_notifications_user_id_notification_id_key UNIQUE (user_id, notification_id);
        END IF;
      END
      $$;
    `;
    console.log('Constraint checked/added.');
  } catch (e) {
    // If it fails, maybe duplicate keys exist. We might need to clean up duplicates first.
    console.error('Error adding constraint:', e);
    
    if (String(e).includes('could not create unique index')) {
        console.log('Duplicates found. Cleaning up...');
        // Remove duplicates, keeping the latest one
        await db.sql`
            DELETE FROM user_notifications a USING user_notifications b
            WHERE a.id < b.id AND a.user_id = b.user_id AND a.notification_id = b.notification_id;
        `;
        console.log('Duplicates removed. Retrying constraint...');
        await db.sql`
            ALTER TABLE user_notifications ADD CONSTRAINT user_notifications_user_id_notification_id_key UNIQUE (user_id, notification_id);
        `;
        console.log('Constraint added after cleanup.');
    }
  }
}

main();

