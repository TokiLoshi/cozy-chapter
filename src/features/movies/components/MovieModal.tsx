import { Edit, Loader2, Play, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import type { Movie, UserMovie } from '@/db/schemas/movies-schema'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayStarRating,
} from '@/components/ExpandedCard'
import SearchArea from '@/components/SearchArea'
import {
  addMovie,
  deleteUserMovieServer,
  getUserMovieServer,
  searchTMDBMovies,
  updateUserMovieServer,
} from '@/lib/server/movies'

type MovieModal = {
  isOpen: boolean
  onClose: () => void
}

type MovieItem = {
  movie: Movie
  userMovie: UserMovie
}

function ExpandedMovieCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: {
  item: MovieItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {item.movie.posterPath && (
          <img src={item.movie.posterPath} alt={item.movie.title} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.movie.title}
          </h3>
          {/** Taglilne */}
          {item.movie.tagline && (
            <p className="text-sm font-medium text-slate-200">
              {item.movie.tagline}
            </p>
          )}
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Status */}
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userMovie.status}
          </p>
        </DetailItem>

        {/** Runtime */}
        <DetailItem label="Duration">
          <p className="text-sm font-medium text-slate-200">
            {item.movie.runtime}
          </p>
        </DetailItem>

        {/** Rating  */}
        {item.userMovie.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating rating={item.userMovie.rating} maxStars={5} />
          </DetailItem>
        )}

        {/** started at */}
        {item.userMovie.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userMovie.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** finished at */}
        {item.userMovie.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userMovie.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Release Date */}
        {item.movie.releaseDate && (
          <DetailItem label="Released">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.movie.releaseDate).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Original Language */}
        {item.movie.originalLanguage && (
          <DetailItem label="Language">
            <p className="text-sm font-medium text-slate-200">
              {item.movie.originalLanguage}
            </p>
          </DetailItem>
        )}

        {/** Genres */}
        {item.movie.genreIds && (
          <DetailItem label="Genres">
            <p className="text-sm font-medium text-slate-200">
              {item.movie.genreIds
                .map((g) => g.name)
                .filter(Boolean)
                .join(', ')}
            </p>
          </DetailItem>
        )}

        {/** watching On */}
        {item.userMovie.watchingOn && (
          <DetailItem label="Watching on">
            <p className="text-sm font-medium text-slate-200">
              {item.userMovie.watchingOn}
            </p>
          </DetailItem>
        )}

        {/** External URL */}
        {item.movie.externalUrl && (
          <div className="mb-4">
            <a
              href={item.movie.externalUrl}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-green-600"
            >
              <Play className="w-4 h-4" />
              View on TMDB
            </a>
          </div>
        )}

        {/** Notes  */}
        {item.userMovie.notes && (
          <DetailItem label="Notes">
            <p className="text-sm text-slate-400">{item.userMovie.notes}</p>
          </DetailItem>
        )}

        {/** Actions */}
        <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

        {/** Overview */}
        {item.movie.overview && (
          <DisplayDescription description={item.movie.overview} />
        )}
      </div>
    </BaseModal>
  )
}

function MovieCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Movie
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {/**  Poster */}
        {item.posterPath ? (
          <img src={item.posterPath} alt={item.title} />
        ) : (
          <Play />
        )}
        {/** Title */}
        <div className="flex-1 min-2-0 flex flex-col">
          <h4 className="font-medium text-slate-100 truncate">{item.title}</h4>
          {/** Tagline */}
          <p className="text-sm text-slate-300 truncate">{item.tagline}</p>
          Runtime
          <p className="text-sm text-slate-300">runtime: {item.runtime}</p>
          {/** Genres */}
          {item.genreIds && (
            <p className="text-sm text-slate-300">
              Genres:{' '}
              {item.genreIds
                .map((g) => g.name)
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}
