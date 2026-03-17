import type { NewTvSeries } from '@/db/schemas/series-schema'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// TMDB TV search shape https://developer.themoviedb.org/reference/search-tv
export type TMDBTVSearchResult = {
  id: number
  name: string
  overview: string | null
  poster_path: string | null
  genre_ids: Array<number>
  original_language: string | null
  first_air_date: string | null
  popularity: number
}

// TMDB TV details shape https://developer.themoviedb.org/reference/tv-series-details
export type TMDBTVDetails = {
  id: number
  name: string
  tagline: string | null
  overview: string | null
  poster_path: string | null
  original_language: string
  genres: Array<{ id: number; name: string }>
  number_of_seasons: number | null
  number_of_episodes: number | null
  first_air_date: string | null
  last_air_date: string | null
  external_ids?: {
    imdbId: string | null
    tvdbId: string | null
  }
}

export function adaptTMDBTVDetails(
  series: TMDBTVDetails,
): Omit<NewTvSeries, 'createdAt' | 'updatedAt'> {
  return {
    id: `tmdb:${series.id}`,
    imdbId: series.external_ids?.imdbId ?? null,
    title: series.name,
    tagline: series.tagline,
    originalLanguage: series.original_language,
    externalUrl: `https://themoviedb.org/tv/${series.id}`,
    overview: series.overview,
    posterPath: series.poster_path
      ? `${TMDB_IMAGE_BASE}${series.poster_path}`
      : null,
    genreIds: series.genres,
    numberOfSeasons: series.number_of_seasons,
    numberOfEpisodes: series.number_of_episodes,
    firstAirDate: series.first_air_date
      ? new Date(series.first_air_date)
      : null,
    lastAirDate: series.last_air_date ? new Date(series.last_air_date) : null,
  }
}

export function adaptTMDBTVSearchResult(
  series: TMDBTVSearchResult,
): Omit<NewTvSeries, 'createdAt' | 'updatedAt'> {
  return {
    id: `tmdb:${series.id}`,
    title: series.name,
    originalLanguage: series.original_language,
    externalUrl: `https://www.themoviedb.org/tv/${series.id}`,
    overview: series.overview,
    posterPath: series.poster_path
      ? `${TMDB_IMAGE_BASE}${series.poster_path}`
      : null,
    firstAirDate: series.first_air_date
      ? new Date(series.first_air_date)
      : null,
  }
}
