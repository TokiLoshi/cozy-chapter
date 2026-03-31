import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { activityLog, userStats } from '../schemas/activity-schema'
import type { ActivityLogInsert } from '../schemas/activity-schema'
import { db } from '@/db'

type userActivity = {
  userId: string
  contentType: ActivityLogInsert['contentType']
  contentId: string
  activityType: ActivityLogInsert['activityType']
  value?: number | null
  durationMinutes?: number | null
  notes?: string | null
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

function getYesterday(): string {
  const day = new Date()
  day.setDate(day.getDate() - 1)
  return getDateString(day)
}

export async function createActivityLog(data: ActivityLogInsert) {
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
  const today = getDateString(new Date())
  const yesterday = getYesterday()
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
      return { success: true }
    }
    const stats = existing[0]
    if (stats.lastActivityDate === today) {
      return { success: true }
    }

    const newStreak =
      stats.lastActivityDate === yesterday ? stats.currentStreak + 1 : 1
    const newBest = Math.max(stats.bestStreak, newStreak)
    const updatedData = await db
      .update(userStats)
      .set({
        currentStreak: newStreak,
        bestStreak: newBest,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))
      .returning()
    return { success: true, data: updatedData }
  } catch (error) {
    console.error(`Error updating streak ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function getUserStats(userId: string) {
  try {
    const result = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
    if (!result[0]) {
      return {
        sucess: true,
        data: {
          currentStreak: 0,
          bestStreak: 0,
        },
      }
    }
  } catch (error) {
    console.error(`Error getting user stats: ${(error as Error).message}`)
    return { success: false, error }
  }
}
