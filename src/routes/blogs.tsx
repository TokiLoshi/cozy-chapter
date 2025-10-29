import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../lib/auth'
import type { Blog } from '@/lib/types/Blog'
import {
  deleteArticle,
  getArticlesbyId,
  getSingleBlog,
  updateArticle,
} from '@/db/queries/articles'
import { useAppForm } from '@/hooks/form'
import { signOut } from '@/lib/auth-client'

// import { getSessionServer } from '@/lib/utils'

export const getSessionServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequest().headers })
    return session
  },
)

export const getBlogs = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getSessionServer()
  if (!session) throw redirect({ to: '/login' })
  const userId = session.user.id
  const blogs = await getArticlesbyId(userId)
  console.log('Blogs from DB: ', blogs)
  return { session, blogs }
})

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

// TODO: Figure out where exactly we're going to pull the data and hwo we're going to show the form
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

export const Route = createFileRoute('/blogs')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    // const userId = session.user.id
    // const blogs = await getArticlesbyId(userId)
    // console.log('Blogs from DB: ', blogs)

    // return { session, blogs }
    const { blogs } = await getBlogs()
    return { session, blogs }
  },
  component: BlogComponent,
})

const StatusBadge = ({ status }: { status: Blog['status'] }) => {
  const statusStyles = {
    toRead: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    reading: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    read: 'bg-green-500/20 text-green-200 border-blue-500/30',
  }
  const statusLabels = {
    toRead: 'To Read',
    reading: 'Reading',
    read: 'Read',
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

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

        navigate({ to: '/blogs' })
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
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
              className="p-6 space-y-6"
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

const BlogCard = async ({ blog }: { blog: Blog }) => {
  // const navigate = useNavigate()
  // const handleEdit = (id: string) => {
  //   const newStatus =
  //     blog.status === 'toRead'
  //       ? 'reading'
  //       : blog.status === 'reading'
  //         ? 'read'
  //         : 'toRead'
  //   try {
  //     updateBlog({
  //       data: {
  //         id,
  //         updates: { status: newStatus },
  //       },
  //     })
  //     console.log('All seems ok')
  //     navigate({ to: '/blogs' })
  //   } catch (error) {
  //     console.warn('error updating article')
  //     throw new Error('Error in client component')
  //   }

  //   console.log('Edit blog: ', id)
  // }
  const session = await getSessionServer()
  const navigate = useNavigate()

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
      <div className="mx-auto text-white bg-slate-500 py-2 px-3 rounded">
        <h1 className="text-2xl">Welcome to the reading room</h1>
        <p>Name: {session?.user.name}</p>
        <p>Email: {session?.user.email}</p>
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
      <div className="bg-white/10 border border-white/20 rounded-lg p-5 backdrop-blur-sm hover:bg-white/15 transition-all duration200">
        <div className="flex justify-between items-start gap-4 mb-3">
          <div className="flex-1 mt-2">
            <h3 className="text-lg font-semibold mb-2 text-white">
              {blog.title}
            </h3>
            {blog.description && (
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                {blog.description}
              </p>
            )}
          </div>
          <StatusBadge status={blog.status} />
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
          {blog.author && <span>By {blog.author} </span>}
          {blog.estimatedReadingTime && (
            <span>{blog.estimatedReadingTime} min read</span>
          )}
          {blog.wordCount && (
            <span>{blog.wordCount.toLocaleString()} words</span>
          )}
        </div>
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
    </>
  )
}

function BlogComponent() {
  // get user session
  const { session, blogs } = Route.useLoaderData()
  console.log('Blogs: ', blogs)

  console.log('User Id')
  const navigate = useNavigate()

  // Add buttons for mutate
  return (
    <div
      className="min-h-screen p-8 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-between">
          <h1 className="text-4xl font-bold mb-2">Blog list</h1>
          <p className="text-gray-200">
            Welcome back, {session.user.name}! You have {blogs.length}{' '}
            {blogs.length === 1 ? 'article' : 'articles'} saved.
          </p>
        </div>
        <button
          className="bg-white mb-2 text-blue-600 hover:bg-gray-100 rounded-lg px-6"
          onClick={() => navigate({ to: '/logarticle' })}
        >
          + Add Article
        </button>
      </div>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: Blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-xl text-gray-300 mb-4">
            No articles yet. Start building your reading list!
          </p>
          <button
            className="bg-white text-blue-600 hover:bg-gray-100 rounded-lg px-6 py-3 font-semibold troansition-colors"
            onClick={() => navigate({ to: '/logarticle' })}
          >
            Add your first article
          </button>
        </div>
      )}
    </div>
  )
}
