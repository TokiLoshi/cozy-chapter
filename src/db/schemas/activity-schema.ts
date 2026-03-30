import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const contentType = pgEnum('contentType', [
  'article',
  'audiobook',
  'book',
  'course',
  'podcast',
  'movie',
  'series',
])

export const activityType = pgEnum('activityType', ['manual', 'timedSession'])

export const activityLog = pgTable('activityLog', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  contentType: contentType('contentType').notNull(),
  contentId: text('contentId').notNull(),
  activityType: activityType('activityType').notNull(),
  value: integer('value').default(0),
  durationMinutes: integer('durationMinutes'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userStats = pgTable('userStats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  currentStreak: integer('currentStreak').notNull().default(0),
  bestStreak: integer('bestStreak').notNull().default(0),
  lastActivityDate: date('lastActivityDate'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type ActivityLogInsert = typeof activityLog.$inferInsert
export type ActivityLogSelect = typeof activityLog.$inferSelect
export type UserStatsInsert = typeof userStats.$inferInsert
export type UserStatsSelect = typeof userStats.$inferSelect
