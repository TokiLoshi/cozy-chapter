import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '../schemas/auth-schema'

export const coursePriority = pgEnum('coursePriority', [
  'high',
  'medium',
  'low',
  'none',
])

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  author: text('author'),
  platform: text('platform'),
  category: text('category'),
  url: text('url'),
  priority: coursePriority('priority').notNull().default('none'),
  progressCurrent: integer('progressCurrent').notNull().default(0),
  progressTotal: integer('progressTotal'),
  progressUnit: text('progressUnit').notNull().default('lessons'),
  estimatedMinutesRemaining: integer('estimatedMinutesRemaining'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  startedAt: timestamp('startedAt'),
  finishedAt: timestamp('finishedAt'),
})

export type Courses = typeof courses.$inferSelect
export type NewCourse = typeof courses.$inferInsert
