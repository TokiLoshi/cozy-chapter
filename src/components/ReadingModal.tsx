import { XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import BooksModal from './books/BookModal'
import { ArticleCardModal, ExpandedArticleCard } from './articles/ArticleModal'
import SearchArea from './SearchArea'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { deleteBlogs, getUserBlogs } from '@/lib/server/articles'
import { getUserBookServer } from '@/lib/server/books'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { panelStyles } from '@/lib/panelStyles'

type ReadingModalProps = {
  isOpen: boolean
  onClose: () => void
  selectedStatus: ReadStatus
  onAddArticleClick: () => void
  defaultTab: 'articles' | 'books' | null
}

export default function ReadingModal({
  isOpen,
  onClose,
  selectedStatus,
  onAddArticleClick,
  defaultTab,
}: ReadingModalProps) {
  const [librarySearch, setLibrarySearch] = useState('')
  const queryClient = useQueryClient()
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(
    null,
  )

  const { data: blogs } = useQuery({
    queryKey: ['user-blogs'],
    queryFn: () => getUserBlogs(),
  })
  // Searchable blogs
  const filteredBlogs = useMemo(() => {
    if (!blogs) return []
    const filtered = blogs.filter((item) => item.status === selectedStatus)
    if (!librarySearch.trim()) return filtered
    const searchTerm = librarySearch.toLowerCase()
    return filtered.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(searchTerm)
      const authorMatch = item.author?.toLowerCase().includes(searchTerm)
      return titleMatch || authorMatch
    })
  }, [blogs, librarySearch, selectedStatus])

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlogs({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-blogs'] })
      toast.success('Article deleted')
    },
    onError: () => toast.error('Failed to delete article, please try again.'),
  })

  const handleDeleteArticle = (id: string) => {
    toast('Are you sure you want to delete this article?', {
      action: {
        label: 'Delete',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'cancel',
        onClick: () => {},
      },
    })
  }

  const expandedArticle = expandedArticleId
    ? (blogs?.find((b) => b.id === expandedArticleId) ?? null)
    : null

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div onClick={onClose} className={panelStyles.backdrop} />

        {/** Modal */}
        <div
          className={`relative w-full max-w-4xl max-h-[85dvh] overflow-y-auto p-6 ${panelStyles.container}`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">{getModalTitle()}</h2>
            <button
              onClick={onClose}
              className="cursor-pointer font-bold text-gray-400 hover:text-white text-2xl"
            >
              <XIcon />
            </button>
          </div>

          {/** Tabs */}
          <Tabs defaultValue={defaultTab ?? 'articles'} className="w-full">
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
                className="bg-amber-600 cursor-pointer hover:bg-amber-500 mb-4 py-2 px-4 text-white rounded-lg"
              >
                + Add Article{' '}
              </button>
              <SearchArea value={librarySearch} onChange={setLibrarySearch} />
              {expandedArticle && (
                <ExpandedArticleCard
                  item={expandedArticle}
                  onDelete={() => handleDeleteArticle(expandedArticle.id)}
                  onClose={() => setExpandedArticleId(null)}
                />
              )}
              {filteredBlogs.length === 0 ? (
                <p className="text-center text-gray-400 py-8">
                  {librarySearch
                    ? 'No articles match your search.'
                    : 'No articles in this category yet.'}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBlogs.map((blog: Blog) => (
                    <div
                      key={blog.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedArticleId(blog.id)}
                    >
                      <ArticleCardModal
                        key={blog.id}
                        item={blog}
                        onDelete={() => handleDeleteArticle(blog.id)}
                      />
                    </div>
                  ))}
                </div>
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
