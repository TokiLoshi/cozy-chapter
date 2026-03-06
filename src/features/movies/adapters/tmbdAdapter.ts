import type { NewMovie } from '@/db/schemas/movies-schema'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// TMDB movie shape https://developer.themoviedb.org/reference/movie-details
export type TMDBSearchResult = {
  id: number
  title: string
  overview: string | null
  poster_path: string | null
  genre_ids: Array<number>
  original_language: string
  release_date: string
  popularity: number
}

export type TMDBMovieDetails = {
  id: number
  imdb_id: string | null
  title: string
  tagline: string | null
  overview: string | null
  poster_path: string | null
  original_language: string
  genres: Array<{ id: number; name: string }>
  runtime: number | null
  release_date: string
}

export function adaptTMDBMovie(
  movie: TMDBMovieDetails,
): Omit<NewMovie, 'createdAt' | 'updatedAt'> {
  return {
    id: `tmdb:${movie.id}`,
    imdbId: movie.imdb_id ?? null,
    title: movie.title,
    tagline: movie.tagline ?? null,
    originalLanguage: movie.original_language,
    externalUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    overview: movie.overview ?? null,
    posterPath: movie.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : null,
    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
  }
}

// Adapt from serch results:
export function adaptTMDBSearchResult(
  movie: TMDBSearchResult,
): Omit<NewMovie, 'createdAt' | 'updatedAt'> {
  return {
    id: `tmdb:${movie.id}`,
    imdbId: null,
    title: movie.title,
    tagline: null,
    originalLanguage: movie.original_language,
    externalUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    overview: movie.overview ?? null,
    posterPath: movie.poster_path
      ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
      : null,
    genreIds: null,
    releaseDate: movie.release_date ? new Date(movie.release_date) : null,
  }
}
