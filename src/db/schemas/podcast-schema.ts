import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '@/db/schemas/auth-schema'

export const podcastStatus = pgEnum('podcastStatus', [
  'toListen',
  'listening',
  'listened',
])

export const podcastSource = pgEnum('podcastSource', ['spotify', 'youTube'])

export const podcasts = pgTable('podcasts', {
  id: text('id').primaryKey(),
  showName: text('showName'),
  episodeTitle: text('episodeTitle').notNull(),
  description: text('description'),
  coverImageUrl: text('coverImageUrl'),
  durationMs: integer('durationMs'),
  externalUrl: text('externalUrl'),
  source: podcastSource('source').notNull(),
  publishedAt: timestamp('publishedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userPodcasts = pgTable('userPodcasts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  podcastId: text('podcastId')
    .notNull()
    .references(() => podcasts.id, { onDelete: 'cascade' }),
  status: podcastStatus('status').notNull().default('toListen'),
  lastPositionMs: integer('lastPositionMs'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
  rating: integer('rating'),
  notes: text('notes'),
})

export type Podcast = typeof podcasts.$inferSelect
export type NewPodcast = typeof podcasts.$inferInsert
export type UserPodcast = typeof userPodcasts.$inferSelect
export type NewUserPodcast = typeof userPodcasts.$inferInsert
