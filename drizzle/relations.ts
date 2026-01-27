import { relations } from "drizzle-orm/relations";
import { user, session, account, plants, articles, userAudiobooks, audiobooks, userBooks, books } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
	plants: many(plants),
	articles: many(articles),
	userAudiobooks: many(userAudiobooks),
	userBooks: many(userBooks),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const plantsRelations = relations(plants, ({one}) => ({
	user: one(user, {
		fields: [plants.userId],
		references: [user.id]
	}),
}));

export const articlesRelations = relations(articles, ({one}) => ({
	user: one(user, {
		fields: [articles.userId],
		references: [user.id]
	}),
}));

export const userAudiobooksRelations = relations(userAudiobooks, ({one}) => ({
	user: one(user, {
		fields: [userAudiobooks.userId],
		references: [user.id]
	}),
	audiobook: one(audiobooks, {
		fields: [userAudiobooks.audioBookId],
		references: [audiobooks.id]
	}),
}));

export const audiobooksRelations = relations(audiobooks, ({many}) => ({
	userAudiobooks: many(userAudiobooks),
}));

export const userBooksRelations = relations(userBooks, ({one}) => ({
	user: one(user, {
		fields: [userBooks.userId],
		references: [user.id]
	}),
	book: one(books, {
		fields: [userBooks.bookId],
		references: [books.id]
	}),
}));

export const booksRelations = relations(books, ({many}) => ({
	userBooks: many(userBooks),
}));