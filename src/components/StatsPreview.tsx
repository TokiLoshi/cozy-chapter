import { useMemo } from 'react'
import {
  MOCK_BOOKS,
  MOCK_SESSIONS,
  YEARLY_BOOK_GOAL,
} from '../features/reading/mockdata'
import type {
  BookItem,
  ReadingSession,
  StreakData,
  WeekDay,
} from '@/lib/types/Books'

function FlameIcon({ size = 14, lit = false }) {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24"
        fill={lit ? 'url(#flameGrad)' : 'none'}
        stroke={lit ? 'none' : 'rgba(148, 163, 184, 0.3)'}
        strokeWidth="1.5"
      >
        <defs>
          <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M12 2c.5 3.5-1.5 5.5-1.5 8a4 4 0 0 0 7.5 2c.5-1 .5-2 0-3C20 12 22 15 22 17a10 10 0 1 1-20 0c0-4.5 4-8 5.5-10.5C9 4.5 11.5 2 12 2z" />
      </svg>
    </>
  )
}

function MinniWeekBar({
  minutes,
  maxMin,
  isToday,
}: {
  minutes: number
  maxMin: number
  isToday: boolean
}) {
  const pct =
    minutes > 0 ? Math.max((minutes / Math.max(maxMin, 1)) * 100, 10) : 0
  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`w-2 h-7 rounded-sm overflow-hidden flex items-end bg-slate-800/60 ${isToday ? 'ring-1 ring-amber-500/40' : ''}`}
        >
          <div
            className="w-full rounded-sm bg-gradient-to-t from-amber-700 to-amber-500 transition-all duration-500"
            style={{
              height: `${pct}`,
            }}
          ></div>
        </div>
      </div>
    </>
  )
}

type Props = {
  username: string
  books?: Array<BookItem>
  sessions?: Array<ReadingSession>
}

export default function StatsWidget({
  username = 'Toki',
  books = MOCK_BOOKS,
  sessions = MOCK_SESSIONS,
}: Props) {
  return (
    <div className="absolute top-6 lefft-6 z-10 min-w[230px] rounded-xl border border-white/15 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">
          Welcome back, {username}!
        </h2>
        <p className="text-md text-slate-400">
          {books.length} {books.length === 1 ? 'book' : 'books'} in your library
        </p>
      </div>
      {/** Streak and Yearly Goal */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${streak.current > 0 ? 'border-amber-500/30' : 'border-slate-600/30 bg-slate-700/30'}`}
        ></div>
      </div>
    </div>
  )
}
