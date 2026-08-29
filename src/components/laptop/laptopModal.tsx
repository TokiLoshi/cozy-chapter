import { useEffect, useState } from 'react'
import CoursesModal from '../courses/CoursesModal'
import { useWindowStore } from '../ui/windowStore'
import AudioBooksModal from '../audiobooks/AudioBooks'
import PlantModal from '../plants/PlantModal'
import ReadingModal from '../ReadingModal'
import TerminalBody from './terminalBody'
import type { ReadStatus } from '@/lib/types/Blog'
import PodcastModal from '@/features/podcasts/components/PodcastModal'
import MovieModal from '@/features/movies/components/MovieModal'
import SeriesModal from '@/features/series/components/SeriesModal'

type LaptopModalProps = {
  isOpen: boolean
  username: string
  onClose: () => void
}

type TerminalTitleBarProps = {
  title: string
  onClose: () => void
  onToggleGUI: () => void
}

export function TerminalTitleBar({
  title,
  onClose,
  onToggleGUI,
}: TerminalTitleBarProps) {
  return (
    <>
      <div className="flex flex-shrink-0 h-11 items-center bg-zinc-800 rounded-t-xl px-3 select-none border-zinc-700">
        {/** Traffic lights */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <span className="text-[8px] text-red-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              x
            </span>
          </button>
          <button
            className="w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
            aria-label="Minimize"
          >
            <span className="text-[8px] text-yellow-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              -
            </span>
          </button>
          <button
            onClick={onToggleGUI}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center cursor-pointer"
            aria-label="Toggle GUI mode"
          >
            <span className="text-[8px] text-green-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              ↗
            </span>
          </button>
        </div>
        {/** Centered Title */}
        <div className="flex-1 min-2-0 text-center ">
          <span className="block truncate text-zinc-400 text-sm font-mono ms-2">
            📁 {title}{' '}
          </span>
        </div>
        {/** Spacer to balance traffic lights */}
        <div className="w-14" />
      </div>
    </>
  )
}

export default function LaptopModal({
  isOpen,
  onClose,
  username,
}: LaptopModalProps) {
  // const [folder, setFolder] = useState(`~/${username}/`)
  const [isGUI, setIsGUI] = useState(false)
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus>('reading')

  useEffect(() => {
    if (!isOpen) {
      setActiveApp(null)
    }
  }, [isOpen])
  const { selfDestruct, openWindow } = useWindowStore()

  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={selfDestruct ? undefined : onClose}
        />
        <div className="relative w-full max-w-4xl max-h-[85dvh] overflow-hidden bg-slate-950 rounded-xl shadow-[0_0_60px_-15px_rgba(74,222,128,0.25)] border border-zinc-700 flex flex-col">
          {/** Title Bar */}

          <TerminalTitleBar
            title={`${username}@iCozy -- ~ -- -zsh`}
            onClose={onClose}
            onToggleGUI={() => setIsGUI(!isGUI)}
          />

          {/** Terminal body */}
          <div className="flex-1 overflow-y-auto p-4 min-h-[400px] shadow-[inset_0_2px_rgba(0,0,0,0.9)]">
            {isGUI ? (
              <div className="text-white font-mono text-sm">
                {/** GUI mode placeholder */}
                <p className="text-zinc-500">GUI mode coming soon</p>
              </div>
            ) : (
              <>
                <TerminalBody
                  username={username}
                  onLaunchApp={(app) => {
                    setActiveApp(app?.name ?? null)
                    if (app?.status) setSelectedStatus(app.status)
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <PodcastModal
        isOpen={activeApp === 'podcasts'}
        onClose={() => setActiveApp(null)}
      />
      <CoursesModal
        isOpen={activeApp === 'courses'}
        onClose={() => setActiveApp(null)}
      />
      <MovieModal
        isOpen={activeApp === 'movies'}
        onClose={() => setActiveApp(null)}
      />
      <SeriesModal
        isOpen={activeApp === 'series'}
        onClose={() => setActiveApp(null)}
      />
      <AudioBooksModal
        isOpen={activeApp === 'audiobooks'}
        onClose={() => setActiveApp(null)}
      />
      <PlantModal
        isOpen={activeApp === 'plants'}
        onClose={() => setActiveApp(null)}
      />
      <ReadingModal
        isOpen={
          activeApp === 'reading' ||
          activeApp === 'articles' ||
          activeApp === 'books'
        }
        onClose={() => setActiveApp(null)}
        selectedStatus={selectedStatus}
        onAddArticleClick={() => openWindow('article')}
        defaultTab={activeApp === 'books' ? 'books' : 'articles'}
      />
    </>
  )
}
