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

export const claimedTrials = pgTable('claimed_trials', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  ipHash: text('ip_hash').notNull(), // Hashed IP address for privacy/matching
  userAgent: text('user_agent'), // Browser string
  claimedAt: timestamp('claimed_at').defaultNow(),
});

export const referrals = pgTable('referrals', {
  id: serial('id').primaryKey(),
  referrerId: text('referrer_id').notNull(), // e.g. 'stefan' or user ID
  referredUserId: text('referred_user_id').notNull().unique(), // The new user
  referredUserEmail: text('referred_user_email'),
  status: text('status').default('free'), // free, paid
  createdAt: timestamp('created_at').defaultNow(),
});
