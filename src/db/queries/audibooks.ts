import { and, eq } from 'drizzle-orm'
import { audioBooks, userAudioBooks } from '../audiobook-schema'
import type { AudioBooks, UserAudioBooks } from '../audiobook-schema'
import { db } from '@/db'

export async function upsertAudiobook(
  data: Omit<AudioBooks, 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db
      .insert(audioBooks)
      .values(data)
      .onConflictDoUpdate({
        target: audioBooks.id,
        set: {
          title: data.title,
          description: data.description,
          edition: data.edition,
          externalUrl: data.externalUrl,
          href: data.href,
          coverImageUrl: data.coverImageUrl,
          totalChapters: data.totalChapters,
          authors: data.authors,
          narrators: data.narrators,
          updatedAt: new Date(),
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error upserting audiobook: ', error)
    return { success: false, error }
  }
}

export async function createUserAudiobook(
  data: Pick<UserAudioBooks, 'userId' | 'audioBookId'>,
) {
  try {
    const existing = await db
      .select()
      .from(userAudioBooks)
      .where(
        and(
          eq(userAudioBooks.userId, data.userId),
          eq(userAudioBooks.audioBookId, data.audioBookId),
        ),
      )
    if (existing.length > 0) {
      return { success: true, data: existing[0] }
    }
    const result = await db.insert(userAudioBooks).values(data).returning()
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating user audiobook: ', error)
    return { success: false, error }
  }
}

export async function getUserAudiobooks(userId: string) {
  try {
    const result = await db
      .select({
        userAudioBook: userAudioBooks,
        audioBook: audioBooks,
      })
      .from(userAudioBooks)
      .innerJoin(audioBooks, eq(userAudioBooks.audioBookId, audioBooks.id))
      .where(eq(userAudioBooks.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error getting user audiobooks: ', error)
    return { success: false, error }
  }
}

export async function updateUserAudiobook(
  id: string,
  userId: string,
  updates: Partial<UserAudioBooks>,
) {
  try {
    const result = await db
      .update(userAudioBooks)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userAudioBooks.id, id), eq(userAudioBooks.userId, userId)))
      .returning()

    return { success: true, data: result }
  } catch (error) {
    console.error('Error updating user audiobook: ', error)
    return { success: false, error }
  }
}

export async function deleteUserAudiobook(userId: string, id: string) {
  try {
    await db
      .delete(userAudioBooks)
      .where(and(eq(userAudioBooks.id, id), eq(userAudioBooks.userId, userId)))
    return { success: true }
  } catch (error) {
    console.error('Error deleting audiobook: ', error)
    return { success: false, error }
  }
}
