import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from '@/db/schemas/auth-schema'

export const dietaryTag = pgEnum('dietaryTag', [
  'vegetarian',
  'highProtein',
  'plantProtein',
  'meatProtein',
  'pescatarian',
])

export const mealDay = pgEnum('mealDay', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

export const recipes = pgTable('recipes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ingredients: jsonb('ingredients'),
  cookingInstructions: jsonb('cookingInstructions'),
  source: text('source'),
  externalLink: text('externalLink'),
  estimatedTime: text('estimatedTime'),
  typicalTime: text('typicalTime'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const recipeTags = pgTable('recipeTags', {
  id: uuid('id').defaultRandom().primaryKey(),
  recipeId: text('recipeId')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  tag: dietaryTag('tag').notNull(),
})

export const mealPlans = pgTable('mealPlans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name'),
  weekStartDate: timestamp('weekStartDate').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const mealPlanEntries = pgTable('mealPlanEntries', {
  id: uuid('id').defaultRandom().primaryKey(),
  mealPlanId: uuid('mealPlanId')
    .notNull()
    .references(() => mealPlans.id, { onDelete: 'cascade' }),
  recipeId: text('recipeId')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  day: mealDay('day').notNull(),
  cooked: boolean('cooked').notNull().default(false),
  cookedAt: timestamp('cookedAt'),
  rating: integer('rating'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
