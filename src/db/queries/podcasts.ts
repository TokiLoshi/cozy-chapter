import { and, eq } from 'drizzle-orm'
import { podcasts, userPodcasts } from '../schemas/podcast-schema'
import type { NewPodcast, NewUserPodcast } from '../schemas/podcast-schema'
import { db } from '@/db'

export async function upsertPodcast(
  data: Omit<NewPodcast, 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db
      .insert(podcasts)
      .values(data)
      .onConflictDoUpdate({
        target: podcasts.id,
        set: {
          showName: data.showName,
          episodeTitle: data.episodeTitle,
          description: data.description,
          coverImageUrl: data.coverImageUrl,
          durationMs: data.durationMs,
          externalUrl: data.externalUrl,
          source: data.source,
          publishedAt: data.publishedAt,
          updatedAt: new Date(),
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updserting podcast: ', error)
    return { success: false }
  }
}

export async function createUserPodcast(
  data: Pick<NewUserPodcast, 'userId' | 'podcastId'>,
) {
  try {
    const result = await db
      .select()
      .from(userPodcasts)
      .where(
        and(
          eq(userPodcasts.userId, data.userId),
          eq(userPodcasts.podcastId, data.podcastId),
        ),
      )
    if (result.length > 0) {
      return { success: true, data: result[0] }
    }
    const insertedPodcast = await db
      .insert(userPodcasts)
      .values(data)
      .returning()
    return { success: true, data: insertedPodcast[0] }
  } catch (error) {
    console.error('Error creating userPodcast: ', error)
    return { success: false, error }
  }
}

export async function getUserPodcast(userId: string) {
  try {
    const result = await db
      .select({
        userPodcast: userPodcasts,
        podcast: podcasts,
      })
      .from(userPodcasts)
      .innerJoin(podcasts, eq(userPodcasts.podcastId, podcasts.id))
      .where(eq(userPodcasts.userId, userId))

    return { success: true, data: result }
  } catch (error) {
    console.error('Error getting user podcast: ', error)
    return { success: false, error }
  }
}

export async function updateUserPodcast(
  id: string,
  userId: string,
  updates: Partial<NewUserPodcast>,
) {
  try {
    const result = await db
      .update(userPodcasts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userPodcasts.id, id), eq(userPodcasts.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating podcast: ', error)
    return { success: false, error }
  }
}

export async function deleteUserPodcast(id: string, userId: string) {
  try {
    const result = await db
      .delete(userPodcasts)
      .where(and(eq(userPodcasts.id, id), eq(userPodcasts.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error deleting podcast: ', error)
    return { success: false, error }
  }
}
