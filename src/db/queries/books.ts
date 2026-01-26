import { and, eq } from 'drizzle-orm'
import { books, userBooks } from '../schemas/book-schema'
import type { Books, UserBooks } from '../schemas/book-schema'
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
    pageCount?: number | null
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

    const currentPage =
      data.status === 'read' && data.pageCount ? data.pageCount : 0
    const result = await db
      .insert(userBooks)
      .values({
        userId: data.userId,
        bookId: data.bookId,
        status: data.status,
        startedAt: data.status === 'reading' ? new Date() : null,
        finishedAt: data.status === 'read' ? new Date() : null,
        currentPage,
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
  bookPageCount?: number | null,
) {
  try {
    // Get current book for comparison
    const current = await db
      .select()
      .from(userBooks)
      .where(and(eq(userBooks.id, id), eq(userBooks.userId, userId)))
      .limit(1)
    if (!current[0]) return { success: false, error: 'Book not found ' }

    const currentBook = current[0]
    const finalUpdates: Partial<UserBooks> & { updatedAt: Date } = {
      ...updates,
      updatedAt: new Date(),
    }

    const isStatusUpdated =
      updates.status && updates.status !== currentBook.status
    if (isStatusUpdated) {
      // Set and reset start time
      if (updates.status === 'reading') {
        if (!currentBook.startedAt) {
          finalUpdates.startedAt = new Date()
        }
        finalUpdates.finishedAt = null
      }

      // Set page count for read books
      if (updates.status === 'read') {
        finalUpdates.finishedAt = new Date()
        if (bookPageCount) {
          finalUpdates.currentPage = bookPageCount
        }
      }

      // reset everything for books that have been read
      if (updates.status === 'toRead') {
        finalUpdates.startedAt = null
        finalUpdates.finishedAt = null
        finalUpdates.currentPage = 0
        finalUpdates.lastChapter = 0
        finalUpdates.rating = null
      }
    }

    const result = await db
      .update(userBooks)
      .set(finalUpdates)
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
