import { integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Existing users table (unchanged)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // GitHub ID
  username: text('username').notNull(),
  email: text('email'),
  photo: text('photo'),
  credits: integer('credits').default(10).notNull(),
  subscriptionTier: text('subscription_tier').default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// New tables for chat persistence
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull().default('New Conversation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  convoId: uuid('convo_id').references(() => conversations.id),
  sender: text('sender').notNull(), // 'user' | 'assistant'
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
