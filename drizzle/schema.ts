import { pgTable, foreignKey, unique, text, timestamp, boolean, uuid, integer, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const articleStatus = pgEnum("article_status", ['toRead', 'reading', 'read'])
export const audioBookStatus = pgEnum("audioBookStatus", ['toListen', 'listening', 'listened'])
export const bookstatus = pgEnum("bookstatus", ['toRead', 'reading', 'read', 'abandoned'])
export const plantHealth = pgEnum("plant_health", ['thriving', 'ok', 'needsAttention'])


export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	createdAt: timestamp({ mode: 'string' }),
	expiresAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().notNull(),
	image: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idtoken: text(),
	accessTokenExpiresAt: timestamp({ mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const plants = pgTable("plants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text().notNull(),
	species: text().notNull(),
	recommendedWateringIntervalDays: integer(),
	group: text(),
	lastWatered: timestamp({ mode: 'string' }),
	plantHealth: plantHealth().default('thriving').notNull(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "plants_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const articles = pgTable("articles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text().notNull(),
	url: text(),
	author: text(),
	description: text(),
	estimatedReadingTime: integer(),
	wordCount: integer(),
	status: articleStatus().default('toRead').notNull(),
	notes: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "articles_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const userAudiobooks = pgTable("userAudiobooks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text().notNull(),
	audioBookId: text().notNull(),
	status: audioBookStatus().default('toListen').notNull(),
	lastChapter: integer().default(0),
	lastPositionMs: integer().default(0),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "userAudiobooks_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.audioBookId],
			foreignColumns: [audiobooks.id],
			name: "userAudiobooks_audioBookId_audiobooks_id_fk"
		}).onDelete("cascade"),
]);

export const audiobooks = pgTable("audiobooks", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	edition: text(),
	externalUrl: text(),
	href: text(),
	coverImageUrl: text(),
	totalChapters: integer(),
	authors: jsonb(),
	narrators: jsonb(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const books = pgTable("books", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	subtitle: text(),
	description: text(),
	authors: jsonb(),
	publisher: text(),
	publishedDate: text(),
	pageCount: integer(),
	categories: jsonb(),
	coverImageUrl: text(),
	previewLink: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const userBooks = pgTable("userBooks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text().notNull(),
	bookId: text().notNull(),
	status: bookstatus().default('toRead').notNull(),
	lastChapter: integer().default(0),
	currentPage: integer().default(0),
	rating: integer(),
	notes: text(),
	startedAt: timestamp({ mode: 'string' }),
	finishedAt: timestamp({ mode: 'string' }),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "userBooks_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.bookId],
			foreignColumns: [books.id],
			name: "userBooks_bookId_books_id_fk"
		}).onDelete("cascade"),
]);
