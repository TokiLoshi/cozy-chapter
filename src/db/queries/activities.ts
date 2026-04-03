import { eq } from 'drizzle-orm'
import { activityLog, userStats } from '../schemas/activity-schema'
import type { ActivityLogInsert } from '../schemas/activity-schema'
import { db } from '@/db'

function getDateStringInTz(date: Date, timeZone: string): string {
  return date.toLocaleDateString('en-US', { timeZone })
}

function getYesterdayAndToday(timezone: string) {
  const now = new Date()

  const today = getDateStringInTz(now, timezone)
  const yesterday = getDateStringInTz(
    new Date(now.getTime() - 86_400_000),
    timezone,
  )

  return { today, yesterday }
}

export async function createActivityLog(
  data: ActivityLogInsert,
  timeZone: string,
) {
  try {
    const result = await db.insert(activityLog).values(data).returning()
    await updateStreak(data.userId, timeZone)
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error creating activity ${error as Error}`)
    return { success: false, error }
  }
}

export async function updateStreak(userId: string, timeZone: string) {
  const { today, yesterday } = getYesterdayAndToday(timeZone)

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
        lastActivityDate: today,
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

export async function getUserStats(userId: string, timeZone: string) {
  try {
    const result = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
    if (!result[0]) {
      return {
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: 0,
        },
      }
    }
    const stats = result[0]
    const { today, yesterday } = getYesterdayAndToday(timeZone)

    // Handle broken string
    if (
      stats.lastActivityDate !== today &&
      stats.lastActivityDate !== yesterday
    ) {
      stats.currentStreak = 0
      return {
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: stats.bestStreak,
        },
      }
    }
    return { success: true, data: stats }
  } catch (error) {
    console.error(`Error getting user stats: ${(error as Error).message}`)
    return { success: false, error }
  }
}
