import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: text('user_id'), // Optional if user is not logged in
  userEmail: text('user_email'),
  message: text('message').notNull(),
  type: text('type').default('bug'), // bug, feature, other
  status: text('status').default('open'), // open, resolved
  createdAt: timestamp('created_at').defaultNow(),
});

export const generations = pgTable('generations', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  prompt: text('prompt').notNull(),
  imageUrl: text('image_url'),
  mode: text('mode'), // art, mockup, thumbnail
  createdAt: timestamp('created_at').defaultNow(),
});


