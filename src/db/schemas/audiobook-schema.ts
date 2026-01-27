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

export const audioBookStatus = pgEnum('audioBookStatus', [
  'toListen',
  'listening',
  'listened',
])

// TODO: check this maps correctly
export const audioBooks = pgTable('audiobooks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  edition: text('edition'),
  externalUrl: text('externalUrl'),
  href: text('href'),
  coverImageUrl: text('coverImageUrl'),
  totalChapters: integer('totalChapters'),
  authors: jsonb('authors').$type<Array<string>>(),
  narrators: jsonb('narrators').$type<Array<string>>(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userAudioBooks = pgTable('userAudiobooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  audioBookId: text('audioBookId')
    .notNull()
    .references(() => audioBooks.id, { onDelete: 'cascade' }),
  status: audioBookStatus('status').notNull().default('toListen'),
  lastChapter: integer('lastChapter').default(0),
  lastPositionMs: integer('lastPositionMs').default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
  rating: integer('rating'),
})

export type AudioBooks = typeof audioBooks.$inferInsert
export type UserAudioBooks = typeof userAudioBooks.$inferInsert
