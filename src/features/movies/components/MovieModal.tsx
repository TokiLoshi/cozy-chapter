import { Edit, Loader2, Play, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import EditMovieModal from './EditMovieModal'
import type { Movie, UserMovie } from '@/db/schemas/movies-schema'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayStarRating,
} from '@/components/ExpandedCard'
import SearchArea from '@/components/SearchArea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  addMovie,
  deleteUserMovieServer,
  getUserMovieServer,
  searchTMDBMovies,
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
          <img
            src={item.movie.posterPath}
            alt={item.movie.title}
            className="w-16 h-16 object-cover rounded"
          />
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
        {item.movie.runtime && (
          <DetailItem label="Duration">
            <p className="text-sm font-medium text-slate-200">
              {item.movie.runtime}
            </p>
          </DetailItem>
        )}

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
      </div>
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
          <img
            src={item.posterPath}
            alt={item.title}
            className="w-16 h-16 object-cover rounded flex-shrink-0"
          />
        ) : (
          <Play />
        )}
        {/** Title */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="font-medium text-slate-100 truncate">{item.title}</h4>
          {/** Tagline */}
          <p className="text-sm text-slate-300 truncate">{item.tagline}</p>
          {/** Runtime */}
          {item.runtime && (
            <p className="text-sm text-slate-300">Runtime: {item.runtime}</p>
          )}

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

function EmptyTabContent({ message }: { message: string }) {
  return (
    <>
      <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
    </>
  )
}

export default function MovieModal({ isOpen, onClose }: MovieModal) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [expandedMovie, setExpandedMovie] = useState<MovieItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [movieToEdit, setMovieToEdit] = useState<{
    movie: Movie
    userMovie: UserMovie
  } | null>(null)
  const [librarySearch, setLibrarySearch] = useState('')
  const queryClient = useQueryClient()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['movie-search', debouncedQuery],
    queryFn: () => searchTMDBMovies({ data: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  })

  const { data: userMovies } = useQuery({
    queryKey: ['user-movies'],
    queryFn: () => getUserMovieServer(),
  })

  const addMutation = useMutation({
    mutationFn: (tmdbId: number) => addMovie({ data: { tmdbId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movies'] })
      toast.success('Movie added to your library')
    },
    onError: () => {
      toast.error('Failed to add movie')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserMovieServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-movies'] })
      toast.success('Movie was removed from you library')
    },
    onError: () => {
      toast.error('Failed to delete movie')
    },
  })

  const isInLibrary = (movieId: string) => {
    return userMovies?.some((item) => item.movie.id === movieId)
  }

  const handleAdd = (movie: Omit<Movie, 'createdAt' | 'updatedAt'>) => {
    const tmdbId = parseInt(movie.id.replace('tmdb:', ''))
    addMutation.mutate(tmdbId)
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this movie?', {
      action: {
        label: 'Delete',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  const handleEdit = (item: { movie: Movie; userMovie: UserMovie }) => {
    setExpandedMovie(null)
    setMovieToEdit(item)
    console.log('Editing: ', item.movie.title)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    onClose()
  }

  const handleCardClick = (item: MovieItem) => {
    setExpandedMovie(item)
  }

  const filteredMovies = (items: Array<MovieItem>): Array<MovieItem> => {
    if (!librarySearch.trim()) return items

    const searchTerm = librarySearch.toLowerCase()
    return items.filter((item) => {
      const titleMatch = item.movie.title.toLowerCase().includes(searchTerm)
      return titleMatch
    })
  }

  const moviesToWatch = useMemo(() => {
    if (!userMovies) return []

    const filtered = userMovies.filter(
      (item) => item.userMovie.status === 'toWatch',
    )
    return filteredMovies(filtered)
  }, [userMovies, librarySearch])

  const moviesWatching = useMemo(() => {
    if (!userMovies) return []

    const filtered = userMovies.filter(
      (item) => item.userMovie.status === 'watching',
    )
    return filteredMovies(filtered)
  }, [userMovies, librarySearch])

  const moviesWatched = useMemo(() => {
    if (!userMovies) return []
    const filtered = userMovies.filter(
      (item) => item.userMovie.status === 'watched',
    )
    return filteredMovies(filtered)
  }, [userMovies, librarySearch])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        {/** Edit Modal */}
        {isEditOpen && movieToEdit && (
          <EditMovieModal
            movie={movieToEdit.movie}
            userMovie={movieToEdit.userMovie}
            onClose={() => {
              setIsEditOpen(false)
              setMovieToEdit(null)
            }}
          />
        )}

        {/** Expanded Card */}
        {expandedMovie && (
          <ExpandedMovieCard
            onClose={() => setExpandedMovie(null)}
            item={expandedMovie}
            onEdit={() => {
              handleEdit(expandedMovie)
            }}
            onDelete={() => {
              handleDelete(expandedMovie.userMovie.id)
            }}
          />
        )}

        {/** Main modal */}
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Movies</h2>
            <button
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
              onClick={() => closeModal()}
            >
              <XIcon />
            </button>
          </div>
          {/** Search */}
          <div className="p-4 border-b border-slate-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          {/** Search Results */}
          <div className="flex flex-col overflow-y-auto p-4">
            {debouncedQuery.length > 2 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-400">
                    Search Results
                  </h3>
                  <button
                    className="cursor-pointer text-slate-400 hover:text-white"
                    onClick={() => {
                      setSearchQuery('')
                      setDebouncedQuery('')
                    }}
                  >
                    <XIcon />
                  </button>
                </div>
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  </div>
                ) : searchError ? (
                  <p className="text-red-400 text-sm">
                    Failed to search. Please Try again
                  </p>
                ) : searchResults?.length === 0 ? (
                  <p className="text-slate-400 text-sm">No movies found</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults?.map(
                      (movie: Omit<Movie, 'createdAt' | 'updatedAt'>) => (
                        <div key={movie.id} className="flex items-center gap-3">
                          {movie.posterPath && (
                            <img
                              src={movie.posterPath}
                              alt={movie.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-100">
                              {movie.title}
                            </h4>
                            <p className="text-sm text-slate-400">
                              {movie.tagline}
                            </p>
                            <button
                              onClick={() => handleAdd(movie)}
                              disabled={
                                isInLibrary(movie.id) || addMutation.isPending
                              }
                              className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                              {addMutation.isPending ? (
                                <Loader2 className="w-4 h-4" />
                              ) : isInLibrary(movie.id) ? (
                                <span className="text-xs text-slate-300">
                                  Added
                                </span>
                              ) : (
                                <Plus className="cursor-pointer text-white bg-amber-500 hover:bg-amber-500 disabled:cursor-not-allowed rounded-lg transition-colors" />
                              )}
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/** User's library  */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium text-slate-400">
                Your Watchlist
              </h3>
            </div>
            {userMovies?.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No movies yet. Search to add movies to your watchlist
              </p>
            ) : (
              <Tabs defaultValue="watching" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger
                    value="toWatch"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    To Watch ({moviesToWatch.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="watching"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    Watching ({moviesWatching.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="watched"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    Watched ({moviesWatched.length})
                  </TabsTrigger>
                </TabsList>

                {/** To Watch */}
                <TabsContent value="toWatch" className="mt-4">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moviesToWatch.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No movies match your filters'
                            : 'No movies on your watchlist yet'
                        }
                      />
                    ) : (
                      moviesToWatch.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.movie.id}
                          onClick={() => handleCardClick(item)}
                        >
                          <MovieCard
                            item={item.movie}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userMovie.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/** Watching  */}
                <TabsContent value="watching" className="mt-4">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moviesWatching.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No movies match your filters'
                            : 'No movies on your watching list yet'
                        }
                      />
                    ) : (
                      moviesWatching.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.movie.id}
                          onClick={() => handleCardClick(item)}
                        >
                          <MovieCard
                            item={item.movie}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userMovie.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/** Watched */}
                <TabsContent value="watched" className="mt-4">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moviesWatched.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No movies match your filter'
                            : 'No movies on your watchlist yet'
                        }
                      />
                    ) : (
                      moviesWatched.map((item) => (
                        <div
                          key={item.movie.id}
                          className="cursor-pointer"
                          onClick={() => handleCardClick(item)}
                        >
                          <MovieCard
                            item={item.movie}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userMovie.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
