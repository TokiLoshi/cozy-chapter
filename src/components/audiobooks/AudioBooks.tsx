import { Edit, Link, Loader2, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayStarRating,
} from '../ExpandedCard'
import SearchArea from '../SearchArea'
import EditAudioBookModal from './EditAudioBookModal'
import type { AudioBooks, UserAudioBooks } from '@/db/schemas/audiobook-schema'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  addAudioBook,
  deleteUserAudiobookServer,
  getUserAudiobooksServer,
  searchAudiobooks,
} from '@/lib/server/audioBook'

type AudioBooksModalProps = {
  isOpen: boolean
  onClose: () => void
}

type AudioBookItem = {
  audioBook: AudioBooks
  userAudioBook: UserAudioBooks
}

type ExpandedAudioCardProps = {
  item: AudioBookItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

function ExpandedAudioCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: ExpandedAudioCardProps) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {/** Cover image  */}
        {item.audioBook.coverImageUrl && (
          <img
            src={item.audioBook.coverImageUrl}
            alt={item.audioBook.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.audioBook.title}
          </h3>
          <p className="text-sm text-slate-400">
            Authors: {item.audioBook.authors?.join(', ')}
          </p>
          {item.audioBook.narrators && item.audioBook.narrators.length > 0 && (
            <p className="text-sm text-slate-400">
              Narrated by: {item.audioBook.narrators.join(', ')}
            </p>
          )}
        </div>
      </div>
      {/** Details Grid  */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userAudioBook.status}
          </p>
        </DetailItem>

        {/** Last Chapter */}
        <DetailItem label="Progress">
          <p className="text-sm font-medium text-slate-200">
            Chapter {item.userAudioBook.lastChapter || 0} /{''}
            {item.audioBook.totalChapters ?? 'chapters'}
          </p>
        </DetailItem>

        {/** Rating */}
        {item.userAudioBook.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating
              rating={item.userAudioBook.rating}
              maxStars={5}
            />
          </DetailItem>
        )}

        {/** Started At */}
        {item.userAudioBook.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userAudioBook.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Finished at */}
        {item.userAudioBook.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userAudioBook.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}
      </div>
      {/** External URL  */}
      {item.audioBook.externalUrl && (
        <div className="mb-4">
          <a
            href={item.audioBook.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-500 hover:text-amber-400 underline mb-4 block"
          >
            <Link />
            View on Spotify
          </a>
        </div>
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

      {/** Description */}
      {item.audioBook.description && (
        <DisplayDescription description={item.audioBook.description} />
      )}
    </BaseModal>
  )
}

function AudioBookCard({
  item,
  onEdit,
  onDelete,
}: {
  item: AudioBookItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {item.audioBook.coverImageUrl && (
          <img
            src={item.audioBook.coverImageUrl}
            alt={item.audioBook.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-100 truncate">
            {item.audioBook.title}
          </h4>
          <p className="text-sm text-slate-400 truncate">
            {item.audioBook.authors?.join(', ')}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-300">
              Chapter {item.userAudioBook.lastChapter} /{' '}
              {item.audioBook.totalChapters}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
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
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyTabContent({ message }: { message: string }) {
  return <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
}

export default function AudioBooksModal({
  isOpen,
  onClose,
}: AudioBooksModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [audioBookToEdit, setAudioBookToEdit] = useState<{
    audioBook: AudioBooks
    userAudioBook: UserAudioBooks
  } | null>(null)
  const queryClient = useQueryClient()
  const [expandedAudioBook, setExpandedAudioBook] =
    useState<AudioBookItem | null>(null)
  // Filter options
  const [librarySearch, setLibrarySearch] = useState('')

  // const [ sortOrder, setSortOrder ] = useState<'newest' | 'oldest'>('newest')

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  // Search spotify
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['audiobook-search', debouncedQuery],
    queryFn: () => searchAudiobooks({ data: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  })

  // User audiobooks
  const { data: userAudiobooks } = useQuery({
    queryKey: ['user-audiobooks'],
    queryFn: () => getUserAudiobooksServer(),
  })

  // Audiobook mutation
  const addMutation = useMutation({
    mutationFn: (audibook: Omit<AudioBooks, 'createdAt' | 'updatedAt'>) =>
      addAudioBook({
        data: audibook,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-audiobooks'] })
      // setSearchQuery('')
      // setDebouncedQuery('')
      toast.success('Audiobook added to your library')
    },
    onError: () => {
      toast.error('Failed to add audiobook')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserAudiobookServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-audiobooks'] })
      toast.success('Audiobook removed from your library')
    },
    onError: () => {
      toast.error('Faield to remove audiobook')
    },
  })

  // check for existing audiobook
  const isInLibrary = (audiobookId: string) => {
    return userAudiobooks?.some((item) => item.audioBook.id === audiobookId)
  }

  const handleAdd = (
    audiobook: Omit<AudioBooks, 'createdAt' | 'updatedAt'>,
  ) => {
    addMutation.mutate(audiobook)
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to remove this audiobook?', {
      action: {
        label: 'Remove',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'cancel',
        onClick: () => {},
      },
    })
  }

  const handleEdit = (item: {
    audioBook: AudioBooks
    userAudioBook: UserAudioBooks
  }) => {
    setExpandedAudioBook(null)
    setAudioBookToEdit(item)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    onClose()
  }

  const handleCardClick = (item: AudioBookItem) => {
    setExpandedAudioBook(item)
  }

  // Searchable audio books
  const audioToListen = useMemo(() => {
    if (!userAudiobooks) return []

    const filtered = userAudiobooks.filter(
      (book) => book.userAudioBook.status === 'toListen',
    )

    if (!librarySearch.trim()) return filtered

    return filtered.filter((book) =>
      book.audioBook.title.toLowerCase().includes(librarySearch),
    )
  }, [userAudiobooks, librarySearch])

  const audioListening = useMemo(() => {
    if (!userAudiobooks) return []
    const filtered = userAudiobooks.filter(
      (book) => book.userAudioBook.status === 'listening',
    )
    if (!librarySearch.trim()) return filtered
    return filtered.filter((book) =>
      book.audioBook.title.toLowerCase().includes(librarySearch),
    )
  }, [userAudiobooks, librarySearch])

  const audioListened = useMemo(() => {
    if (!userAudiobooks) return []

    const filtered = userAudiobooks.filter(
      (book) => book.userAudioBook.status === 'listened',
    )

    if (!librarySearch.trim()) return filtered
    return filtered.filter((book) =>
      book.audioBook.title.toLowerCase().includes(librarySearch),
    )
  }, [userAudiobooks, librarySearch])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        {/** Edit modal */}
        {isEditOpen && audioBookToEdit && (
          <EditAudioBookModal
            audioBook={audioBookToEdit.audioBook}
            userAudioBook={audioBookToEdit.userAudioBook}
            onClose={() => {
              setIsEditOpen(false)
              setAudioBookToEdit(null)
            }}
          />
        )}
        {expandedAudioBook && (
          <ExpandedAudioCard
            item={expandedAudioBook}
            onEdit={() => handleEdit(expandedAudioBook)}
            onDelete={() => handleDelete(expandedAudioBook.userAudioBook.id!)}
            onClose={() => setExpandedAudioBook(null)}
          />
        )}
        {!isEditOpen && (
          <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Audiobooks</h2>
              <button
                className="cursor-pointer text-gray-400 hover:text-white text-2xl"
                onClick={closeModal}
              >
                <XIcon />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search for audiobooks..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/** Audiobooks  */}

            {/** Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/** Search Results */}
              {debouncedQuery.length > 2 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-slate-400 mb-3">
                      Search Results
                    </h3>
                    <button
                      className="cursor-pointer right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
                      Failed to search. Please try again
                    </p>
                  ) : searchResults?.length === 0 ? (
                    <p className="text-slate-400 text-sm">
                      No audiobooks found.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {searchResults?.map((audiobook: AudioBooks) => (
                        <div
                          key={audiobook.id}
                          className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                        >
                          {audiobook.coverImageUrl && (
                            <img
                              src={audiobook.coverImageUrl}
                              alt={audiobook.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-100 truncate">
                              {audiobook.title}
                            </h4>
                            <p className="text-sm text-slate-400 truncate">
                              {audiobook.authors?.join(', ')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAdd(audiobook)}
                            disabled={
                              isInLibrary(audiobook.id) || addMutation.isPending
                            }
                            className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            {addMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : isInLibrary(audiobook.id) ? (
                              <span className="text-xs text-slate-300">
                                Added
                              </span>
                            ) : (
                              <Plus className="w-4 h-4 text-white cursor-pointer" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/** User's Library */}
            <div className="pt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                Your Library
              </h3>

              {userAudiobooks?.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No audiobooks yet. Search above to add some!
                </p>
              ) : (
                <Tabs defaultValue="listening" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger
                      value="toListen"
                      className="curor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                    >
                      To Listen to ({audioToListen.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="listening"
                      className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                    >
                      Listening To ({audioListening.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="listened"
                      className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                    >
                      Finished ({audioListened.length})
                    </TabsTrigger>
                  </TabsList>
                  {/** To Listen to  */}
                  <TabsContent value="toListen" className="mt-4">
                    <SearchArea
                      value={librarySearch}
                      onChange={setLibrarySearch}
                    />
                    <div className="space-y-3">
                      {audioToListen.length === 0 ? (
                        <EmptyTabContent message="No audiobooks in your queue yet" />
                      ) : (
                        audioToListen.map((item) => (
                          <div
                            onClick={() => handleCardClick(item)}
                            className="cursor-pointer"
                          >
                            <AudioBookCard
                              key={item.audioBook.id}
                              item={item}
                              onEdit={() => handleEdit(item)}
                              onDelete={() =>
                                handleDelete(item.userAudioBook.id)
                              }
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  {/** Listening to  */}
                  <TabsContent value="listening" className="mt-4">
                    <SearchArea
                      value={librarySearch}
                      onChange={setLibrarySearch}
                    />
                    <div className="space-y-3">
                      {audioListening.length === 0 ? (
                        <EmptyTabContent message="No audiobooks in your queue yet" />
                      ) : (
                        audioListening.map((item) => (
                          <>
                            <div
                              onClick={() => handleCardClick(item)}
                              className="cursor-pointer"
                            >
                              <AudioBookCard
                                key={item.audioBook.id}
                                item={item}
                                onEdit={() => handleEdit(item)}
                                onDelete={() =>
                                  handleDelete(item.userAudioBook.id)
                                }
                              />
                            </div>
                          </>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  {/** Listened to  */}
                  <TabsContent value="listened" className="mt-4">
                    <SearchArea
                      value={librarySearch}
                      onChange={setLibrarySearch}
                    />
                    <div className="space-y-3">
                      {audioListened.length === 0 ? (
                        <EmptyTabContent message="No audiobooks in your queue yet" />
                      ) : (
                        audioListened.map((item) => (
                          <div
                            onClick={() => handleCardClick(item)}
                            className="cursor-pointer"
                          >
                            <AudioBookCard
                              key={item.audioBook.id}
                              item={item}
                              onEdit={() => handleEdit(item)}
                              onDelete={() =>
                                handleDelete(item.userAudioBook.id)
                              }
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
        )}
      </div>
    </>
  )
}
