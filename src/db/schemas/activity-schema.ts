import {
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
  contentFype: contentType('contentType').notNull(),
  contentId: text('contentId').notNull(),
  activityType: activityType('activityType').notNull(),
  value: integer('value').default(0),
  durationMinutes: integer('durationMinutes'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull(),
})
