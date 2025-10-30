import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useMemo, useState } from 'react'
import Experience from '../components/Experience'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
// import { signOut } from '@/lib/auth-client'
import {
  deleteArticle,
  getArticlesbyId,
  getSingleBlog,
  updateArticle,
} from '@/db/queries/articles'
import { useAppForm } from '@/hooks/form'

// Authentication
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// User's blogs
const getUserBlogs = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })
  const userId = session.user.id
  const blogs = await getArticlesbyId(userId)
  return blogs
})

// Unusued
// const getUserBlogsByStatus = createServerFn({ method: 'GET' })
//   .inputValidator((data: ReadStatus) => data)
//   .handler(async ({ data: status }) => {
//     const session = await getSessionServer()
//     if (!session) throw redirect({ to: '/login' })
//     const userId = session.user.id
//     const blogs = await getArticleByStatus(userId, status)
//     return blogs
//   })

// Edit blog
export const getBlogToEdit = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      const blogId = data.id
      const singleBlog = getSingleBlog(blogId)
      console.log('Single. blog back from db: ', singleBlog)
    } catch (error) {
      console.log('Something went wrong getting blog: ', data.id)
      throw new Error('Issue getting single blog')
    }
  })

// Delete blog
export const deleteBlogs = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const blogId = data
    try {
      console.log('In delete server function passing this to the query: ', data)
      const deletedBlog = await deleteArticle(blogId)
      console.log('Deleted: ', deletedBlog)
      return { success: true, id: blogId }
    } catch (error) {
      console.error(
        'Oops, something went wrong deleting the article: ',
        error,
        blogId,
      )
      throw new Error('Something bad happened')
    }
  })

// Update blog
export const updateBlog = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Blog> }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      console.log('Updating blog with: ', data.id, data.updates)
      const updatedBlog = await updateArticle(data.id, data.updates)
      console.log('Updates from DB: ', updatedBlog)
      return { success: true, id: data.id }
    } catch (error) {
      console.error('Error updating blog: ', data.id, data.updates)
    }
    throw new Error('Something bad happend')
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

const EditModal = ({ blog }: { blog: Blog }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const form = useAppForm({
    defaultValues: {
      title: blog.title,
      url: blog.url || '',
      author: blog.author || '',
      description: blog.description || '',
      status: blog.status,
      estimatedReadingTime: blog.estimatedReadingTime || undefined,
      wordCount: blog.wordCount || undefined,
      notes: blog.notes || '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        // Title Required
        if (value.title.length === 0) {
          errors.fields.title = 'Title is required'
        }
        // Validate URL
        if (value.url && value.url.length > 0) {
          try {
            new URL(value.url)
          } catch {
            errors.fields.url = 'Must be a valid URL'
          }
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      console.log('Submitting form with: ', value)
      try {
        console.log('Submitting before db...')
        const article = await updateBlog({
          data: {
            id: blog.id,
            updates: value,
          },
        })
        console.log('Article successfully submitted: ', article)

        navigate({ to: '/readingroom' })
        setOpen(false)
      } catch (error) {
        console.log('Uh Oh spaghetti os, soemthing went wrong ', error)
      }
    },
  })
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Edit
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/** Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm text-white"
            onClick={() => setOpen(false)}
          />
          {/** Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Edit article
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Make changes to your article here
                  </p>
                </div>
                <button onClick={() => setOpen(false)}>x</button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="p-6 space-y-6 text-gray-100"
            >
              {/** Title field */}
              <form.AppField name="title">
                {(field) => (
                  <field.TextField label="Title" placeholder={blog.title} />
                )}
              </form.AppField>

              {/** URL Field */}
              <form.AppField name="url">
                {(field) => (
                  <field.TextField
                    label="url"
                    placeholder={blog.url ? blog.url : 'https://....'}
                  />
                )}
              </form.AppField>

              {/** Author */}
              <form.AppField name="author">
                {(field) => (
                  <field.TextField
                    label="author"
                    placeholder={blog.author ? blog.author : 'who wrote it?'}
                  />
                )}
              </form.AppField>

              {/** Description */}
              <form.AppField name="description">
                {(field) => (
                  <field.TextField
                    label="description"
                    placeholder={
                      blog.description
                        ? blog.description
                        : "description, what's it about?"
                    }
                  />
                )}
              </form.AppField>

              {/** Notes field */}
              <form.AppField name="notes">
                {(field) => <field.TextArea label="Notes" />}
              </form.AppField>

              {/** Status */}
              <form.AppField name="status">
                {(field) => (
                  <field.Select
                    label="Reading Status"
                    values={[
                      { label: 'To Read', value: 'toRead' },
                      { label: 'Reading', value: 'reading' },
                      { label: 'Read', value: 'read' },
                    ]}
                    placeholder="Select status"
                  />
                )}
              </form.AppField>

              <div className="flex justify-end">
                <form.AppForm>
                  <form.SubmitButton label="Submit" />
                </form.AppForm>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// Reading Room with modal
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    console.log('In client with the desire to delete: ', id)
    try {
      await deleteBlogs({ data: id })
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete article')
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
                        {blog.url && (
                          <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-300 hover:text-blue-200 text-sm mb-4 inline-block hover:underline"
                          >
                            {blog.url.length > 50
                              ? blog.url.substring(0, 50) + '...'
                              : blog.url}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                        <EditModal blog={blog} />
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="flex-2 bg-red-500 hover:bg-red-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
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
