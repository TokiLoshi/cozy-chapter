import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { user } from './auth-schema'

export const articleStatusEnum = pgEnum('article_status', [
  'toRead',
  'reading',
  'completed',
  'abandoned',
])

export const userBlogs = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  url: text('url'),
  author: text('author'),
  publishedDate: date('publishedDate'),
  description: text('description'),
  estimatedReadingTime: integer('estimatedReadingTime'),
  wordCount: integer('wordCount'),

  tags: jsonb('tags')
    .$type<Array<string>>()
    .default(sql`'[]'::jsonb`),

  status: articleStatusEnum('status').notNull().default('toRead'),

  notes: text('notes'),

  highlights: jsonb('highlights')
    .$type<Array<{ text: string; note?: string; createdAt: string }>>()
    .default(sql`'[]'::jsonb`),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
