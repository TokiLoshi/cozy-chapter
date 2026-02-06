import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '../schemas/auth-schema'

export const plantHealthEnum = pgEnum('plant_health', [
  'thriving',
  'ok',
  'needsAttention',
])

export const userPlants = pgTable('plants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  species: text('species').notNull(),
  name: text('name'),
  recommendedWateringIntervalDays: integer('recommendedWateringIntervalDays'),
  group: text('group'),
  lastWatered: timestamp('lastWatered'),
  plantHealth: plantHealthEnum('plantHealth').notNull().default('thriving'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  plantImageUrl: text('plantImageUrl'),
})

export type UserPlants = typeof userPlants.$inferInsert
