import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../auth'
import sendEmail from '../email'
import {
  deleteActivityLog,
  deleteUserStreak,
  getAllActivity,
} from '@/db/queries/activities'
import { deleteAllUserArticles, getArticlesbyId } from '@/db/queries/articles'
import {
  deleteAllUserAudiobooks,
  getUserAudiobooks,
} from '@/db/queries/audibooks'
import { deleteAllUserBooks, getUserBooks } from '@/db/queries/books'
import { deleteAllUserCourses, getCourses } from '@/db/queries/courses'
import {
  getHousehold,
  getMembershipByUser,
  leaveHouseholdById,
} from '@/db/queries/household'
import { deleteAllUserMovies, getUserMovies } from '@/db/queries/movies'
import { deleteAllUserPlants, getUsersPlants } from '@/db/queries/plants'
import { deleteAllUserPodcasts, getUserPodcast } from '@/db/queries/podcasts'
import { deleteAllUserSeries, getUserSeries } from '@/db/queries/series'
import { deleteUser, getUser } from '@/db/queries/user'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const exportData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    // get activities
    const userStatsData = await getAllActivity(userId)
    if (!userStatsData.success) {
      throw new Error(`Error getting user activity: ${userStatsData.error}`)
    }
    const userStats = userStatsData.data

    // get articles
    const articlesData = await getArticlesbyId(userId)
    if (!articlesData.success) {
      throw new Error(`Error getting blogs/ articles: ${articlesData.error}`)
    }
    const blogs = articlesData.data

    // get audiobooks
    const audioBooksData = await getUserAudiobooks(userId)
    if (!audioBooksData.success) {
      throw new Error(`Error getting audiobooks: ${audioBooksData.error}`)
    }
    const audioBooks = audioBooksData.data

    // get books
    const booksData = await getUserBooks(userId)
    if (!booksData.success) {
      throw new Error(`Error getting books: ${booksData.error}`)
    }
    const books = booksData.data

    // get courses,
    const coursesData = await getCourses(userId)
    if (!coursesData.success) {
      throw new Error(`Error getting courses: ${coursesData.error}`)
    }
    const courses = coursesData.data

    // get household info
    const householdData = await getMembershipByUser(userId)
    if (!householdData.success) {
      throw new Error(`Error getting householdData: ${householdData.error}`)
    }
    const household = householdData.data

    // get get movies
    const moviesData = await getUserMovies(userId)
    if (!moviesData.success) {
      throw new Error(`Error getting movies: ${moviesData.error}`)
    }
    const movies = moviesData.data

    // get plants
    const plantsData = await getUsersPlants(userId, household?.householdId)
    if (!plantsData.success) {
      throw new Error(`Error getting plantsData: ${plantsData.error}`)
    }
    const plants = plantsData.data

    // get podcasts
    const podcastsData = await getUserPodcast(userId)
    if (!podcastsData.success) {
      throw new Error(`Error getting podcasts: ${podcastsData.error}`)
    }
    const podcasts = podcastsData.data

    // get series
    const seriesData = await getUserSeries(userId)
    if (!seriesData.success) {
      throw new Error(`Error getting series: ${seriesData.error}`)
    }
    const series = seriesData.data

    // get user info do we need this?
    const userInfoData = await getUser(userId)
    if (!userInfoData.success) {
      throw new Error(`Error getting user data: ${userInfoData.error}`)
    }
    const userInfo = userInfoData.data
    const now = new Date()
    const userExport = {
      activities: userStats,
      articles: blogs,
      audioBooks: audioBooks,
      books: books,
      courses: courses,
      household: household,
      movies: movies,
      plants: plants,
      podcasts: podcasts,
      series: series,
      userInfo: userInfo,
      generated: now,
    }
    return userExport
  },
)

export const deleteAccountServer = createServerFn({ method: 'POST' }).handler(
  async () => {
    // check for session
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id

    // leave household
    const household = await getHousehold(userId)
    const householdId = household.householdData?.id

    if (householdId) {
      const leaveHouseholdResult = await leaveHouseholdById(householdId, userId)
      if (!leaveHouseholdResult.success) {
        throw new Error('Error leaving household')
      }
    }
    // delete activities
    const activityLogResult = await deleteActivityLog(userId)
    if (!activityLogResult.success) {
      throw new Error('Error deleting activityLog')
    }
    const activityStreakResult = await deleteUserStreak(userId)
    if (!activityStreakResult.success) {
      throw new Error('Error deleting activityStreak')
    }

    // delete articles
    const articleResult = await deleteAllUserArticles(userId)
    if (!articleResult.success) {
      throw new Error('Error deleting articles')
    }

    // delte audiobooks
    const audiobookResult = await deleteAllUserAudiobooks(userId)
    if (!audiobookResult.success) {
      throw new Error('Error deleting audiobooks')
    }

    // delete books,
    const bookResult = await deleteAllUserBooks(userId)
    if (!bookResult.success) {
      throw new Error('Error deleting books')
    }

    // delete coures
    const courseResult = await deleteAllUserCourses(userId)
    if (!courseResult.success) {
      throw new Error('Error deleting courses')
    }

    // delete movies
    const moviesResult = await deleteAllUserMovies(userId)
    if (!moviesResult.success) {
      throw new Error('Error deleting movies')
    }

    // delete plants
    const plantResult = await deleteAllUserPlants(userId)
    if (!plantResult.success) {
      throw new Error('Error deleting plants')
    }

    // delete podcasts
    const podcastResult = await deleteAllUserPodcasts(userId)
    if (!podcastResult.success) {
      throw new Error('Error deleting podcasts')
    }

    // series
    const seriesResult = await deleteAllUserSeries(userId)
    if (!seriesResult.success) {
      throw new Error('Error deleting series')
    }

    // delete user
    const userResult = await deleteUser(userId)
    if (!userResult.success) {
      throw new Error('Error deleting user')
    }

    // send resend email to let them know they've been deleted

    await sendDeletionEmail(session.user.email, session.user.name)

    // return success true.
    return { success: true }
  },
)

const sendDeletionEmail = async (email: string, name: string) => {
  try {
    await sendEmail({
      to: email,
      subject: `Cozy Chapter - Your cozy room has been successfully deleted`,
      html: `
      <p>Goodbye ${name}</p>
      <p>You have successfully destroyed your cozy room and all the data associated with it has been permanently deleted.</p>
      <p>Thank you for trying it out! 📚</p>
    `,
    })
    return { success: true }
  } catch (error) {
    console.error(`Error sending delete email`)
  }
}
