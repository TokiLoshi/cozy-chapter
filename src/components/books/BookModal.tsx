import { Edit, Link, Loader2, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayStarRating,
} from '../ExpandedCard'
import EditBookModal from './EditBookModal'
import type { Books, UserBooks } from '@/db/schemas/book-schema'
import {
  addBook,
  deleteUserBookServer,
  getUserBookServer,
  searchBooks,
} from '@/lib/server/books'

type BookModalProps = {
  isOpen: boolean
  selectedStatus: 'toRead' | 'reading' | 'read'
}

type BookItem = {
  book: Books
  userBook: UserBooks
}

type ExpandedBookProps = {
  item: BookItem
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

function ExpandedBookCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: ExpandedBookProps) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        {/** Cover Image */}
        {item.book.coverImageUrl && (
          <img
            src={item.book.coverImageUrl}
            alt={item.book.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.book.title}
          </h3>
          {item.book.subtitle && (
            <p className="text-sm text-slate-300">{item.book.subtitle}</p>
          )}
          <p className="text-sm text-slate-300">
            Authors: {item.book.authors?.join(', ')}
          </p>
          {item.book.publisher && (
            <p className="text-sm text-slate-300">
              Published {item.book.publishedDate ?? 'uknown date'} by{' '}
              {item.book.publisher}
            </p>
          )}
          {item.book.pageCount && (
            <p className="text-sm text-slate-400">
              {item.book.pageCount} pages{' '}
            </p>
          )}
          {item.book.categories && (
            <p className="text-sm text-slate-300">
              Category: {item.book.categories.join(', ')}
            </p>
          )}
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Status */}
        <DetailItem label="Status">
          <p className="text-sm font-medium text-slate-200">
            {item.userBook.status}
          </p>
        </DetailItem>

        {/** Last Chapter */}
        <DetailItem label="Progress">
          <p className="text-sm font-medium text-slate-200">
            Chapter {item.userBook.lastChapter || 0}
          </p>
        </DetailItem>

        {/** Rating */}
        {item.userBook.rating && (
          <DetailItem label="Rating">
            <DisplayStarRating rating={item.userBook.rating} maxStars={5} />
          </DetailItem>
        )}

        {/** Started At */}
        {item.userBook.startedAt && (
          <DetailItem label="Started">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userBook.startedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}

        {/** Finished at */}
        {item.userBook.finishedAt && (
          <DetailItem label="Finished">
            <p className="text-sm font-medium text-slate-200">
              {new Date(item.userBook.finishedAt).toLocaleDateString()}
            </p>
          </DetailItem>
        )}
      </div>

      {/** External URL */}
      {item.book.previewLink && (
        <div className="mb-4">
          <a
            href={item.book.previewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-500 hover:text-amber-400 underline mb-4 block"
          >
            <Link />
            View
          </a>
        </div>
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

      {/** Description */}
      {item.book.description && (
        <DisplayDescription description={item.book.description} />
      )}
    </BaseModal>
  )
}

export function BookCard({
  item,
  onEdit,
  onDelete,
}: {
  item: { book: Books; userBook: UserBooks }
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {item.book.coverImageUrl && (
          <img
            src={item.book.coverImageUrl}
            alt={item.book.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-100 truncate">
            {item.book.title}
          </h4>
          <p className="text-sm text-slate-400 truncate">
            {item.book.authors?.join(',')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-300">
              Page {item.userBook.currentPage} / {item.book.pageCount}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={onEdit}
            className="cursor-pointer bg-amber-500/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

export default function BooksModal({ isOpen, selectedStatus }: BookModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [showBookSearch, setShowBookSearch] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [bookToEdit, setBookToEdit] = useState<{
    book: Books
    userBook: UserBooks
  } | null>(null)
  const queryClient = useQueryClient()
  const [expandedBook, setExpandedBook] = useState<BookItem | null>(null)
  // const [librarySearch, setLibrarySearch] = useState('')

  const { data: userBooks } = useQuery({
    queryKey: ['user-books'],
    queryFn: () => getUserBookServer(),
  })

  const statusMap = {
    toRead: 'toRead',
    reading: 'reading',
    read: 'read',
  }

  const filteredBooks = userBooks?.filter(
    (item) => item.userBook.status === statusMap[selectedStatus],
  )

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

  const addBookMutation = useMutation({
    mutationFn: (book: Omit<Books, 'createdAt' | 'updatedAt'>) =>
      addBook({ data: { book, status: selectedStatus } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-books'] })
      setSearchQuery('')
      setDebouncedQuery('')
      setShowBookSearch(false)
      toast.success('Book added to your library')
    },
    onError: () => {
      toast.error('Failed to add book')
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

  const handleDelete = (id: string) => {
    toast('Are you sure you want to remove this book? ', {
      action: {
        label: 'remove',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'cancel',
        onClick: () => {},
      },
    })
  }

  const handleEdit = (item: { book: Books; userBook: UserBooks }) => {
    setBookToEdit(item)
    setIsEditOpen(true)
  }

  const handleCardClick = (item: BookItem) => {
    console.log('Clicked on ', item)
    setExpandedBook(item)
  }

  if (!isOpen) return null

  return (
    <>
      {/** Backdrop */}

      {/** Edit Modal */}
      {isEditOpen && bookToEdit && (
        <EditBookModal
          book={bookToEdit.book}
          userBook={bookToEdit.userBook}
          onClose={() => {
            setIsEditOpen(false)
            setBookToEdit(null)
          }}
        />
      )}
      {expandedBook && (
        <ExpandedBookCard
          item={expandedBook}
          onEdit={() => handleEdit(expandedBook)}
          onDelete={() => handleDelete(expandedBook.userBook.id!)}
          onClose={() => setExpandedBook(null)}
        />
      )}

      {!isEditOpen && (
        <>
          {/** Search  */}
          {!showBookSearch ? (
            <button
              onClick={() => setShowBookSearch(true)}
              className="cursor-pointer bg-amber-600 hover:bg-amber-500 mb-4 py-2 px-4 text-white rounded-lg"
            >
              + Add Book
            </button>
          ) : (
            <div className="mb-4 p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Search Books</h4>
                <button
                  onClick={() => {
                    setShowBookSearch(false)
                    setSearchQuery('')
                    setDebouncedQuery('')
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Google Books..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {debouncedQuery.length > 2 && (
                <div className="mt-3 max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    </div>
                  ) : searchError ? (
                    <p className="text-red-400 text-sm">
                      Failed to search. Please try again
                    </p>
                  ) : searchResults?.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No books found
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults?.map((book: Books) => (
                        <div
                          key={book.id}
                          className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg"
                        >
                          {book.coverImageUrl && (
                            <img
                              src={book.coverImageUrl}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">
                              {book.title}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              {book.authors?.join(', ')}
                            </p>
                          </div>
                          <button
                            onClick={() => addBookMutation.mutate(book)}
                            disabled={isInLibrary(book.id)}
                            className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-lg"
                          >
                            {isInLibrary(book.id) ? (
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
          )}

          {/** Users books */}
          {filteredBooks && filteredBooks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              {' '}
              No books in this category yet
            </p>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBooks &&
                  filteredBooks.map((item) => (
                    <div onClick={() => handleCardClick(item)}>
                      <BookCard
                        key={item.book.id}
                        item={item}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item.userBook.id)}
                      />
                    </div>
                  ))}
              </div>
            </ScrollArea>
          )}
        </>
      )}
    </>
  )
}
