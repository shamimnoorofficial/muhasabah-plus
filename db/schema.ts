import { pgTable, text, bigint, primaryKey } from 'drizzle-orm/pg-core';

export const journalEntries = pgTable('journal_entries', {
  owner: text('owner').notNull(),
  day: text('day').notNull(),
  content: text('content').notNull().default(''),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
}, table => [primaryKey({ columns: [table.owner, table.day] })]);

export const appPreferences = pgTable('app_preferences', {
  owner: text('owner').primaryKey(),
  language: text('language').notNull().default('en'),
  theme: text('theme').notNull().default('dark'),
});
