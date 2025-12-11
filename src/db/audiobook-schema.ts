import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const userAudioBook = pgTable('userAudiobooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  audioBookId: text('audioBookId')
    .notNull()
    .references(() => audiobook.id, { onDelete: 'cascade' }),
})

// TODO: check this maps correctly
export const audioBook = pgTable('audiobooks', {
  authors: Array<string>,
  availableMarkets: Array<string>,
  description: text('description'),
  htmlDescription: text('htmlDescription'),
  edition: 'Unabridged',
  externalUrls: text,
  href: text('href'),
  id: text('id'),
  title: text('title').notNull(),
  externalUrl: text('url'),
  // images: object with url: string, height: int, width: int
  // narrators array
  // last chapter
  // total chapters
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type AudioBooks = typeof AudioBooks.$inferInsert

// last chapter
// chapters left or % completed
// created at
// updated at
