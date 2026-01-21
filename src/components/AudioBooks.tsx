import { Edit, Loader2, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import EditAudioBookModal from './EditAudioBookModal'
import type { AudioBooks, UserAudioBooks } from '@/db/audiobook-schema'
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

export default function AudioBooksModal({
  isOpen,
  onClose,
}: AudioBooksModalProps) {
  // const [isAddFormOpen, setisAddFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [audioBookToEdit, setAudioBookToEdit] = useState<{
    audioBook: AudioBooks
    userAudioBook: UserAudioBooks
  } | null>(null)
  const queryClient = useQueryClient()

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
      setSearchQuery('')
      setDebouncedQuery('')
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
    setAudioBookToEdit(item)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    console.log('Close auidobooks modal ')
    onClose()
  }

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
            refreshPath={'/readingroom'}
            onClose={() => {
              setIsEditOpen(false)
              setAudioBookToEdit(null)
            }}
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
                  <h3 className="text-sm font-medium text-slate-400 mb-3">
                    Search Results
                  </h3>
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
                            <p className="text-xs text-slate-500">
                              {audiobook.totalChapters} chapters
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
                              <Plus className="w-4 h-4 text-white" />
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
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                Your Library
              </h3>
              {userAudiobooks?.length === 0 ? (
                <p className="text-slate-400 text-sm">
                  No audiobooks yet. Search above to add some!
                </p>
              ) : (
                <div className="space-y-3">
                  {userAudiobooks?.map((item) => (
                    <div
                      key={item.audioBook.id}
                      className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                    >
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
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-600 text-slate-300">
                            {item.userAudioBook.status}
                          </span>
                          <span className="text-slate-300">
                            last chapter:{' '}
                            {item.userAudioBook.lastChapter &&
                              item.userAudioBook.lastChapter > 0 && (
                                <span className="text-xs text-slate-300">
                                  Chapter {item.userAudioBook.lastChapter}/{' '}
                                  {item.audioBook.totalChapters}
                                </span>
                              )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 items-center">
                        <button
                          onClick={() => handleEdit(item)}
                          className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.userAudioBook.id)}
                          className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
