import { user } from 'auth-schema'
import { eq } from 'drizzle-orm'
import { db } from '@/db'

export async function getUser(userId: string) {
  try {
    const [userInfo] = await db.select().from(user).where(eq(user.id, userId))
    const returnedUser = {
      name: userInfo.name,
      email: userInfo.email,
      joined: userInfo.createdAt,
    }
    return { success: true, data: returnedUser }
  } catch (error) {
    console.error(`Error getting user information`)
    return { success: false, error }
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(user).where(eq(user.id, userId))
    return { success: true }
  } catch (error) {
    console.error(`Error deleting user: ${userId}`)
    return { success: false, error }
  }
}
