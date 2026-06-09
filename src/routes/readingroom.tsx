import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
// import type { Blog, ReadStatus } from '@/lib/types/Blog'
import type { ReadStatus } from '@/lib/types/Blog'
import { auth } from '@/lib/auth'
import { getUserPlants } from '@/lib/server/plants'
import { getUserBlogs } from '@/lib/server/articles'
import { getUserBookServer } from '@/lib/server/books'
import { useWindowStore } from '@/components/ui/windowStore'
import {
  getRecentActivityServer,
  getUserStatsServer,
} from '@/lib/server/activities'
import { getPlantAlert } from '@/lib/plants'
import EditUserPreferences from '@/components/activities/Preferences'

// Authentication
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createFileRoute('/readingroom')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const [blogs, plants, stats, recentActivity, booksResult] =
      await Promise.all([
        getUserBlogs(),
        getUserPlants(),
        getUserStatsServer(),
        getRecentActivityServer({ data: { days: 7 } }),
        getUserBookServer(),
      ])

    return {
      session,
      blogs,
      plants,
      stats: stats ?? { currentStreak: 0, bestStreak: 0, booksGoal: 12 },
      recentActivity: recentActivity ?? [],
      userBooks: booksResult ?? [],
    }
  },
  component: ReadingRoomComponent,
})

// Reading Room with modal
function ReadingRoomComponent() {
  const { session, blogs, userBooks } = Route.useLoaderData()

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
      if (e.key === 'Escape') {
        closeAll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeAll])

  const { booksFinishedThisYear } = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const finished = userBooks.filter(
      ({ userBook }) =>
        userBook.status === 'read' &&
        userBook.finishedAt !== null &&
        new Date(userBook.finishedAt).getFullYear() === currentYear,
    )

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

  const handlePlantClick = () => {
    bushSound()
    toggleWindow('plants')
  }

  const { data: plants = [] } = useQuery({
    queryKey: ['user-plants'],
    queryFn: async () => (await getUserPlants()) ?? [],
  })
  const plantAlert = useMemo(() => getPlantAlert(plants), [plants])

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () =>
      (await getUserStatsServer()) ?? {
        currentStreak: 0,
        bestStreak: 0,
        booksGoal: 12,
      },
    initialData: Route.useLoaderData().stats,
  })

  const { data: recentActivity = [] } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () =>
      (await getRecentActivityServer({
        data: { days: 7 },
      })) ?? [],
    initialData: Route.useLoaderData().recentActivity,
  })

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
          stats={userStats}
          recentActivity={recentActivity}
          booksFinishedThisYear={booksFinishedThisYear}
          yearlyGoal={userStats.booksGoal}
          plantAlert={plantAlert}
          libraryCount={userBooks.length}
          onPlantsClick={handlePlantClick}
          onSettingsClick={() => toggleWindow('preferences')}
        />

        {/** 3D component  */}
        <Experience
          onBookcaseClick={handleBookcaseClick}
          onCreditsClick={() => toggleWindow('credits')}
          onDecksClick={handleDecksClick}
          onFireClick={handleFirePlaceClick}
          onGuitarClick={handleGuitarClick}
          onLampClick={handleLampClick}
          isLampOn={isLampOn}
          onPlantClick={handlePlantClick}
          onOrchidClick={() => toggleWindow('plants')}
          onHeadPhonesClick={() => toggleWindow('audiobooks')}
          handleLaptopClick={() => {
            toggleWindow('laptop')
          }}
        />

        {open.preferences && (
          <EditUserPreferences
            bookGoal={userStats.booksGoal}
            onClose={() => closeWindow('preferences')}
          />
        )}

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
