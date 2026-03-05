import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import {
  createUserPodcast,
  deleteUserPodcast,
  getUserPodcast,
  updateUserPodcast,
  upsertPodcast,
} from '../../db/queries/podcasts'

import { adaptSpotifySearchResults } from '../../features/podcasts/adapters/spotify'
import { adaptYouTubeVideo } from '../../features/podcasts/adapters/youtube'
import type { YouTubeVideoDetails } from '@/features/podcasts/adapters/youtube'
import type {
  NewPodcast,
  NewUserPodcast,
} from '../../db/schemas/podcast-schema'
import { auth } from '@/lib/auth'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// TODO:
// Extract a utils so audio and podcast can both use the token
let cachedToken: { token: string; expiresAt: number } | null
async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt)
    return cachedToken.token

  const clientId = process.env.SPOTIFY_KEY
  const clientSecret = process.env.SPOTIFY_AUDIO_KEY

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get spotify token')
  }

  const data = await response.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: (Date.now() + (data.expires_in - 60)) * 1000,
  }
  return cachedToken.token
}

export const searchSpotifyPodcasts = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const token = await getSpotifyToken()

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=episode&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      console.error('Response failed with: ', response.status)
      console.error('Response error: ', response.body)
      throw new Error('Failed to search Spotify podcasts')
    }
    const data = await response.json()
    const adaptedResults = adaptSpotifySearchResults(data)

    return adaptedResults
  })

export const searchYouTubePodcasts = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const apiKey = process.env.YOUTUBE_API_KEY

    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + ' podcast')}&type=video&maxResults=10&key=${apiKey}`,
    )
    if (!searchResponse.ok) {
      throw new Error('Failed to search YouTube')
    }

    const searchData = await searchResponse.json()
    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(' ')

    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`,
    )

    const detailsData = detailsResponse.ok
      ? await detailsResponse.json()
      : { items: [] }

    const detailsMap = new Map<string, YouTubeVideoDetails>(
      detailsData.items.map((d: YouTubeVideoDetails) => [d.id, d]),
    )
    return searchData.items.map((item: any) =>
      adaptYouTubeVideo(item, detailsMap.get(item.id.videoId)),
    )
  })

export const addPodcast = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<NewPodcast, 'createdAt' | 'updatedAt'>) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const podcastResult = await upsertPodcast(data)
    if (!podcastResult.success) {
      throw new Error('Failed to save podcast')
    }

    const userPodcastResult = await createUserPodcast({
      userId: session.user.id,
      podcastId: data.id,
    })

    if (!userPodcastResult.success) {
      throw new Error('Failed to link podcast to user')
    }

    return userPodcastResult.data
  })

export const getUserPodcastsServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })

  const result = await getUserPodcast(session.user.id)
  if (!result.success) {
    throw new Error('Failed to get podcasts')
  }
  return result.data
})

export const updateUserPodcastServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<NewUserPodcast> }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await updateUserPodcast(
      data.id,
      session.user.id,
      data.updates,
    )

    if (!result.success) {
      throw new Error('Failed to update podcast')
    }
    return result.data
  })

export const deleteUserPodcastServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await deleteUserPodcast(data, session.user.id)
    if (!result.success) {
      throw new Error('Error deleting podcast')
    }
    return { success: true, id: data }
  })
