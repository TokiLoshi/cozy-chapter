import { and, eq } from 'drizzle-orm'
import { movies, userMovies } from '../schemas/movies-schema'
import type { NewMovie, NewUserMovie } from '../schemas/movies-schema'
import { db } from '@/db'

export async function upsertMovie(
  data: Omit<NewMovie, 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db
      .insert(movies)
      .values(data)
      .onConflictDoUpdate({
        target: movies.id,
        set: {
          imdbId: data.imdbId,
          title: data.title,
          tagline: data.tagline,
          originalLanguage: data.originalLanguage,
          externalUrl: data.externalUrl,
          overview: data.overview,
          posterPath: data.posterPath,
          genreIds: data.genreIds,
          runtime: data.runtime,
          releaseDate: data.releaseDate,
          updatedAt: new Date(),
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error upserting movie: ', error)
    return { success: false }
  }
}

export async function createUserMovie(
  data: Pick<NewUserMovie, 'userId' | 'movieId'>,
) {
  try {
    const exists = await db
      .select()
      .from(userMovies)
      .where(
        and(
          eq(userMovies.userId, data.userId),
          eq(userMovies.movieId, data.movieId),
        ),
      )
    if (exists.length > 0) {
      return { success: true, data: exists[0] }
    }
    const result = await db.insert(userMovies).values(data).returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error creating user Movie: ', error)
    return { success: false, error }
  }
}

export async function getUserMovies(userId: string) {
  try {
    const result = await db
      .select({
        userMovies: userMovies,
        movies: movies,
      })
      .from(userMovies)
      .innerJoin(movies, eq(userMovies.movieId, movies.id))
      .where(eq(userMovies.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error getting movies for user: ', error)
    return { success: false, error }
  }
}

export async function updateUserMovie(
  id: string,
  userId: string,
  updates: Partial<NewUserMovie>,
) {
  try {
    const result = await db
      .update(userMovies)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(userMovies.id, id), eq(userMovies.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating movie: ', error)
    return { success: false, error }
  }
}

export async function deleteUserMovie(id: string, userId: string) {
  try {
    const result = await db
      .delete(userMovies)
      .where(and(eq(userMovies.id, id), eq(userMovies.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error deleting movie: ', error)
    return { success: false, error }
  }
}
