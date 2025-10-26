import { eq } from 'drizzle-orm'
// eslint-disable-next-line
import { UserBlogs, userBlogs } from '../article-schema'
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

// Edit or Update
// export async function updateArticle(
//   id: string,
//   title?: string,
//   url?: string,
//   author?: string,
//   publishedDate?: string,
//   description?: string,
//   estimatedReadingTime?: number,
//   wordCount?: number,
//   tags?: string[],
//   status: string,
//   notes?: string,
//   highlights?: string,
// ) {
//   try {
//     await db
//       .update(userBlogs)
//       .set({
//         title,
//         url,
//         author,
//         publishedDate,
//         description,
//         estimatedReadingTime,
//         wordCount,
//         tags,
//         status,
//         notes,
//         highlights,
//         updatedAt: new Date(),
//       })
//     return { success: true }
//   } catch (error) {
//     console.warn('Error editing article with id: ', id, error)
//   }
// }

export async function deleteArticle(id: string) {
  console.log('In delete with: ', id)
  const article = await db.select().from(userBlogs).where(eq(userBlogs.id, id))
  console.log('Sanity check: does article exist: ', article)
  const result = await db.delete(userBlogs).where(eq(userBlogs.id, id))
  console.log('Result after passing to id: and what will be returned', result)
  return result
}
