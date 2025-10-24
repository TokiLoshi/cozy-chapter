import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const articleStatusEnum = pgEnum('article_status', [
  'toRead',
  'reading',
  'read',
])

export const userBlogs = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  url: text('url'),
  author: text('author'),
  description: text('description'),
  estimatedReadingTime: integer('estimatedReadingTime'),
  wordCount: integer('wordCount'),
  status: articleStatusEnum('status').notNull().default('toRead'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type UserBlogs = typeof userBlogs.$inferInsert
