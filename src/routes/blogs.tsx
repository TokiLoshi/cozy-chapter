import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../lib/auth'
import { deleteArticle, getArticlesbyId } from '@/db/queries/articles'
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

export const deleteBlogs = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const blogId = data
    try {
      const deletedBlog = await deleteArticle(blogId)
      console.log('Deleted: ', deletedBlog)
      return { success: true, id: blogId }
    } catch (error) {
      console.error(
        'Oops, something went wrong deleting the article: ',
        error,
        blogId,
      )
      throw error
    }
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

// Typing
type Blog = {
  id: string
  userId: string
  title: string
  url: string | null
  author: string | null
  description: string | null
  estimatedReadingTime: number | null
  wordCount: number | null
  status: 'toRead' | 'reading' | 'read'
  notes: string | null
}

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

const BlogCard = ({ blog }: { blog: Blog }) => {
  const handleEdit = (id: string) => {
    console.log('Edit blog: ', id)
  }
  const handleDelete = (id: string) => {
    console.log('Delete blog: ', id)
    deleteBlogs(id)
  }
  return (
    <>
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
          <button
            onClick={() => handleEdit(blog.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </button>
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
        <button className="bg-white mb-2 text-blue-600 hover:bg-gray-100 rounded-lg px-6">
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
