import { Loader2, Plus, Search, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useState } from 'react'
// import EditModal from './EditModal'
import ArticleCard from './BlogsModal'
import BookCard from './BookModal'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import type { Books } from '@/db/book-schema'
import { deleteBlogs } from '@/lib/server/articles'
import {
  addBook,
  deleteUserBookServer,
  getUserBookServer,
  searchBooks,
} from '@/lib/server/books'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

type ReadingModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedStatus: ReadStatus
  blogs: Array<Blog>
  onAddArticleClick: () => void
}

export default function ReadingModal({
  isOpen,
  onClose,
  selectedStatus,
  blogs,
  onAddArticleClick,
}: ReadingModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [showBookSearch, setShowBookSearch] = useState(false)

  // Reading Material
  const filteredBlogs = blogs.filter((blog) => blog.status === selectedStatus)
  const { data: userBooks } = useQuery({
    queryKey: ['user-books'],
    queryFn: () => getUserBookServer(),
  })
  const statusMap: Record<ReadStatus, string> = {
    toRead: 'toRead',
    reading: 'reading',
    read: 'read',
  }

  const filteredBooks = userBooks?.filter(
    (item) => item.userBook.status === statusMap[selectedStatus],
  )

  // Debounced search for books
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setTimeout(() => setDebouncedQuery(value), 500)
  }

  const { data: searchResults, isLoading: isSearching } = useQuery({
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

  const deleteArticleMutation = (id: string) => {
    toast('Are you sure you want to delete this article?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await deleteBlogs({ data: id })
            toast.success('Article deleted')
            navigate({ to: '/readingroom' })
          } catch (error) {
            console.error(`Error deleting article ${(error as Error).message}`)
            toast.error('Failed to delete article, please try again')
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    })
  }

  const deleteBookMutation = useMutation({
    mutationFn: (id: string) => deleteUserBookServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-books'] })
      toast.success('Book removed from library')
    },
  })

  const handleDeleteBook = (id: string) => {
    toast('Are you sure you want to remove this book?', {
      action: {
        label: 'Remove',
        onClick: () => deleteBookMutation.mutate(id),
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    })
  }

  const isBookInLibrary = (bookId: string) => {
    return userBooks?.some((item) => item.book.id === bookId)
  }

  const getModalTitle = () => {
    switch (selectedStatus) {
      case 'read':
        return 'Finished Reading'
      case 'reading':
        return 'Currently Reading'
      case 'toRead':
        return 'Want to Read'
      default:
        return 'Your Reading List'
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/** Modal */}
        <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{getModalTitle()}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-white"
            >
              <XIcon />
            </button>
          </div>

          {/** Tabs */}
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800">
              <TabsTrigger
                value="articles"
                className="curor-pointer data-[state=active]:bg-amber-600 text-slate-200"
              >
                Articles ({filteredBlogs.length})
              </TabsTrigger>
              <TabsTrigger
                value="books"
                className="curor-pointer data-[state=active]:bg-amber-600 text-slate-200"
              >
                Books ({filteredBooks ? filteredBooks.length : 0})
              </TabsTrigger>
            </TabsList>

            {/** Articles  */}
            <TabsContent value="articles">
              <button
                onClick={onAddArticleClick}
                className="bg-amber-600 hover:bg-amber-500 mb-4 py-2 px-4 text-white rounded-lg"
              >
                + Add Article{' '}
              </button>
              {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  No articles in this category yet
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBlogs.map((blog: Blog) => (
                      <ArticleCard
                        key={blog.id}
                        item={blog}
                        onDelete={() => deleteArticleMutation}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {/** Books Tab */}
            <TabsContent value="books">
              {/** Add / Search Toggle */}
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
                                  className="w--10 h-14 object-cover rounded"
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
                                disabled={isBookInLibrary(book.id)}
                                className="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-lg"
                              >
                                {isBookInLibrary(book.id) ? (
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
                        <BookCard
                          key={item.book.id}
                          item={item}
                          onEdit={() => {
                            // TODO: Open edit modal
                            console.log('Edit book: ', item)
                          }}
                          onDelete={() => handleDeleteBook(item.userBook.id)}
                        />
                      ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
