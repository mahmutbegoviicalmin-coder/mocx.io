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

export const payoutRequests = pgTable('payout_requests', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  userEmail: text('user_email').notNull(),
  amount: text('amount').notNull(),
  method: text('method').notNull(), // western_union, paypal, bank_transfer
  details: text('details').notNull(), // JSON string containing full details
  status: text('status').default('pending'), // pending, paid, rejected
  createdAt: timestamp('created_at').defaultNow(),
});
