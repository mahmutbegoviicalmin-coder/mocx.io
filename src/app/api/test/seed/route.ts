import { NextResponse } from 'next/server';
import { db } from '@/db/sql';

export async function GET() {
  try {
    await db.sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        user_email VARCHAR(255),
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'bug',
        status VARCHAR(50) DEFAULT 'open',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_by_user_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.sql`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
        read_at TIMESTAMP WITH TIME ZONE,
        deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name='user_notifications' AND column_name='deleted'
        ) THEN
            ALTER TABLE user_notifications ADD COLUMN deleted BOOLEAN DEFAULT FALSE;
        END IF;
      END $$;
    `;

    await db.sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'uniq_user_notification'
        ) THEN
          ALTER TABLE user_notifications
          ADD CONSTRAINT uniq_user_notification UNIQUE (user_id, notification_id);
        END IF;
      END $$;
    `;

    await db.sql`CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);`;
    await db.sql`CREATE INDEX IF NOT EXISTS idx_user_notifications_read_at ON user_notifications(read_at);`;
    await db.sql`CREATE INDEX IF NOT EXISTS idx_user_notifications_notification_id ON user_notifications(notification_id);`;

    await db.sql`
      CREATE TABLE IF NOT EXISTS generations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        mode VARCHAR(50) NOT NULL,
        image_url TEXT,
        cost_usd NUMERIC(10, 4) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({ message: 'DB tables created successfully' });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
