import { useMemo } from 'react'
import { Leaf } from 'lucide-react'
import type {
  ActivityLogSelect,
  UserStatsSelect,
} from '@/db/schemas/activity-schema'

function FlameIcon({
  size = 14,
  lit = false,
}: {
  size?: number
  lit: boolean
}) {
  return (
    <>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
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

function MiniWeekBar({
  pages,
  maxMin,
  isToday,
}: {
  pages: number
  maxMin: number
  isToday: boolean
}) {
  const pct = pages > 0 ? Math.max((pages / Math.max(maxMin, 1)) * 100, 10) : 0
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        <div
          className={`w-2 h-7 rounded-sm overflow-hidden flex items-end bg-slate-800/60 ${isToday ? 'ring-1 ring-amber-500/40' : ''}`}
        >
          <div
            className="w-full rounded-sm bg-gradient-to-t from-amber-700 to-amber-500 transition-all duration-500"
            style={{
              height: `${pct}%`,
            }}
          ></div>
        </div>
      </div>
    </>
  )
}

type DayKey = 'Mon' | 'Tues' | 'Wed' | 'Thurs' | 'Fri' | 'Sat' | 'Sun'

type WeekDayData = {
  key: DayKey
  pages: number
}

type Props = {
  username: string
  stats:
    | Pick<UserStatsSelect, 'currentStreak' | 'bestStreak'>
    | { currentStreak: number; bestStreak: number }
  recentActivity: Array<ActivityLogSelect>
  currentlyReadingTitle?: string
  booksFinishedThisYear: number
  yearlyGoal: number
  libraryCount: number
  plantAlert: 'allGood' | 'needsWater' | 'needsAttention'
  onPlantsClick: () => void
}

const DAY_KEYS: Array<DayKey> = [
  'Mon',
  'Tues',
  'Wed',
  'Thurs',
  'Fri',
  'Sat',
  'Sun',
]

function buildWeekData(sessions: Array<ActivityLogSelect>): Array<WeekDayData> {
  const now = new Date()
  const startOfWeek = new Date(now)
  const dayOfWeek = now.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  startOfWeek.setDate(now.getDate() - daysSinceMonday)
  startOfWeek.setHours(0, 0, 0, 0)
  // const minutesByDay: Record<number, number> = {
  //   0: 0,
  //   1: 0,
  //   2: 0,
  //   3: 0,
  //   4: 0,
  //   5: 0,
  //   6: 0,
  // }
  const pagesByDay: Record<number, number> = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  }

  for (const session of sessions) {
    const sessionDate = new Date(session.createdAt)
    if (sessionDate >= startOfWeek) {
      const rawDay = sessionDate.getDay()

      const mondayFirstIndex = rawDay === 0 ? 6 : rawDay - 1
      // minutesByDay[mondayFirstIndex] += session.durationMinutes ?? 0
      pagesByDay[mondayFirstIndex] += session.value ?? 0
    }
  }
  return DAY_KEYS.map((key, index) => ({ key, pages: pagesByDay[index] }))
}

export default function StatsWidget({
  username,
  stats,
  recentActivity,
  currentlyReadingTitle,
  booksFinishedThisYear,
  yearlyGoal,
  libraryCount,
  plantAlert,
  onPlantsClick,
}: Props) {
  const todayKey = useMemo(() => {
    const rawDay = new Date().getDay()
    const mondayFirstIndex = rawDay === 0 ? 6 : rawDay - 1
    return DAY_KEYS[mondayFirstIndex]
  }, [])

  const weekData = useMemo(() => {
    return buildWeekData(recentActivity)
  }, [recentActivity])

  const maxWeekMin = useMemo(() => {
    return Math.max(...weekData.map((day) => day.pages), 1)
  }, [weekData])

  const { currentStreak } = stats
  console.log('STats in widget: ', stats)
  const isStreakActive = currentStreak > 0
  const goalPct = Math.min(
    (booksFinishedThisYear / Math.max(yearlyGoal, 1)) * 100,
    100,
  )

  return (
    <>
      <div className="absolute top-6 left-6 z-10 min-w-[230px] rounded-xl border border-white/15 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-md">
        {/** Header */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">
            Welcome back, {username}!
          </h2>
          <p className="text-sm text-slate-400">
            {libraryCount} {libraryCount === 1 ? 'book' : 'books'} in your
            library
          </p>
        </div>
        {/** Streak + Goal row */}
        <div className="mb-4 flex items-center gap-3">
          {plantAlert !== 'allGood' && (
            <button
              onClick={onPlantsClick}
              title={
                plantAlert === 'needsAttention'
                  ? 'A plant needs attention'
                  : 'a plant needs water'
              }
              className={`flex items-center gap-1.5 cursor-pointer rounded-full border px-2.5 py-1 transition-colors ${
                plantAlert === 'needsAttention'
                  ? 'border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
            >
              {' '}
              <Leaf
                size={13}
                className={
                  plantAlert === 'needsAttention'
                    ? 'text-rose-400'
                    : 'text-amber-400'
                }
              />
              <span
                className={`text-sm uppercase tracking wide ${plantAlert === 'needsAttention' ? 'text-rose-400' : 'text-amber-400'}`}
              >
                {plantAlert === 'needsAttention' ? 'attention' : 'water'}
              </span>
            </button>
          )}
          {/** Streak badge */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
              isStreakActive
                ? 'border-amber-500/30 bg-amber-500/10'
                : 'border-slate-600/30 bg-slate-700/30'
            }`}
          >
            <FlameIcon size={13} lit={isStreakActive} />
            <span
              className={`font-mono text-sm font-bold ${
                isStreakActive ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {currentStreak}
            </span>
            <span className="text-[9px] uppercase tracking-wide text-slate-500">
              streak
            </span>
          </div>

          {/** Yearly Goal */}
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-white">
              {booksFinishedThisYear}/{yearlyGoal}
            </span>
          </div>
        </div>
        {/** Currently Reading */}
        {currentlyReadingTitle && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
            <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
            <span className="text-xs text-slate-400">Reading</span>
            <span className="ml-auto max-w-[110px] truncate text-xs font-semibold text-white">
              {currentlyReadingTitle}
            </span>
          </div>
        )}
        {/** Week Activity */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            This week
          </p>
          <div className="flex items-end justify-between gap-1.5">
            {weekData.map((day) => (
              <div key={day.key} className="flex flex-col items-center gap-1">
                <MiniWeekBar
                  pages={day.pages}
                  maxMin={maxWeekMin}
                  isToday={day.key === todayKey}
                />
                <span
                  className={`text-[10px] font-semibold ${day.key === todayKey ? ' text-amber-400' : 'text-slate-600'}`}
                >
                  {day.key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
