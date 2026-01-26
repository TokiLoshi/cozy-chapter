import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import type { Blog } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
import {
  createArticle,
  deleteArticle,
  getArticlesbyId,
  getSingleBlog,
  updateArticle,
} from '@/db/queries/articles'
import { userBlogs } from '@/db/schemas/article-schema'

const insertArticlesSchema = createInsertSchema(userBlogs, {
  title: z.string().min(1, 'title is required'),
  url: z.string().optional().or(z.literal('')),
  author: z.string().optional(),
  description: z.string().optional(),
  estimatedReadingTime: z.number().min(0).optional(),
  wordCount: z.number().optional(),
  status: z.enum(['toRead', 'reading', 'read']).default('toRead'),
  notes: z.string().optional(),
})

export const submitArticle = createServerFn({ method: 'POST' })
  .inputValidator(insertArticlesSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequest().headers })
    if (!session) throw new Error('Unauthorized')

    const articleData = {
      ...data,
      userId: session.user.id,
    }
    const article = await createArticle(articleData)
    return article
  })

export const getSessionServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequest().headers })
    return session
  },
)

export const getUserBlogs = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const blogs = await getArticlesbyId(userId)
    return blogs
  },
)

export const getBlogToEdit = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      const blogId = data.id
      const singleBlog = getSingleBlog(blogId)
      return singleBlog
    } catch (error) {
      console.error('Something went wrong getting blog: ', data.id)
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
      await deleteArticle(blogId)
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

export const updateBlog = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Blog> }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      await updateArticle(data.id, data.updates)
      return { success: true, id: data.id }
    } catch (error) {
      console.error('Error updating blog: ', data.id, data.updates)
    }
    throw new Error('Something bad happend')
  })
