import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { activityLog, userStats } from '../schemas/activity-schema'
import type { ActivityLog } from '../schemas/activity-schema'
import { db } from '@/db'

export async function createActivityLog(
  data: Pick<
    ActivityLog,
    | 'userId'
    | 'contentType'
    | 'activityType'
    | 'value'
    | 'durationMinutes'
    | 'notes'
  >,
) {
  try {
    const result = await db.insert(activityLog).values(data).returning()
    await updateStreak(data.userId)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error creating activity ${error as Error}`)
    return { success: false, error }
  }
}

export async function updateStreak(userId: string) {
  const today = new Date()
  const yesterday = new Date(Date.now()).toISOString().split('T')[0]
  try {
    const existing = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1)
    if (!existing[0]) {
      await db.insert(userStats).values({
        userId,
        currentStreak: 1,
        bestStreak: 1,
        lastActivityDate: today,
      })
      return
    }
  } catch (error) {
    console.error(`Error updating streak ${(error as Error).message}`)
  }
}
