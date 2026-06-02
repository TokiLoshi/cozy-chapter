import { and, desc, eq, gte } from 'drizzle-orm'
import { activityLog, userStats } from '../schemas/activity-schema'
import type { ActivityLogInsert } from '../schemas/activity-schema'
import { db } from '@/db'

function getDateStringInTz(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const year = parts.find((p) => p.type === 'year')!.value
  const month = parts.find((p) => p.type === 'month')!.value
  const day = parts.find((p) => p.type === 'day')!.value
  return `${year}-${month}-${day}`
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
    const streakUpdate = await updateStreak(data.userId, timeZone)
    console.log('Streak update: ', streakUpdate)
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
    console.log('user stats result in server: ', result)
    if (!result[0]) {
      return {
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: 0,
          booksGoal: 12,
        },
      }
    }
    const stats = result[0]
    console.log('Our stats after the query: ', stats)
    const { today, yesterday } = getYesterdayAndToday(timeZone)
    console.log(`Today in server: ${today} and ${yesterday}`)
    console.log(`Last activity dates: ${stats.lastActivityDate}`)
    // Handle broken string
    if (
      stats.lastActivityDate !== today &&
      stats.lastActivityDate !== yesterday
    ) {
      console.log(
        `Bool for last activity date not being today ${stats.lastActivityDate !== today} and ${stats.lastActivityDate !== yesterday}`,
      )
      console.log('BOOM BAM Resetting streak on the server')
      stats.currentStreak = 0
      return {
        success: true,
        data: {
          currentStreak: 0,
          bestStreak: stats.bestStreak,
          booksGoal: stats.booksGoal,
        },
      }
    }
    return { success: true, data: stats }
  } catch (error) {
    console.error(`Error getting user stats: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function getRecentActivity(userId: string, days = 7) {
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    since.setHours(0, 0, 0, 0)
    const result = await db
      .select()
      .from(activityLog)
      .where(
        and(eq(activityLog.userId, userId), gte(activityLog.createdAt, since)),
      )
      .orderBy(desc(activityLog.createdAt))
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error getting recent activity: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function updateBookGoal(userId: string, goal: number) {
  try {
    const result = await db
      .update(userStats)
      .set({
        booksGoal: goal,
        updatedAt: new Date(),
      })
      .where(eq(userStats.userId, userId))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(
      `Error getting updating user stats ${(error as Error).message}`,
    )
    return { success: false, error }
  }
}
