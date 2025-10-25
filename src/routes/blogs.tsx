import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { getArticlesbyId } from '@/db/queries/articles'
import { getSessionServer } from '@/lib/utils'

export const Route = createFileRoute('/blogs')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const blogs = await getArticlesbyId(userId)
    console.log('Blogs from DB: ', blogs)

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

function BlogComponent() {
  // get user session
  const { session, blogs } = Route.useLoaderData()
  console.log('Blogs: ', blogs)

  console.log('User Id')
  const navigate = useNavigate()

  // Add buttons for mutate
  return (
    <div
      className="flex items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <h2>Blogs You've listed, {session.user.name}</h2>
      <ul className="space-y-3">
        {blogs.map((blog: Blog) => (
          <li key={blog.id}>
            {blog.title}: {blog.status}{' '}
            {blog.url && (
              <a href={blog.url}>{blog.url ? blog.url : 'no link'}</a>
            )}
          </li>
        ))}
      </ul>
      <button
        className="bg-slate-500 rounded-xl p-2 m-3"
        onClick={() => navigate({ to: '/logarticle' })}
      >
        log another article
      </button>
    </div>
  )
}
