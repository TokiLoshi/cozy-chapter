import { Edit, Loader2, Play, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import { formatDuration } from '../utils/utils'
import EditPodcastModal from './EditPodcastModal'
import type { Podcast, UserPodcast } from '@/db/schemas/podcast-schema'
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
  addPodcast,
  deleteUserPodcastServer,
  getUserPodcastsServer,
  searchSpotifyPodcasts,
  searchYouTubePodcasts,
} from '@/lib/server/podcasts'

type PodcastModalProps = {
  isOpen: boolean
  onClose: () => void
}

type PodcastItem = {
  podcast: Podcast
  userPodcast: UserPodcast
}

type SearchSource = 'spotify' | 'youTube'
type SourceFilter = 'all' | 'spotify' | 'youTube'

function SourceBadge({ source }: { source: string }) {
  const isSpotify = source === 'spotify'
  return (
    <>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${isSpotify ? 'bg-green-600/30 text-green-400' : 'bg-red-600/30 text-red-400'}`}
      >
        {isSpotify ? 'Spotify' : 'YouTube'}
      </span>
    </>
  )
}

function ExpandedPodcastCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: {
  item: PodcastItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {item.podcast.coverImageUrl && (
          <img
            src={item.podcast.coverImageUrl}
            alt={item.podcast.episodeTitle}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.podcast.episodeTitle}
          </h3>
          {item.podcast.showName && (
            <p className="text-sm text-slate-400">{item.podcast.showName}</p>
          )}
          <div className="mt-1">
            <SourceBadge source={item.podcast.source} />
          </div>
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Status */}
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userPodcast.status}
          </p>
        </DetailItem>
        {/** Duration */}
        <DetailItem label="Duration">
          <p className="text-sm font-medium text-slate-200">
            {formatDuration(item.podcast.durationMs)}
          </p>
        </DetailItem>
        {/** Progress */}
        {item.userPodcast.lastPositionMs &&
          item.userPodcast.lastPositionMs > 0 && (
            <DetailItem label="Progress">
              <p className="text-sm font-medium text-slate-200">
                {formatDuration(item.userPodcast.lastPositionMs)}
                {item.podcast.durationMs && (
                  <span className="text-slate-400">
                    {' '}
                    / {formatDuration(item.podcast.durationMs)}
                  </span>
                )}
              </p>
            </DetailItem>
          )}

        {/** Rating */}
        {item.userPodcast.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating rating={item.userPodcast.rating} maxStars={5} />
          </DetailItem>
        )}

        {/** Started at */}
        {item.userPodcast.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userPodcast.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Finished at */}
        {item.userPodcast.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userPodcast.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Published at */}
        {item.podcast.publishedAt && (
          <DetailItem label="Published">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.podcast.publishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}
      </div>

      {/** Play Button */}
      {item.podcast.externalUrl && (
        <div className="mb-4">
          <a
            href={item.podcast.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${item.podcast.source === 'spotify' ? 'bg-green-600' : 'bg-red-500'}`}
          >
            <Play className="w-4 h-4" />
            Play on {item.podcast.source === 'spotify' ? 'Spotify' : 'YouTube'}
          </a>
        </div>
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

      {/** Description */}
      {item.podcast.description && (
        <DisplayDescription description={item.podcast.description} />
      )}
    </BaseModal>
  )
}

