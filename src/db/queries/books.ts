import { and, eq } from 'drizzle-orm'
import { books, userBooks } from '../book-schema'
import type { Books, UserBooks } from '../book-schema'
import { db } from '@/db'

export async function upsertBook(data: Omit<Books, 'createdAt' | 'updatedAt'>) {
  try {
    const result = await db
      .insert(books)
      .values(data)
      .onConflictDoUpdate({
        target: books.id,
        set: {
          title: data.title,
          subtitle: data.subtitle,
          authors: data.authors,
          publisher: data.publisher,
          publishedDate: data.publishedDate,
          pageCount: data.pageCount,
          categories: data.categories,
          coverImageUrl: data.coverImageUrl,
          previewLink: data.previewLink,
          updatedAt: new Date(),
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error upserting book: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function createUserBook(
  data: Pick<UserBooks, 'userId' | 'bookId'> & {
    status: 'toRead' | 'reading' | 'read'
  },
) {
  try {
    const existing = await db
      .select()
      .from(userBooks)
      .where(
        and(
          eq(userBooks.userId, data.userId),
          eq(userBooks.bookId, data.bookId),
        ),
      )
    if (existing.length > 0) {
      return { success: true, data: existing[0] }
    }
    const result = await db
      .insert(userBooks)
      .values({
        userId: data.userId,
        bookId: data.bookId,
        status: data.status,
      })
      .returning()
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error creating user book: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function getUserBooks(userId: string) {
  try {
    const result = await db
      .select({
        userBook: userBooks,
        book: books,
      })
      .from(userBooks)
      .innerJoin(books, eq(userBooks.bookId, books.id))
      .where(eq(userBooks.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error getting user books: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function updateUserBook(
  id: string,
  userId: string,
  updates: Partial<UserBooks>,
) {
  try {
    const result = await db
      .update(userBooks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userBooks.id, id), eq(userBooks.userId, userId)))
      .returning()
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error updating user books: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function deleteUserBook(userId: string, id: string) {
  try {
    await db
      .delete(userBooks)
      .where(and(eq(userBooks.id, id), eq(userBooks.userId, userId)))
    return { success: true }
  } catch (error) {
    console.error(`Error deleting book: ${(error as Error).message}`)
    return { success: false, error }
  }
}
