import { XIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import BooksModal from './books/BookModal'
import ArticleCard from './articles/BlogsModal'
import SearchArea from './SearchArea'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { deleteBlogs } from '@/lib/server/articles'
import { getUserBookServer } from '@/lib/server/books'
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
  const [librarySearch, setLibrarySearch] = useState('')

  // Searchable blogs
  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter((item) => item.status === selectedStatus)
    if (!librarySearch.trim()) return filtered
    const searchTerm = librarySearch.toLowerCase()
    return filtered.filter((blog) => {
      const titleMatch = blog.title.toLowerCase().includes(searchTerm)
      const authorMatch = blog.author?.toLowerCase().includes(searchTerm)
      return titleMatch || authorMatch
    })
  }, [blogs, librarySearch, selectedStatus])
  // const filteredBlogs = blogs.filter((blog) => blog.status === selectedStatus)

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
                className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
              >
                Articles ({filteredBlogs.length})
              </TabsTrigger>
              <TabsTrigger
                value="books"
                className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
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
              <SearchArea value={librarySearch} onChange={setLibrarySearch} />
              {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  {librarySearch
                    ? 'No articles match your search'
                    : 'No articles in this category yet'}
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
              <BooksModal isOpen={isOpen} selectedStatus={selectedStatus} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
