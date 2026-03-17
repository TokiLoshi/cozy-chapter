import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import {
  adaptTMDBTVDetails,
  adaptTMDBTVSearchResult,
} from '../../features/series/adapters/tmdbAdapter'
import type { NewUserSeries } from '@/db/schemas/series-schema'
import {
  createUserSeries,
  deleteUserSeries,
  getUserSeries,
  updateUserSeries,
  upsertSeries,
} from '@/db/queries/series'
import { auth } from '@/lib/auth'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/tv'

export const searchTMDBSeries = createServerFn({ method: 'GET' })
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
      throw new Error('Failed to search series')
    }
    const data = await response.json()
    console.log('DATA: ', data)
    return data.results.map(adaptTMDBTVSearchResult)
  })

export const addSeries = createServerFn({ method: 'POST' })
  .inputValidator((data: { tmdbId: number }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const detailResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${data.tmdbId}?append_to_response=external_ids`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    )
    if (!detailResponse.ok) {
      console.error('Response failed: ', detailResponse.status)
      throw new Error('Failed to get series details')
    }
    const seriesDetails = await detailResponse.json()
    const adapted = adaptTMDBTVDetails(seriesDetails)
    const seriesResults = await upsertSeries(adapted)
    if (!seriesResults.success) {
      console.error('Failed to upsert series: ', seriesResults)
      throw new Error('Failed to save series')
    }
    const userSeriesResults = await createUserSeries({
      userId: session.user.id,
      seriesId: adapted.id,
    })
    if (!userSeriesResults.success) {
      console.error('Failed to save user series')
      throw new Error('Failed to save user series')
    }
    return userSeriesResults.data
  })

export const getUserSeriesServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })
  const result = await getUserSeries(session.user.id)
  if (!result.success) {
    throw new Error("Error getting user's series")
  }
  return result.data
})

export const updateUserSeriesServer = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: { id: string; updates: Partial<NewUserSeries> }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await updateUserSeries(
      data.id,
      session.user.id,
      data.updates,
    )
    if (!result.success) {
      throw new Error('Error updating series')
    }
    return result.data
  })

export const deleteUserSeriesServer = createServerFn({
  method: 'POST',
})
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await deleteUserSeries(data, session.user.id)
    if (!result.success) {
      throw new Error('Error deleting user series')
    }
    return { success: true, id: data }
  })
