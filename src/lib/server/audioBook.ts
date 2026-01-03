import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../auth'
import type { AudioBooks, UserAudioBooks } from '@/db/audiobook-schema'
import {
  createUserAudiobook,
  deleteUserAudiobook,
  getUserAudiobooks,
  updateUserAudiobook,
  upsertAudiobook,
} from '@/db/queries/audibooks'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

let cachedToken: { token: string; expiresAt: number } | null = null

async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

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
    expiresAt: (Date.now() + (data.expires_in - 60)) * 10000,
  }
  return cachedToken.token
}

export const searchAudiobooks = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const session = await getSessionServer()

    if (!session) throw redirect({ to: '/login' })

    const token = await getSpotifyToken()

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=audiobook&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    console.log('Response from spotify: ', response)

    if (!response.ok) {
      throw new Error('Failed to search spotify')
    }

    const data = await response.json()
    console.log('Json data from spotify: ', data)

    return data.audiobooks.items.map((item: any) => ({
      id: item.id,
      title: item.name,
      description: item.description,
      edition: item.edition,
      externalUrl: item.external_urls?.spotify,
      href: item.href,
      coverImageUrl: item.images?.[0]?.url,
      totalChapters: item.total_chapters,
      authors: item.authors?.map((a: any) => a.name) ?? [],
      narrators: item.narrators?.map((n: any) => n.name) ?? [],
    }))
  })

export const addAudioBook = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<AudioBooks, 'createdAt' | 'updatedAt'>) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()

    if (!session) {
      throw redirect({ to: '/login' })
    }

    // Handle audiobooks others have already uploaded
    const audiobookResult = await upsertAudiobook(data)
    if (!audiobookResult.success) {
      throw new Error('Failed to save audiobook')
    }

    // Link audiobook to user
    const userAudiobookResult = await createUserAudiobook({
      userId: session.user.id,
      audioBookId: data.id,
    })
    if (!userAudiobookResult.success) {
      throw new Error('Failed to link audiobook to user')
    }

    return userAudiobookResult.data
  })

export const getUserAudiobooksServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await getSessionServer()

  if (!session) throw redirect({ to: '/login' })

  const result = await getUserAudiobooks(session.user.id)

  if (!result.success) {
    throw new Error('Failed to get audiobooks')
  }
  return result.data
})

export const updateUserAudiobookServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<UserAudioBooks> }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await updateUserAudiobook(
      data.id,
      session.user.id,
      data.updates,
    )

    if (!result.success) {
      throw new Error('Failed to update audiobook')
    }

    return result.data
  })

export const deleteUserAudiobookServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await deleteUserAudiobook(session.user.id, data)

    if (!result.success) {
      throw new Error('Error deleting user audiobook')
    }

    return { success: true, id: data }
  })
