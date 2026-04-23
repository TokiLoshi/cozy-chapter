import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useEffect, useMemo, useState } from 'react'
import CreditsModal from '../components/Credits'
import Experience from '../components/room/Experience'
import ArticleModal from '../components/articles/ArticleModal'
import AudioBooksModal from '../components/audiobooks/AudioBooks'
import LaptopModal from '../components/laptop/laptopModal'
import PlantModal from '../components/plants/PlantModal'
import ReadingModal from '../components/ReadingModal'
import StatsWidget from '../components/StatsPreview'
import {
  bushSound,
  closeBookSound,
  handleDecksClick,
  handleFirePlaceClick,
  handleGuitarClick,
  lampClickSound,
  pagesTurning,
} from '../components/SoundEffects'
import AudioComponent from '../components/Audio'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
import { getUserPlants } from '@/lib/server/plants'
import { getUserBlogs } from '@/lib/server/articles'
import { useWindowStore } from '@/components/ui/windowStore'
import { getRecentActivity, getUserStats } from '@/db/queries/activities'
import { getUserBooks } from '@/db/queries/books'

// Authentication
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createFileRoute('/readingroom')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    // const blogs = await getUserBlogs()
    // const plants = await getUserPlants()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const [blogs, plants, statsResult, activityResult, booksResult] =
      await Promise.all([
        getUserBlogs(),
        getUserPlants(),
        getUserStats(session.user.id, timeZone),
        getRecentActivity(session.user.id, 7),
        getUserBooks(session.user.id),
      ])

    return {
      session,
      blogs,
      plants,
      stats: statsResult.success
        ? statsResult.data
        : { currentStreak: 0, bestStreak: 0 },
      recentActivity: activityResult.success ? activityResult.data : [],
      userBooks: booksResult.success ? booksResult.data : [],
    }
  },
  component: ReadingRoomComponent,
})

const YEARLY_BOOK_GOAL = 12

// Reading Room with modal
function ReadingRoomComponent() {
  const { session, blogs, stats, recentActivity, userBooks } =
    Route.useLoaderData()
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus | null>(null)
  const [isLampOn, setIsLampOn] = useState(false)

  const {
    open,
    toggleWindow,
    // openWindow,
    closeWindow,
    closeAll,
  } = useWindowStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(`${e.key} pushed`)
      if (e.key === 'Escape') {
        console.log('Escaping')
        closeAll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeAll])

  // const oldStats = useMemo(() => {
  //   return {
  //     toRead: blogs.filter((blog: Blog) => blog.status === 'toRead').length,
  //     reading: blogs.filter((blog: Blog) => blog.status === 'reading').length,
  //     read: blogs.filter((blog: Blog) => blog.status === 'read').length,
  //     total: blogs.length,
  //   }
  // }, [blogs])

  const { booksFinishedThisYear } = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const finished = userBooks
      ? userBooks.filter(
          ({ userBook }) =>
            userBook.status === 'read' &&
            userBook.finishedAt !== null &&
            new Date(userBook.finishedAt).getFullYear() === currentYear,
        )
      : []
    // const active = userBooks ? userBooks.find(({ userBook }) => userBook.status === 'reading') : "nothing right now"
    return {
      booksFinishedThisYear: finished.length,
    }
  }, [userBooks])

  const handleBookcaseClick = (status: ReadStatus) => {
    pagesTurning()
    setSelectedStatus(status)
  }

  const closeModal = () => {
    closeBookSound()
    setSelectedStatus(null)
  }

  const handleLampClick = () => {
    lampClickSound()
    setIsLampOn(!isLampOn)
  }

  return (
    <>
      {/** Audio Overlay top right */}
      <div className="relative w-full h-screen">
        <div className="absolute top-6 right-6 z-10 items-center bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <AudioComponent />
        </div>

        {/** Stats widget */}
        <StatsWidget
          username={session.user.name}
          stats={stats}
          recentActivity={recentActivity}
          booksFinishedThisYear={booksFinishedThisYear}
          yearlyGoal={YEARLY_BOOK_GOAL}
          libraryCount={userBooks ? userBooks.length : 0}
        />

        {/** Stats Overlay - Top Left */}
        {/* <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              welcome back, {session.user.name}!
            </h2>
            <p className="text-sm text-gray-400">
              {stats.total} {stats.total === 1 ? 'article' : 'articles'} in
              total
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">To Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.toRead}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">Reading</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.reading}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.read}
              </span>
            </div>
          </div>
        </div> */}

        {/** 3D component  */}
        <Experience
          onBookcaseClick={handleBookcaseClick}
          onCreditsClick={() => toggleWindow('credits')}
          onDecksClick={handleDecksClick}
          onFireClick={handleFirePlaceClick}
          onGuitarClick={handleGuitarClick}
          onLampClick={handleLampClick}
          isLampOn={isLampOn}
          onPlantClick={bushSound}
          onOrchidClick={() => toggleWindow('plants')}
          onHeadPhonesClick={() => toggleWindow('audiobooks')}
          handleLaptopClick={() => {
            toggleWindow('laptop')
          }}
        />

        {/** Plant Modal */}
        <PlantModal
          isOpen={open.plants}
          onClose={() => closeWindow('plants')}
          refreshPath="/readingroom"
          // plants={plants || []}
        />

        {/** Credits Overlay */}
        <CreditsModal
          isOpen={open.credits}
          onClose={() => closeWindow('credits')}
        />

        {/** Article modal */}
        <ArticleModal
          isOpen={open.article}
          onClose={() => closeWindow('article')}
          refreshPath="/readingroom"
        />

        {/** Audiobooks modal */}
        <AudioBooksModal
          isOpen={open.audiobooks}
          onClose={() => closeWindow('audiobooks')}
        />

        {/** Laptop Overlay */}
        <LaptopModal
          isOpen={open.laptop}
          username={session.user.name}
          onClose={() => closeWindow('laptop')}
        />

        {/** Blogs Overlay */}
        {selectedStatus && (
          <ReadingModal
            isOpen={!!selectedStatus}
            onClose={closeModal}
            selectedStatus={selectedStatus}
            blogs={blogs}
            onAddArticleClick={() => {
              closeModal()
            }}
          />
        )}
      </div>
    </>
  )
}
