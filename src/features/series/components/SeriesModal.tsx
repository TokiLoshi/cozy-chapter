import { Edit, Loader2, Play, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import EditSeriesModal from './EditSeriesModal'
import type { TvSeries, UserSeries } from '@/db/schemas/series-schema'
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
  addSeries,
  deleteUserSeriesServer,
  getUserSeriesServer,
  searchTMDBSeries,
} from '@/lib/server/series'

type SeriesModal = {
  isOpen: boolean
  onClose: () => void
}

type SeriesItem = {
  series: TvSeries
  userSeries: UserSeries
}

function ExpandedSeriesCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: {
  item: SeriesItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {item.series.posterPath && (
          <img
            src={item.series.posterPath}
            alt={item.series.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.series.title}
          </h3>
          {/** Taglilne */}
          {item.series.tagline && (
            <p className="text-sm font-medium text-slate-200">
              {item.series.tagline}
            </p>
          )}
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Status */}
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userSeries.status}
          </p>
        </DetailItem>

        {/** Seasons */}
        {item.series.numberOfSeasons && (
          <DetailItem label="Seasons">
            <p className="text-sm font-medium text-slate-200">
              {item.series.numberOfSeasons}
            </p>
          </DetailItem>
        )}

        {/** Episodes */}
        {/** Seasons */}
        {item.series.numberOfEpisodes && (
          <DetailItem label="Episodes">
            <p className="text-sm font-medium text-slate-200">
              {item.series.numberOfEpisodes}
            </p>
          </DetailItem>
        )}

        {/** Rating  */}
        {item.userSeries.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating rating={item.userSeries.rating} maxStars={5} />
          </DetailItem>
        )}

        {/** started at */}
        {item.userSeries.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userSeries.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** finished at */}
        {item.userSeries.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userSeries.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Release Date */}
        {item.series.firstAirDate && (
          <DetailItem label="First Released">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.series.firstAirDate).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Last Air Date */}
        {item.series.lastAirDate && (
          <DetailItem label="Last Released">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.series.lastAirDate).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Original Language */}
        {item.series.originalLanguage && (
          <DetailItem label="Language">
            <p className="text-sm font-medium text-slate-200">
              {item.series.originalLanguage}
            </p>
          </DetailItem>
        )}

        {/** Genres */}
        {item.series.genreIds && (
          <DetailItem label="Genres">
            <p className="text-sm font-medium text-slate-200">
              {item.series.genreIds
                .map((g) => g.name)
                .filter(Boolean)
                .join(', ')}
            </p>
          </DetailItem>
        )}

        {/** watching On */}
        {item.userSeries.watchingOn && (
          <DetailItem label="Watching on">
            <p className="text-sm font-medium text-slate-200">
              {item.userSeries.watchingOn}
            </p>
          </DetailItem>
        )}

        {/** External URL */}
        {item.series.externalUrl && (
          <div className="mb-4">
            <a
              href={item.series.externalUrl}
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
      {item.userSeries.notes && (
        <DetailItem label="Notes">
          <p className="text-sm text-slate-400">{item.userSeries.notes}</p>
        </DetailItem>
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

      {/** Overview */}
      {item.series.overview && (
        <DisplayDescription description={item.series.overview} />
      )}
    </BaseModal>
  )
}

function SeriesCard({
  item,
  onEdit,
  onDelete,
}: {
  item: TvSeries
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
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
          {/** Seasons */}
          {item.numberOfSeasons && (
            <p className="text-sm text-slate-300">
              Seasons: {item.numberOfSeasons}
            </p>
          )}

          {/** Seasons */}
          {item.numberOfEpisodes && (
            <p className="text-sm text-slate-300">
              Episodes: {item.numberOfEpisodes}
            </p>
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

export default function SeriesModal({ isOpen, onClose }: SeriesModal) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [expandedSeries, setExpandedSeries] = useState<SeriesItem | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [seriesToEdit, setSeriesToEdit] = useState<{
    series: TvSeries
    userSeries: UserSeries
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
    queryKey: ['series-search', debouncedQuery],
    queryFn: () => searchTMDBSeries({ data: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  })

  const { data: userSeries } = useQuery({
    queryKey: ['user-series'],
    queryFn: () => getUserSeriesServer(),
  })

  const addMutation = useMutation({
    mutationFn: (tmdbId: number) => addSeries({ data: { tmdbId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-series'] })
      toast.success('Series added to your library')
    },
    onError: () => {
      toast.error('Failed to add series')
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserSeriesServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-series'] })
      toast.success('Series was removed from you library')
    },
    onError: () => {
      toast.error('Failed to delete series')
    },
  })

  const isInLibrary = (seriesId: string) => {
    return userSeries?.some((item) => item.series.id === seriesId)
  }
  const handleAdd = (series: Omit<TvSeries, 'createdAt' | 'updatedAt'>) => {
    const tmdbId = parseInt(series.id.replace('tmdb:', ''))
    addMutation.mutate(tmdbId)
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this series?', {
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
  const handleEdit = (item: { series: TvSeries; userSeries: UserSeries }) => {
    setExpandedSeries(null)
    setSeriesToEdit(item)
    console.log('Editing: ', item.series.title)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    onClose()
  }
  const handleCardClick = (item: SeriesItem | null) => {
    setExpandedSeries(item)
  }

  const filteredSeries = (items: Array<SeriesItem>): Array<SeriesItem> => {
    if (!librarySearch.trim()) return items

    const searchTerm = librarySearch.toLowerCase()
    return items.filter((item) => {
      const titleMatch = item.series.title.toLowerCase().includes(searchTerm)
      return titleMatch
    })
  }

  const seriesToWatch = useMemo(() => {
    if (!userSeries) return []
    const filtered = userSeries.filter(
      (item) => item.userSeries.status === 'toWatch',
    )
    return filteredSeries(filtered)
  }, [userSeries, librarySearch])

  const seriesWatching = useMemo(() => {
    if (!userSeries) return []
    const filtered = userSeries.filter(
      (item) => item.userSeries.status === 'watching',
    )
    return filteredSeries(filtered)
  }, [userSeries, librarySearch])

  const seriesWatched = useMemo(() => {
    if (!userSeries) return []
    const filtered = userSeries.filter(
      (item) => item.userSeries.status === 'watched',
    )
    return filteredSeries(filtered)
  }, [userSeries, librarySearch])

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
        {isEditOpen && seriesToEdit && (
          <EditSeriesModal
            series={seriesToEdit.series}
            userSeries={seriesToEdit.userSeries}
            onClose={() => {
              setIsEditOpen(false)
              setSeriesToEdit(null)
            }}
          />
        )}

        {/** Expanded Card */}
        {expandedSeries && (
          <ExpandedSeriesCard
            onClose={() => setExpandedSeries(null)}
            item={expandedSeries}
            onEdit={() => {
              handleEdit(expandedSeries)
            }}
            onDelete={() => {
              handleDelete(expandedSeries.userSeries.id)
            }}
          />
        )}

        {/** Main modal */}
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Series</h2>
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
                placeholder="Search Series..."
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
                  <p className="text-slate-400 text-sm">No Series found</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults?.map(
                      (series: Omit<TvSeries, 'createdAt' | 'updatedAt'>) => (
                        <div
                          key={series.id}
                          className="flex items-center gap-3"
                        >
                          {series.posterPath && (
                            <img
                              src={series.posterPath}
                              alt={series.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-100">
                              {series.title}
                            </h4>
                            <p className="text-sm text-slate-400">
                              {series.tagline}
                            </p>
                            <button
                              onClick={() => handleAdd(series)}
                              disabled={
                                isInLibrary(series.id) || addMutation.isPending
                              }
                              className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                              {addMutation.isPending ? (
                                <Loader2 className="w-4 h-4" />
                              ) : isInLibrary(series.id) ? (
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
            {userSeries?.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No series yet. Search to add series to your watchlist
              </p>
            ) : (
              <Tabs defaultValue="watching" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger
                    value="toWatch"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    To Watch ({seriesToWatch.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="watching"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    Watching ({seriesWatching.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="watched"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    Watched ({seriesWatched.length})
                  </TabsTrigger>
                </TabsList>

                {/** To Watch */}
                <TabsContent value="toWatch" className="mt-4">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seriesToWatch.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No series match your filters'
                            : 'No series on your watchlist yet'
                        }
                      />
                    ) : (
                      seriesToWatch.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.series.id}
                          onClick={() => handleCardClick(item)}
                        >
                          <SeriesCard
                            item={item.series}
                            onClose={() => closeModal()}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userSeries.id)}
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
                    {seriesWatching.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No series match your filters'
                            : 'No series on your watching list yet'
                        }
                      />
                    ) : (
                      seriesWatching.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.series.id}
                          onClick={() => handleCardClick(item)}
                        >
                          <SeriesCard
                            item={item.series}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userSeries.id)}
                            onClose={() => closeModal()}
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
                    {seriesWatched.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch
                            ? 'No series match your filter'
                            : 'No series on your watchlist yet'
                        }
                      />
                    ) : (
                      seriesWatched.map((item) => (
                        <div
                          key={item.series.id}
                          className="cursor-pointer"
                          onClick={() => handleCardClick(item)}
                        >
                          <SeriesCard
                            item={item.series}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userSeries.id)}
                            onClose={() => onClose()}
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
