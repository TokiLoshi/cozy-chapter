import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useMemo, useState } from 'react'
import Experience from '../components/Experience'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
// import { signOut } from '@/lib/auth-client'
import { getArticlesbyId } from '@/db/queries/articles'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

const getUserBlogs = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })
  const userId = session.user.id
  const blogs = await getArticlesbyId(userId)
  return blogs
})

// const getUserBlogsByStatus = createServerFn({ method: 'GET' })
//   .inputValidator((data: ReadStatus) => data)
//   .handler(async ({ data: status }) => {
//     const session = await getSessionServer()
//     if (!session) throw redirect({ to: '/login' })
//     const userId = session.user.id
//     const blogs = await getArticleByStatus(userId, status)
//     return blogs
//   })

export const Route = createFileRoute('/readingroom')({
  loader: async () => {
    const session = await getSessionServer()
    console.log('Session: ', session)
    if (!session) throw redirect({ to: '/login' })
    const blogs = await getUserBlogs()
    return { session, blogs }
  },
  component: ReadingRoomComponent,
})

function ReadingRoomComponent() {
  const { session, blogs } = Route.useLoaderData()
  console.log('Reading room session: ', session)
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
    setSelectedStatus(status)
  }

  const closeModal = () => {
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

  return (
    <>
      <div className="relative w-full h-screen">
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
                {stats.toRead}
              </span>
            </div>
          </div>
        </div>

        {/** 3D component  */}
        <Experience onBookcaseClick={handleBookcaseClick} />

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
                  className="text-gray-400 hover:text-white text-2xl"
                  onClick={closeModal}
                >
                  x
                </button>
              </div>

              {/** Empty State */}
              {filteredBlogs.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No books in this category yet
                </div>
              )}

              {/** Blogs Grid */}
              {filteredBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBlogs.map((blog: Blog) => (
                    <div
                      key={blog.id}
                      className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {blog.title}
                      </h3>
                      {blog.description && (
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {blog.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span
                          className={`px-2 py-1 rounded-full ${
                            blog.status === 'toRead'
                              ? 'bg-yellow-500/20 text-yellow-200'
                              : blog.status === 'reading'
                                ? 'bg-blue-500/20 text-blue-200'
                                : 'bg-green-50/20 text-green-200'
                          }`}
                        >
                          {blog.status === 'toRead'
                            ? 'To Read'
                            : blog.status === 'reading'
                              ? 'Reading'
                              : 'Read'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate({ to: '/blogs' })}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                View Full Blog List
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
