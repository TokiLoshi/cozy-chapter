import type { NewTvSeries } from '@/db/schemas/series-schema'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// TMDB TV search shape https://developer.themoviedb.org/reference/search-tv
export type TMDBTVSearchResult = {
  id: number
  name: string
  overview: string | null
  posterPath: string | null
  genreIds: Array<number>
  originalLanguage: string
  firstAirDate: string
  popularity: number
}

// TMDB TV details shape https://developer.themoviedb.org/reference/tv-series-details
export type TMDBTVDetails = {
  id: number
  name: string
  tagline: string | null
  overview: string | null
  posterPath: string | null
  originalLanguage: string
  genres: Array<{ id: number; name: string }>
  numberOfSeasons: number | null
  numberOfEpisodes: number | null
  firstAirDate: string
  lastAirDate: string | null
  externalIds?: {
    imdbId: string | null
    tvdbId: string | null
  }
}

export function adaptTMDBTVDetails(
  series: TMDBTVDetails,
): Omit<NewTvSeries, 'createdAt' | 'updatedAt'> {
  return {
    id: `tmdb:${series.id}`,
    imdbId: series.externalIds?.imdbId ?? null,
    title: series.name,
    tagline: series.tagline,
    originalLanguage: series.originalLanguage,
    externalUrl: `https://themoviedb.org/tv/${series.id}`,
    overview: series.overview,
    posterPath: series.posterPath
      ? `${TMDB_IMAGE_BASE}${series.posterPath}`
      : null,
    genreIds: series.genres,
    numberOfSeasons: series.numberOfSeasons,
    numberOfEpisodes: series.numberOfEpisodes,
    firstAirDate: series.firstAirDate ? new Date(series.firstAirDate) : null,
    lastAirDate: series.lastAirDate ? new Date(series.lastAirDate) : null,
  }
}
