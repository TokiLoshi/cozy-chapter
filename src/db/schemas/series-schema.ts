// import {
//   integer,
//   pgEnum,
//   pgTable,
//   text,
//   timestamp,
//   uuid,
// } from 'drizzle-orm/pg-core'
// import { user } from '@/db/schemas/auth-schema'

// export const seriesStatus = pgEnum('series', ['toWatch', 'watching', 'watched'])

// export const series = pgTable('series', {
//   id: text('id').primaryKey(),
// })

// export const userSeries = pgTable('userSeries', {
//   id: uuid('id').defaultRandom().primaryKey(),
//   userId: text('userId')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
//   seriesId: text('seriesId')
//     .notNull()
//     .references(() => series.id, { onDelete: 'cascade' }),
//   staus: seriesStatus('status').notNull().default('toWatch'),
//   season: integer('season'),
//   episode: integer('episode'),
//   lastPosition: timestamp('lastPosition'),
//   createdAt: timestamp('createdAt').notNull().defaultNow(),
//   updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// })
