import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '../schemas/auth-schema'

export const bookStatus = pgEnum('bookstatus', [
  'toRead',
  'reading',
  'read',
  'abandoned',
])

export const books = pgTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  description: text('description'),
  authors: jsonb('authors').$type<Array<string>>(),
  publisher: text('publisher'),
  publishedDate: text('publishedDate'),
  pageCount: integer('pageCount'),
  categories: jsonb('categories').$type<Array<string>>(),
  coverImageUrl: text('coverImageUrl'),
  previewLink: text('previewLink'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userBooks = pgTable('userBooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  bookId: text('bookId')
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  status: bookStatus('status').notNull().default('toRead'),
  lastChapter: integer('lastChapter').default(0),
  currentPage: integer('currentPage').default(0),
  rating: integer('rating'),
  notes: text('notes'),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Books = typeof books.$inferInsert
export type UserBooks = typeof userBooks.$inferInsert
