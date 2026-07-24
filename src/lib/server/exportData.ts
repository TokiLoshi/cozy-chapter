import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../auth'
import { getAllActivity } from '@/db/queries/activities'
import { getArticlesbyId } from '@/db/queries/articles'
import { getUserAudiobooks } from '@/db/queries/audibooks'
import { getUserBooks } from '@/db/queries/books'
import { getCourses } from '@/db/queries/courses'
import { getMembershipByUser } from '@/db/queries/household'
import { getUserMovies } from '@/db/queries/movies'
import { getUsersPlants } from '@/db/queries/plants'
import { getUserPodcast } from '@/db/queries/podcasts'
import { getUserSeries } from '@/db/queries/series'
import { getUser } from '@/db/queries/user'

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

export const leaveCozyChapter = createServerFn({ method: 'POST' }).handler(
  async () => {},
)
