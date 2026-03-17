import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '@/db/schemas/auth-schema'

export const seriesStatus = pgEnum('seriesStatus', [
  'toWatch',
  'watching',
  'watched',
])

export const tvSeries = pgTable('tvSeries', {
  id: text('id').primaryKey(),
  imdbId: text('imdbId'),
  title: text('title').notNull(),
  tagline: text('tagline'),
  originalLanguage: text('originalLanguage'),
  externalUrl: text('externalUrl'),
  overview: text('overview'),
  posterPath: text('posterPath'),
  genreIds: jsonb('genreIds').$type<Array<{ id: number; name: string }>>(),
  numberOfSeasons: integer('numberOfSeasons'),
  numberOfEpisodes: integer('numberOfEpisodes'),
  firstAirDate: timestamp('firstAirDate'),
  lastAirDate: timestamp('lastAirDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userSeries = pgTable('userSeries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  seriesId: text('seriesId')
    .notNull()
    .references(() => tvSeries.id, { onDelete: 'cascade' }),
  status: seriesStatus('seriesStatus').notNull().default('toWatch'),
  currentSeason: integer('currentSeason'),
  currentEpisode: integer('currentEpisode'),
  watchingOn: text('watchingOn'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
  rating: integer('rating'),
  notes: text('notes'),
})

export type TvSeries = typeof tvSeries.$inferSelect
export type NewTvSeries = typeof tvSeries.$inferInsert
export type UserSeries = typeof userSeries.$inferSelect
export type NewUserSeries = typeof userSeries.$inferInsert
