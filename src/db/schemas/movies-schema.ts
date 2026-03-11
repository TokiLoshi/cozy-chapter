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

export const movieStatus = pgEnum('movieStatus', [
  'toWatch',
  'watching',
  'watched',
])

export const movies = pgTable('movies', {
  id: text('id').primaryKey(),
  imdbId: text('imdbId'),
  title: text('title').notNull(),
  tagline: text('tagline'),
  originalLanguage: text('originalLanguage'),
  externalUrl: text('externalUrl'),
  overview: text('overview'),
  posterPath: text('posterPath'),
  genreIds: jsonb('genreIds').$type<Array<{ id: number; name: string }>>(),
  runtime: integer('runtime'),
  releaseDate: timestamp('releaseDate'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const userMovies = pgTable('userMovies', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  movieId: text('movieId')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  status: movieStatus('status').notNull().default('toWatch'),
  watchingOn: text('watchingOn'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
  rating: integer('rating'),
  notes: text('notes'),
})

export type Movie = typeof movies.$inferSelect
export type NewMovie = typeof movies.$inferInsert
export type UserMovie = typeof userMovies.$inferSelect
export type NewUserMovie = typeof userMovies.$inferInsert
