import {
  Edit,
  Loader2,
  Play,
  PlaySquare,
  Plus,
  Search,
  Trash,
  XIcon,
} from 'lucide-react'
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
  DisplayNotes,
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
import { panelStyles } from '@/lib/panelStyles'

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
  const statusLabels: Record<UserMovie['status'], string> = {
    toWatch: 'To Watch',
    watching: 'Watching',
    watched: 'Watched',
  }
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {item.movie.posterPath ? (
          <img
            src={item.movie.posterPath}
            alt={item.movie.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <PlaySquare className="h-16 text-white" />
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
            {statusLabels[item.userMovie.status]}
          </p>
        </DetailItem>

        {/** Runtime */}
        {(item.movie.runtime ?? 0) > 0 && (
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
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-amber-600 hover:bg-amber-500"
            >
              <Play className="w-4 h-4 " />
              View on TMDB
            </a>
          </div>
        )}
      </div>
      {/** Overview */}
      {item.movie.overview && (
        <DisplayDescription description={item.movie.overview} />
      )}

      {/** Notes  */}
      {item.userMovie.notes && (
        <DisplayNotes description={item.userMovie.notes} />
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />
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
          <PlaySquare className="h-16 text-white" />
        )}
        {/** Title */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="font-medium text-slate-100 truncate">{item.title}</h4>
          {/** Tagline */}
          {item.tagline && (
            <p className="text-sm text-slate-300 truncate">{item.tagline}</p>
          )}

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
  const [expandedMovieId, setExpandedMovieId] = useState<string | null>(null)
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

  const expandedMovie = expandedMovieId
    ? (userMovies?.find((m) => m.userMovie.id === expandedMovieId) ?? null)
    : null

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
    setExpandedMovieId(null)
    setMovieToEdit(item)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    onClose()
  }

  const handleCardClick = (item: MovieItem) => {
    setExpandedMovieId(item.userMovie.id)
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
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div onClick={onClose} className={panelStyles.backdrop} />

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
            onClose={() => setExpandedMovieId(null)}
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
        {!isEditOpen && !expandedMovie && (
          <div
            className={`relative w-full max-w-4xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
          >
            <div className={panelStyles.header}>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Movies</h2>
                <button
                  className="cursor-pointer text-gray-400 hover:text-white text-2xl"
                  onClick={() => closeModal()}
                >
                  <XIcon />
                </button>
              </div>
            </div>

            {/** Search */}
            <div className="p-6">
              <div className="pb-4 border-b border-slate-700">
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
              {debouncedQuery.length > 2 && (
                <div className="p-4">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-slate-400">
                        Search Results
                      </h3>
                      <button
                        className="cursor-pointer text-slate-400 hover:text-slate-300 right-3 top-1/2 -translate-y-1/2 w-4 h-4"
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
                            <div
                              key={movie.id}
                              className="flex items-center gap-3"
                            >
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
                                    isInLibrary(movie.id) ||
                                    addMutation.isPending
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
                </div>
              )}

              {/** User's library  */}
              <div className="pt-4">
                <h3 className="text-sm font-medium text-slate-400">
                  Your Watchlist
                </h3>

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
                        <span>To Watch</span>
                        <span className="hidden sm:inline">
                          {moviesToWatch.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="watching"
                        className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                      >
                        <span>Watching</span>
                        <span className="hidden sm:inline">
                          {moviesWatching.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="watched"
                        className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                      >
                        <span>Watched</span>
                        <span className="hidden sm:inline">
                          {moviesWatched.length}
                        </span>
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
                                : 'No movies on your watched list yet'
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
        )}
      </div>
    </>
  )
}
