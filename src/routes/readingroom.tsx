import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { Link, Trash, XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import CreditsModal from '../components/Credits'
import Experience from '../components/Experience'
import EditModal from '../components/EditModal'
import ArticleModal from '../components/ArticleModal'
import PlantModal from '../components/PlantModal'
import {
  bushSound,
  closeBookSound,
  handleDecksClick,
  handleFirePlaceClick,
  handleGuitarClick,
  lampClickSound,
  pagesTurning,
} from '../components/SoundEffects'
import AudioComponent from '../components/Audio'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'

import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserPlants } from '@/lib/server/plants'
import { deleteBlogs, getUserBlogs } from '@/lib/server/articles'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Authentication
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createFileRoute('/readingroom')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const blogs = await getUserBlogs()
    const plants = await getUserPlants()
    return { session, blogs, plants }
  },
  component: ReadingRoomComponent,
})

// Reading Room with modal
function ReadingRoomComponent() {
  const { session, blogs, plants } = Route.useLoaderData()
  console.log('Plants: ', plants)
  const navigate = useNavigate()
  // const [showBlogsOverlay, setShowBlogsOverlay] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus | null>(null)

  const filteredBlogs = useMemo(() => {
    if (!selectedStatus) return []
    return blogs.filter((blog: Blog) => blog.status === selectedStatus)
  }, [blogs, selectedStatus])

  const stats = useMemo(() => {
    return {
      toRead: blogs.filter((blog: Blog) => blog.status === 'toRead').length,
      reading: blogs.filter((blog: Blog) => blog.status === 'reading').length,
      read: blogs.filter((blog: Blog) => blog.status === 'read').length,
      total: blogs.length,
    }
  }, [blogs])

  const handleBookcaseClick = (status: ReadStatus) => {
    pagesTurning()
    setSelectedStatus(status)
  }

  const closeModal = () => {
    closeBookSound()
    setSelectedStatus(null)
  }

  const getModalTitle = () => {
    switch (selectedStatus) {
      case 'read':
        return "Articles you've read"
      case 'reading':
        return 'Currently Reading'
      case 'toRead':
        return 'Want to Read'
      default:
        return 'Your Reading List'
    }
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this article?', {
      description: 'This action cannot be undone.',
      classNames: {
        toast: 'bg-slate-800 border-slate-700',
        title: 'text-slate-100',
        description: 'text-slate-400',
        actionButton: 'bg-amber-600 hover:bg-amber-500 text-white',
        cancelButton: 'bg-slate-600 hover:bg-slate-500 text-slate-200',
      },
      action: {
        label: 'Delete',
        onClick: async () => {
          const loadingToast = toast.loading('Deleting article...', {
            classNames: {
              toast: 'bg-slate-800 border-slate-700',
              title: 'text-slate-100',
            },
          })
          try {
            await deleteBlogs({ data: id })
            toast.dismiss(loadingToast)
            toast.success('Article deleted successfully!', {
              classNames: {
                toast: 'bg-slate-800 border-slate-700',
                title: 'text-slate-100',
              },
            })
            navigate({ to: '/readingroom' })
          } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Failed to delete article', {
              description: 'Please try again.',
              classNames: {
                toast: 'bg-slate-800 border-slate-700',
                title: 'text-slate-100',
                description: 'text-slate-400',
              },
            })
            console.error('Something went wrong deleting blog: ', error, id)
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  const [isCreditsOpen, setIsCreditsOpen] = useState(false)

  const handleCreditsClick = () => {
    setIsCreditsOpen(!isCreditsOpen)
  }

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)

  const [isLampOn, setIsLampOn] = useState(false)

  const handleLampClick = () => {
    lampClickSound()
    setIsLampOn(!isLampOn)
  }

  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false)

  const handleOrchidClick = () => {
    setIsPlantModalOpen(!isPlantModalOpen)
  }

  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  console.log('modal: ', isBookModalOpen)
  return (
    <>
      {/** Audio Overlay top right */}
      <div className="relative w-full h-screen">
        <div className="absolute top-6 right-6 z-10 items-center bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <AudioComponent />
        </div>

        {/** Stats Overlay - Top Left */}
        <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              welcome back, {session.user.name}!
            </h2>
            <p className="text-sm text-gray-400">
              {stats.total} {stats.total === 1 ? 'article' : 'articles'} in
              total
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">To Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.toRead}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">Reading</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.reading}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.read}
              </span>
            </div>
          </div>
        </div>

        {/** 3D component  */}
        <Experience
          onBookcaseClick={handleBookcaseClick}
          onCreditsClick={handleCreditsClick}
          onDecksClick={handleDecksClick}
          onFireClick={handleFirePlaceClick}
          onGuitarClick={handleGuitarClick}
          onLampClick={handleLampClick}
          isLampOn={isLampOn}
          onPlantClick={bushSound}
          onOrchidClick={handleOrchidClick}
        />

        {/** Plant Modal */}
        {isPlantModalOpen && (
          <PlantModal
            isOpen={isPlantModalOpen}
            onClose={() => setIsPlantModalOpen(false)}
            refreshPath="/readingroom"
            plants={plants || []}
          />
        )}

        {/** Credits Overlay */}
        {isCreditsOpen && (
          <CreditsModal
            isOpen={isCreditsOpen}
            onClose={() => setIsCreditsOpen(false)}
          />
        )}

        {/** Article modal */}
        <ArticleModal
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          refreshPath="/readingroom"
        />

        {/** Blogs Overlay */}
        {selectedStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/** Backdrop */}
            <div
              className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/** Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {getModalTitle()}
                </h2>

                <button
                  className="cursor-pointer text-gray-400 hover:text-white text-2xl"
                  onClick={closeModal}
                >
                  <XIcon />
                </button>
              </div>

              {/** Tabs */}
              <Tabs defaultValue="articles" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="articles">Articles</TabsTrigger>
                  <TabsTrigger value="books">Books</TabsTrigger>
                </TabsList>
                <TabsContent value="articles">
                  <button
                    className="bg-white mb-3 py-2 text-indigo-800/90 hover:text-indigo-700 hover:bg-gray-100 cursor-pointer rounded-lg px-6"
                    onClick={() => {
                      closeModal()
                      setIsArticleModalOpen(true)
                    }}
                  >
                    + Add Article
                  </button>

                  {/** Empty State */}
                  {filteredBlogs.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No books in this category yet
                    </div>
                  )}

                  {/** Blogs Grid */}
                  {filteredBlogs.length > 0 && (
                    <ScrollArea className="h-[500px] p-2 ">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredBlogs.map((blog: Blog) => (
                          <div
                            key={blog.id}
                            className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all"
                          >
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {blog.title}
                            </h3>
                            {blog.author && (
                              <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                <span className="text-l font-semibold">
                                  Author:{' '}
                                </span>
                                {blog.author}
                              </p>
                            )}
                            {blog.description && (
                              <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                <span className="text-l font-semibold">
                                  Description:{' '}
                                </span>
                                {blog.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              {blog.notes && (
                                <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                  <span className="text-l font-semibold">
                                    Notes:
                                  </span>{' '}
                                  {blog.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                              {blog.url && (
                                <>
                                  <Link className="w-4 h-4 flex-shrink-0" />
                                  <a
                                    href={blog.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-blue-200 text-sm hover:underline truncate"
                                  >
                                    {blog.url.length > 50
                                      ? blog.url.substring(0, 50) + '...'
                                      : blog.url}
                                  </a>
                                </>
                              )}
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 items-center">
                              <EditModal
                                blog={blog}
                                refreshPath="/readingroom"
                              />

                              <div className="flex-1"></div>
                              <button
                                onClick={() => handleDelete(blog.id)}
                                className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                              >
                                <Trash className="w-4 h-4" />
                                <span className="text-sm">Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </TabsContent>
                {/** Books tab */}
                <TabsContent value="books">
                  <button
                    className="bg-white mb-3 py-2 text-green-800/90 hover:text-green-700 hover:bg-gray-100 cursor-pointer rounded-lg px-6"
                    onClick={() => {
                      closeModal()
                      setIsBookModalOpen(true)
                    }}
                  >
                    + Add Book
                  </button>
                  <p>Books go here </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
