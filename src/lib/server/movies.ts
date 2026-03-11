import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import {
  adaptTMDBMovie,
  adaptTMDBSearchResult,
} from '../../features/movies/adapters/tmbdAdapter'
import type { NewUserMovie } from '@/db/schemas/movies-schema'
import {
  createUserMovie,
  deleteUserMovie,
  getUserMovies,
  updateUserMovie,
  upsertMovie,
} from '@/db/queries/movies'
import { auth } from '@/lib/auth'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie'

console.log('Auth header:', `Bearer ${TMDB_API_KEY}`.slice(0, 20))
console.log('TMDB_API_KEY defined:', !!TMDB_API_KEY)

export const searchTMDBMovies = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const response = await fetch(
      `${TMDB_SEARCH_URL}?query=${encodeURIComponent(query)}&language=en-US&page=1`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    )

    if (!response.ok) {
      console.error('Response failed with: ', response.status)
      console.error('Response error: ', response.body)
      throw new Error('Failed to get movies')
    }

    const data = await response.json()
    return data.results.map(adaptTMDBSearchResult)
  })

export const addMovie = createServerFn({ method: 'POST' })
  .inputValidator((data: { tmdbId: number }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const detailResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${data.tmdbId}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    )
    if (!detailResponse.ok) {
      throw new Error('Failed to get movie details')
    }

    const movieDetails = await detailResponse.json()
    const adapted = adaptTMDBMovie(movieDetails)
    const movieResult = await upsertMovie(adapted)
    if (!movieResult.success) {
      throw new Error('Failed to save movie')
    }

    const userMovieResult = await createUserMovie({
      userId: session.user.id,
      movieId: adapted.id,
    })
    if (!userMovieResult.success) {
      throw new Error('Failed to save user movie')
    }
    return userMovieResult.data
  })

export const getUserMovieServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })

  const result = await getUserMovies(session.user.id)
  if (!result.success) {
    throw new Error('Failed to get users movies')
  }
  return result.data
})

export const updateUserMovieServer = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { id: string; updates: Partial<NewUserMovie> }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await updateUserMovie(data.id, session.user.id, data.updates)
    if (!result.success) {
      throw new Error('Failed to update movie')
    }
    return result.data
  })

export const deleteUserMovieServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await deleteUserMovie(data, session.user.id)
    if (!result.success) {
      throw new Error('Error deleting user movie: ')
    }
    return { success: true, id: data }
  })
