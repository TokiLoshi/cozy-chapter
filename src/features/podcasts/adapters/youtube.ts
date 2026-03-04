import type { NewPodcast } from '../../../db/schemas/podcast-schema'

// YouTube video shape from search // https://developers.google.com/youtube/v3/docs/search/list
type YouTubeSearchItem = {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    channelTitle: string
    publishedAt: string
    thumbnails: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
}

// YouTube video details shape https://developers.google.com/youtube/v3/docs/videos/list
export type YouTubeVideoDetails = {
  id: string
  contentDetails: {
    duration: string // ISO 8601 format PT1H23M45S
  }
}

export function parseYouTubeDuration(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return null
  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)
  const total = (hours * 3600 + minutes * 60 + seconds) * 1000
  return total
}

export function adaptYouTubeVideo(
  item: YouTubeSearchItem,
  details?: YouTubeVideoDetails,
): Omit<NewPodcast, 'createdAt' | 'updataedAt'> {
  const thumbnail =
    item.snippet.thumbnails.high?.url ??
    item.snippet.thumbnails.medium?.url ??
    item.snippet.thumbnails.default?.url ??
    null
  return {
    id: `youtube:${item.id.videoId}`,
    showName: item.snippet.channelTitle,
    episodeTitle: item.snippet.title,
    description: item.snippet.description,
    coverImageUrl: thumbnail,
    durationMs: details
      ? parseYouTubeDuration(details.contentDetails.duration)
      : null,
    externalUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    source: 'youTube',
    publishedAt: new Date(item.snippet.publishedAt),
  }
}
