import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { useMemo, useState } from 'react'
import CreditsModal from '../components/Credits'
import Experience from '../components/room/Experience'
import ArticleModal from '../components/articles/ArticleModal'
import AudioBooksModal from '../components/audiobooks/AudioBooks'
import LaptopModal from '../components/laptop/laptopModal'
import PlantModal from '../components/plants/PlantModal'
import ReadingModal from '../components/ReadingModal'
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

// Authentication
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createFileRoute('/readingroom')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const blogs = await getUserBlogs()
    const plants = await getUserPlants()
    return { session, blogs, plants }
  },
  component: ReadingRoomComponent,
})

// Reading Room with modal
function ReadingRoomComponent() {
  const { session, blogs, plants } = Route.useLoaderData()
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus | null>(null)

  const stats = useMemo(() => {
    return {
      toRead: blogs.filter((blog: Blog) => blog.status === 'toRead').length,
      reading: blogs.filter((blog: Blog) => blog.status === 'reading').length,
      read: blogs.filter((blog: Blog) => blog.status === 'read').length,
      total: blogs.length,
    }
  }, [blogs])

  const handleBookcaseClick = (status: ReadStatus) => {
    pagesTurning()
    setSelectedStatus(status)
  }

  const closeModal = () => {
    closeBookSound()
    setSelectedStatus(null)
  }

  const [isCreditsOpen, setIsCreditsOpen] = useState(false)

  const handleCreditsClick = () => {
    setIsCreditsOpen(!isCreditsOpen)
  }

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false)

  const [isLampOn, setIsLampOn] = useState(false)

  const handleLampClick = () => {
    lampClickSound()
    setIsLampOn(!isLampOn)
  }

  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false)

  const handleOrchidClick = () => {
    setIsPlantModalOpen(!isPlantModalOpen)
  }

  const handleHeadPhonesClick = () => {
    setIsAudioBookModalOpen(!isAudiobookModalOpen)
  }

  const [isLaptopOpen, setIsLaptopOpen] = useState(false)
  const handleLaptopClick = () => {
    setIsLaptopOpen(!isLaptopOpen)
  }

  const [isAudiobookModalOpen, setIsAudioBookModalOpen] = useState(false)

  return (
    <>
      {/** Audio Overlay top right */}
      <div className="relative w-full h-screen">
        <div className="absolute top-6 right-6 z-10 items-center bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <AudioComponent />
        </div>

        {/** Stats Overlay - Top Left */}
        <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
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
        </div>

        {/** 3D component  */}
        <Experience
          onBookcaseClick={handleBookcaseClick}
          onCreditsClick={handleCreditsClick}
          onDecksClick={handleDecksClick}
          onFireClick={handleFirePlaceClick}
          onGuitarClick={handleGuitarClick}
          onLampClick={handleLampClick}
          isLampOn={isLampOn}
          onPlantClick={bushSound}
          onOrchidClick={handleOrchidClick}
          onHeadPhonesClick={handleHeadPhonesClick}
          handleLaptopClick={handleLaptopClick}
        />

        {/** Plant Modal */}
        {isPlantModalOpen && (
          <PlantModal
            isOpen={isPlantModalOpen}
            onClose={() => setIsPlantModalOpen(false)}
            refreshPath="/readingroom"
            // plants={plants || []}
          />
        )}

        {/** Credits Overlay */}
        {isCreditsOpen && (
          <CreditsModal
            isOpen={isCreditsOpen}
            onClose={() => setIsCreditsOpen(false)}
          />
        )}

        {/** Article modal */}
        <ArticleModal
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          refreshPath="/readingroom"
        />

        {/** Audiobooks modal */}
        <AudioBooksModal
          isOpen={isAudiobookModalOpen}
          onClose={() => setIsAudioBookModalOpen(false)}
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
              setIsArticleModalOpen(true)
            }}
          />
        )}
      </div>
      {/** Laptop Overlay */}
      <LaptopModal
        isOpen={isLaptopOpen}
        username={session.user.name}
        onClose={() => {
          // setIsLaptopOpen(false)
        }}
      />
    </>
  )
}
