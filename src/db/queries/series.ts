import { and, eq } from 'drizzle-orm'
import { tvSeries, userSeries } from '../schemas/series-schema'
import type { NewTvSeries, NewUserSeries } from '../schemas/series-schema'
import { db } from '@/db'

export async function upsertSeries(
  data: Omit<NewTvSeries, 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db
      .insert(tvSeries)
      .values(data)
      .onConflictDoUpdate({
        target: tvSeries.id,
        set: {
          imdbId: data.imdbId,
          title: data.title,
          tagline: data.tagline,
          originalLanguage: data.originalLanguage,
          externalUrl: data.externalUrl,
          overview: data.overview,
          posterPath: data.posterPath,
          genreIds: data.genreIds,
          numberOfSeasons: data.numberOfSeasons,
          numberOfEpisodes: data.numberOfEpisodes,
          firstAirDate: data.firstAirDate,
          lastAirDate: data.lastAirDate,
          updatedAt: new Date(),
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error upserting series ${error as Error}`)
    return { success: false, error }
  }
}

export async function createUserSeries(
  data: Pick<NewUserSeries, 'userId' | 'seriesId'>,
) {
  try {
    const exists = await db
      .select()
      .from(userSeries)
      .where(
        and(
          eq(userSeries.userId, data.userId),
          eq(userSeries.seriesId, data.seriesId),
        ),
      )
    if (exists.length > 0) {
      return { success: true, data: exists[0] }
    }
    const result = await db.insert(userSeries).values(data).returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error creating user series: ${error as Error}`)
    return { success: false, error }
  }
}

export async function getUserSeries(userId: string) {
  try {
    const result = await db
      .select({
        series: tvSeries,
        userSeries: userSeries,
      })
      .from(userSeries)
      .innerJoin(tvSeries, eq(userSeries.seriesId, tvSeries.id))
      .where(eq(userSeries.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error getting user series: ${error as Error}`)
    return { success: false, error }
  }
}

export async function updateUserSeries(
  id: string,
  userId: string,
  updates: Partial<NewUserSeries>,
) {
  try {
    const result = await db
      .update(userSeries)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(userSeries.id, id), eq(userSeries.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error updating series: ${error as Error}`)
    return { success: false, error }
  }
}

export async function deleteUserSeries(id: string, userId: string) {
  try {
    const result = await db
      .delete(userSeries)
      .where(and(eq(userSeries.id, id), eq(userSeries.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error deleting user series: ${error as Error}`)
    return { success: false, error }
  }
}
