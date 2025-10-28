import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useState } from 'react'
import Experience from '../components/Experience'
import type { Blog } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth-client'
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
  const navigate = useNavigate()
  const [showBlogsOverlay, setShowBlogsOverlay] = useState(false)

  return (
    <>
      <div className="relative w-full h-screen">
        <Experience onBookcaseClick={() => setShowBlogsOverlay(true)} />
        {/** Blogs Overlay */}

        {showBlogsOverlay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/** Backdrop */}
            <div
              className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
              onClick={() => setShowBlogsOverlay(false)}
            />

            {/** Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Your Reading List
                </h2>
                <button
                  className="text-gray-400 hover:text-white text-2xl"
                  onClick={() => setShowBlogsOverlay(false)}
                >
                  x
                </button>
              </div>

              {/** Blogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogs.map((blog: Blog) => (
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
              <button
                onClick={() => navigate({ to: '/blogs' })}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                View Full Blog List
              </button>
            </div>
          </div>
        )}

        <div className="mx-auto text-white bg-slate-500 py-2 px-3 rounded">
          <h1 className="text-2xl">Welcome to the reading room</h1>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <div>
            <button
              onClick={async () => {
                console.log('Logout clicked')
                await signOut()
                navigate({ to: '/login' })
              }}
              className="bg-green-500 text-white py-2 px-2 rounded mt-6"
            >
              Logout user
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