function PodcastCard({
  item,
  onEdit,
  onDelete,
}: {
  item: PodcastItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {/** Image */}
        {item.podcast.coverImageUrl && (
          <img
            src={item.podcast.coverImageUrl}
            alt={item.podcast.episodeTitle}
            className="w-16 h-16 object-cover rounded flex-shrink-0"
          />
        )}
        {/** Title */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="font-medium text-slate-100 truncate">
            {item.podcast.episodeTitle}
          </h4>
          {/** Showname */}
          <p className="text-sm text-slate-300 truncate">
            {item.podcast.showName}
          </p>
          {/** Source Badge */}
          <div className="flex items-center gap-2 mt-1">
            <SourceBadge source={item.podcast.source} />
            {/** Duration */}
            <span className="text-xs text-slate-300">
              {formatDuration(item.podcast.durationMs)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <button
            className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash className="w-4 h-4" />
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

export default function PodcastModal({ isOpen, onClose }: PodcastModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchSource, setSearchSource] = useState<SearchSource>('spotify')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [expandedPodcast, setExpandedPodcast] = useState<PodcastItem | null>(
    null,
  )
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [podcastToEdit, setPodcastToEdit] = useState<{
    podcast: Podcast
    userPodcast: UserPodcast
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
    queryKey: ['podcast-search', debouncedQuery, searchSource],
    queryFn: () =>
      searchSource === 'spotify'
        ? searchSpotifyPodcasts({ data: debouncedQuery })
        : searchYouTubePodcasts({ data: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  })

  const { data: userPodcasts } = useQuery({
    queryKey: ['user-podcasts'],
    queryFn: () => getUserPodcastsServer(),
  })

  const addMutation = useMutation({
    mutationFn: (podcast: Omit<Podcast, 'createdAt' | 'updatedAt'>) =>
      addPodcast({ data: podcast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-podcasts'] })
      toast.success('Podcast added to your library')
    },
    onError: () => {
      toast.error('Failed to add podcast')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserPodcastServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-podcasts'] })
      toast.success('Podcast removed from your library')
    },
    onError: () => {
      toast.error('Failed to delete podcast')
    },
  })
  const isInLibrary = (podcastId: string) => {
    return userPodcasts?.some((item) => item.podcast.id === podcastId)
  }

  const handleAdd = (podcast: Omit<Podcast, 'createdAt' | 'updatedAt'>) => {
    addMutation.mutate(podcast)
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this podcast?', {
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

  const handleEdit = (item: { podcast: Podcast; userPodcast: UserPodcast }) => {
    setExpandedPodcast(null)
    setPodcastToEdit(item)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    onClose()
  }

  const handleCardClick = (item: PodcastItem) => {
    setExpandedPodcast(item)
  }

  const filterBySourceAndSearch = (
    items: Array<PodcastItem>,
  ): Array<PodcastItem> => {
    let filtered = items

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((item) => item.podcast.source === sourceFilter)
    }
    if (!librarySearch.trim()) return filtered

    const searchTerm = librarySearch.toLowerCase()
    return filtered.filter((item) => {
      const titleMatch = item.podcast.episodeTitle
        .toLowerCase()
        .includes(searchTerm)
      const showMatch = item.podcast.showName
        ?.toLowerCase()
        .includes(searchTerm)

      return titleMatch || showMatch
    })
  }

  const podcastsToListen = useMemo(() => {
    if (!userPodcasts) return []

    const byStatus = userPodcasts.filter(
      (item) => item.userPodcast.status === 'toListen',
    )
    return filterBySourceAndSearch(byStatus)
  }, [userPodcasts, librarySearch, sourceFilter])

  const podcastsListening = useMemo(() => {
    if (!userPodcasts) return []
    const byStatus = userPodcasts.filter(
      (item) => item.userPodcast.status === 'listening',
    )
    return filterBySourceAndSearch(byStatus)
  }, [userPodcasts, librarySearch, sourceFilter])

  const podcastsListened = useMemo(() => {
    if (!userPodcasts) return []
    const byStatus = userPodcasts.filter(
      (item) => item.userPodcast.status === 'listened',
    )
    return filterBySourceAndSearch(byStatus)
  }, [userPodcasts, librarySearch, sourceFilter])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
        />

        {/** Edit Modal */}
        {isEditOpen && podcastToEdit && (
          <EditPodcastModal
            podcast={podcastToEdit.podcast}
            userPodcast={podcastToEdit.userPodcast}
            onClose={() => {
              setIsEditOpen(false)
              setPodcastToEdit(null)
            }}
          />
        )}

        {/** Expanded Card */}
        {expandedPodcast && (
          <ExpandedPodcastCard
            item={expandedPodcast}
            onEdit={() => {
              handleEdit(expandedPodcast)
            }}
            onDelete={() => {
              handleDelete(expandedPodcast.userPodcast.id)
            }}
            onClose={() => setExpandedPodcast(null)}
          />
        )}

        {/** Main modal */}
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Podcasts</h2>
            <button
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              <XIcon />
            </button>
          </div>
          {/** Search */}
          <div className="p-4 border-b border-slate-700">
            {/** Source toggle */}
            <div className="flex gap-2 mb-3">
              <button
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${searchSource === 'spotify' ? 'bg-green-600 text-white' : 'text-slate-300 hover:bg-slate-600'}`}
                onClick={() => setSearchSource('spotify')}
              >
                Spotify
              </button>
              <button
                className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors ${searchSource === 'youTube' ? 'bg-red-500 text-slate-300' : ' text-white hover:text-slate-600'}`}
                onClick={() => setSearchSource('youTube')}
              >
                YouTube
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${searchSource === 'spotify' ? 'Spotify' : 'YouTube'} podcasts...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/** Search Results */}
          <div className="flex-1 overflow-y-auto p-4">
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
                  <div className="flex items-center justify-center py-8 ">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  </div>
                ) : searchError ? (
                  <p className="text-red-400 text-sm">
                    Failed to search. Please try again
                  </p>
                ) : searchResults?.length === 0 ? (
                  <p className="text-slate-400 text-sm">No podcasts found</p>
                ) : (
                  <div className="space-y-3">
                    {searchResults?.map(
                      (podcast: Omit<Podcast, 'createdAt' | 'updatedAt'>) => (
                        <div
                          key={podcast.id}
                          className="flex items-start gap-3 p-3 bg-slate-700/50"
                        >
                          {podcast.coverImageUrl && (
                            <img
                              src={podcast.coverImageUrl}
                              alt={podcast.episodeTitle}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-100">
                              {podcast.episodeTitle}
                            </h4>
                            <p className="text-sm text-slate-400">
                              {podcast.showName}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <SourceBadge source={podcast.source} />
                              <span className="text-sx text-slate-300">
                                {podcast.source}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAdd(podcast)}
                            disabled={
                              isInLibrary(podcast.id) || addMutation.isPending
                            }
                            className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            {addMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : isInLibrary(podcast.id) ? (
                              <span className="text-xs text-slate-300">
                                Added
                              </span>
                            ) : (
                              <Plus className="cursor-pointer text-white bg-amber-600 hover:bg-amber-500" />
                            )}
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/** User's Library */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-medium text-slate-400">
                Your Library
              </h3>
              {/** Source filter  */}
              <div className="flex gap-1">
                {(
                  [
                    { value: 'all', label: 'All' },
                    { value: 'spotify', label: 'Spotify' },
                    { value: 'youTube', label: 'YouTube' },
                  ] as Array<{ value: SourceFilter; label: string }>
                ).map((option) => (
                  <button
                    className={`cursor-pointer px-2 py-1 rounded text-xs font-medium transition-colors ${sourceFilter === option.value ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                    key={option.value}
                    onClick={() => setSourceFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {userPodcasts?.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No podcasts yet. Search above to add some and start listening!
              </p>
            ) : (
              <Tabs defaultValue="listening" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger
                    value="toListen"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    To Listen ({podcastsToListen.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="listening"
                    className="cursor-pointer data-[state=active]:bg-amber-500 text-slate-200"
                  >
                    Listening to ({podcastsListening.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="listened"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    Finished ({podcastsListened.length})
                  </TabsTrigger>
                </TabsList>

                {/** To Listen */}
                <TabsContent value="toListen" className="mt-4">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {podcastsToListen.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch || sourceFilter !== 'all'
                            ? 'No podcasts match your filters'
                            : 'No podcasts in your to listen to list yet'
                        }
                      />
                    ) : (
                      podcastsToListen.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.podcast.id}
                          onClick={() => handleCardClick(item)}
                        >
                          <PodcastCard
                            item={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userPodcast.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/** Listening To */}
                <TabsContent value="listening" className="mt-2">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {podcastsListening.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch || sourceFilter !== 'all'
                            ? 'No podcasts match your filter'
                            : 'No podcasts on your listening list yet'
                        }
                      />
                    ) : (
                      podcastsListening.map((item) => (
                        <div
                          className="cursor-pointer"
                          onClick={() => handleCardClick(item)}
                          key={item.podcast.id}
                        >
                          <PodcastCard
                            item={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userPodcast.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
                {/** Listened To */}
                <TabsContent value="listened" className="mt-2">
                  <SearchArea
                    value={librarySearch}
                    onChange={setLibrarySearch}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {podcastsListened.length === 0 ? (
                      <EmptyTabContent
                        message={
                          librarySearch || sourceFilter !== 'all'
                            ? 'No podcasts match your filter'
                            : "you don't have any podcasts you've finished yet"
                        }
                      />
                    ) : (
                      podcastsListened.map((item) => (
                        <div
                          className="cursor-pointer"
                          key={item.podcast.id}
                          onClick={() => handleCardClick}
                        >
                          <PodcastCard
                            item={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item.userPodcast.id)}
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
