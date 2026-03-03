import type { NewPodcast } from '../../../db/schemas/podcast-schema'

// Spotify episode shape https://developer.spotify.com/documentation/web-api/reference/search
type SpotifyEpisode = {
  id: string
  name: string
  description: string
  images: Array<{ url: string; height: number; width: number }> | null
  duration_ms: number
  external_urls: { spotify: string }
  release_date: string
  show: {
    name: string
    publisher: string
  }
}

export function adaptSpotifyEpisode(
  episode: SpotifyEpisode,
): Omit<NewPodcast, 'createdAt' | 'updataedAt'> {
  return {
    id: `spotify:${episode.id}`,
    showName: episode.show.name,
    episodeTitle: episode.name,
    description: episode.description,
    coverImageUrl: episode.images?.[0]?.url ?? null,
    durationMs: episode.duration_ms,
    externalUrl: episode.external_urls.spotify,
    source: 'spotify',
    publishedAt: episode.release_date ? new Date(episode.release_date) : null,
  }
}

export function adaptSpotifySearchResults(data: {
  episodes: { items: Array<SpotifyEpisode> }
}): Array<Omit<NewPodcast, 'createdAt' | 'updatedAt'>> {
  return data.episodes.items.map(adaptSpotifyEpisode)
}
