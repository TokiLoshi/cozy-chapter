import { Edit, Loader2, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import type { Books, UserBooks } from '@/db/book-schema'
import {
  addBook,
  deleteUserBookServer,
  getUserBookServer,
  searchBooks,
  // updateUserBookServer,
} from '@/lib/server/books'

type BookModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function BooksModal({ isOpen, onClose }: BookModalProps) {
  // Debounced Search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
    }, 500)
    return () => clearTimeout(timeoutId)
  }

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ['book-search', debouncedQuery],
    queryFn: () => searchBooks({ data: debouncedQuery }),
    enabled: debouncedQuery.length > 2,
  })
  const { data: userBooks } = useQuery({
    queryKey: ['user-books'],
    queryFn: () => getUserBookServer(),
  })

  const addMutation = useMutation({
    mutationFn: (book: Omit<Books, 'createdAt' | 'updatedAt'>) =>
      addBook({
        data: book,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-books'] })
      setSearchQuery('')
      setDebouncedQuery('')
      toast.success('Book added to your library')
    },
    onError: () => {
      toast.error('Failed to add book to library')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUserBookServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-books'] })
      toast.success('Book removed from your library')
    },
    onError: () => {
      toast.error('Failed to remove book')
    },
  })

  const isInLibrary = (bookId: string) => {
    return userBooks?.some((item) => item.book.id === bookId)
  }

  const handleAdd = (book: Omit<Books, 'createdAt' | 'updatedAt'>) => {
    addMutation.mutate(book)
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to remove this book?', {
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

  const handleEdit = (item: { book: Books; userBook: UserBooks }) => {
    console.log('Trying to edit: ', item)
    setBookToEdit(item)
    setIsEditOpen(true)
  }

  const closeModal = () => {
    console.log('Close books modal')
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
        {isEditOpen && bookToEdit && <div>Edit stuff to go here</div>}
        {!isEditOpen && (
          <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Books</h2>
              <button
                onClick={closeModal}
                className="cursor-pointer text-gray-400 hover:text-white text-2xl"
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
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/** Books */}
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
                    <p className="text-slate-400 text-sm">No books found.</p>
                  ) : (
                    <div className="space-y-3">
                      {searchResults?.map((book: Books) => (
                        <div
                          key={book.id}
                          className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                        >
                          {book.coverImageUrl && (
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-100 truncate">
                              {book.title}
                            </h4>
                            <p className="text-sm text-slate-400 truncate">
                              {book.authors?.join(', ')}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAdd(book)}
                            disabled={
                              isInLibrary(book.id) || addMutation.isPending
                            }
                            className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            {addMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                            ) : isInLibrary(book.id) ? (
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

            {/** User's Library  */}
            <div className="pt-4">Library to go here</div>
          </div>
        )}
      </div>
    </>
  )
}
