import { and, eq } from 'drizzle-orm'
// eslint-disable-next-line
import { UserBlogs, userBlogs } from '../article-schema'
import type { ReadStatus } from '@/lib/types/Blog'
import { db } from '@/db'

export async function createArticle(blog: UserBlogs) {
  const [result] = await db.insert(userBlogs).values(blog).returning()
  return result
}

export async function getArticlesbyId(id: string) {
  const result = await db
    .select()
    .from(userBlogs)
    .where(eq(userBlogs.userId, id))
  return result
}

export async function getArticleByStatus(id: string, readStatus: ReadStatus) {
  const result = await db
    .select()
    .from(userBlogs)
    .where(and(eq(userBlogs.userId, id), eq(userBlogs.status, readStatus)))
  return result
}

export async function getSingleBlog(blogId: string) {
  const [result] = await db
    .select()
    .from(userBlogs)
    .where(eq(userBlogs.id, blogId))
  return result
}

// Edit or Update
export async function updateArticle(
  id: string,
  updates: Partial<{
    title?: string
    url?: string | null
    author?: string | null
    description?: string | null
    estimatedReadingTime?: number | null
    wordCount?: number | null
    status?: 'toRead' | 'reading' | 'read'
    notes?: string | null
  }>,
) {
  try {
    const result = await db
      .update(userBlogs)
      .set(updates)
      .where(eq(userBlogs.id, id))
      .returning()
    console.log('Updated article: ', result)
    return { success: true, blog: result[0] }
  } catch (error) {
    console.warn('Error editing article with id: ', id, error)
  }
}

export async function deleteArticle(id: string) {
  console.log('In delete with: ', id)
  const article = await db.select().from(userBlogs).where(eq(userBlogs.id, id))
  console.log('Sanity check: does article exist: ', article)
  const result = await db.delete(userBlogs).where(eq(userBlogs.id, id))
  console.log('Result after passing to id: and what will be returned', result)
  return result
}
