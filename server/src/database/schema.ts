import { pgTable, text, timestamp, integer, uuid, uniqueIndex } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: uuid('id').primaryKey().defaultRandom(),
  originalUrl: text('original_url').notNull(),
  shortUrl: text('short_url').notNull().unique(),
  accessCount: integer('access_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const linksOriginalUrlIndex = uniqueIndex('links_original_url_idx').on(links.originalUrl);

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  fileName: text('file_name').notNull().unique(),
  publicUrl: text('public_url').notNull(),
  fileSize: integer('file_size').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
