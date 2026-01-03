import { Loader2, Plus, Search, XIcon } from 'lucide-react'
// import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import type { AudioBooks } from '@/db/audiobook-schema'
import {
  addAudioBook,
  // deleteUserAudiobookServer,
  getUserAudiobooksServer,
  searchAudiobooks,
} from '@/lib/server/audioBook'
// import EditAudioBookModal from './EditAudioBookModal'
// import { useAppForm } from '@/hooks/form'

// type AudioBooksFormProps = {
//   isOpen: boolean
//   onClose: () => void
//   refreshPath: string
//   audiobooks?: Array<AudioBooks>
// }

type AudioBooksModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function AudioBooksModal({
  isOpen,
  onClose,
}: AudioBooksModalProps) {
  console.log('Audio data in audio books modal')

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
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
      toast.success('Audiobook added to your library')
    },
    onError: () => {
      toast.error('Failed to add audiobook')
    },
  })

  // Delete mutation
  // const deleteMutation = useMutation({
  //   mutationFn: (id: string) => deleteUserAudiobookServer({ data: id }),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['user-audiobooks'] })
  //     toast.success('Audiobook removed from your library')
  //   },
  //   onError: () => {
  //     toast.error('Faield to remove audiobook')
  //   },
  // })

  // check for existing audiobook
  const isInLibrary = (audiobookId: string) => {
    return userAudiobooks?.some((item) => item.audioBook.id === audiobookId)
  }

  const handleAdd = (
    audiobook: Omit<AudioBooks, 'createdAt' | 'updatedAt'>,
  ) => {
    addMutation.mutate(audiobook)
  }

  // const handleDelete = (id: string) => {
  //   toast('Are you sure you want to remove this audiobook?', {
  //     action: {
  //       label: 'Remove',
  //       onClick: () => deleteMutation.mutate(id),
  //     },
  //     cancel: {
  //       label: 'cancel',
  //       onClick: () => {},
  //     },
  //   })
  // }

  if (!isOpen) return null

  // const [isAddFormOpen, setisAddFormOpen] = useState(false)
  // console.log('Refresh path: ', refreshPath)
  // console.log('audio books in modal: ', audiobooks)

  // if (!isOpen) return null

  // const closeModal = () => {
  //   console.log('Close auidobooks modal ')
  //   onClose()
  // }

  // const navigate = useNavigate()

  // const [isEditOpen, setIsEditOpen ] = useState(false)
  // const [audioBookToEdit, setAudioBookToEdit ] = useState(null)

  // const handleEdit = (audioBook: AudioBook) => {
  //   setAudioBookToEdit(audioBook)
  //   setIsEditOpen(true)
  // }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
      <div className="bg-slate-800 rounded w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">Audiobooks</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded">
            <XIcon className="w-5 h-5 text-slate-400" />
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
                <p className="text-slate-400 text-sm">No audiobooks found.</p>
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
                          <span className="text-xs text-slate-300">Added</span>
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
      </div>
    </div>
  )
}
