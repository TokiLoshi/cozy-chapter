import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const household = pgTable('household', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdBy: text('createdBy')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const householdRoleEnum = pgEnum('householdRole', ['owner', 'member'])

export const householdMember = pgTable(
  'householdMember',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    householdId: uuid('householdId')
      .notNull()
      .references(() => household.id, { onDelete: 'cascade' }),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    role: householdRoleEnum('role').notNull().default('member'),
    joinedAt: timestamp('joinedAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (h) => [unique().on(h.userId)],
)

export const inviteStatusEnum = pgEnum('inviteStatus', [
  'pending',
  'accepted',
  'declined',
  'expired',
])

export const householdInvite = pgTable('householdInvite', {
  id: uuid('id').defaultRandom().primaryKey(),
  householdId: uuid('householdId')
    .notNull()
    .references(() => household.id, { onDelete: 'cascade' }),
  invitedBy: text('invitedBy')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  token: text('token').notNull().unique(),
  status: inviteStatusEnum('status').notNull().default('pending'),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export type Household = typeof household.$inferSelect
export type NewHousehold = typeof household.$inferInsert
export type HouseholdMember = typeof householdMember.$inferSelect
export type NewHouseholdMember = typeof householdMember.$inferInsert
