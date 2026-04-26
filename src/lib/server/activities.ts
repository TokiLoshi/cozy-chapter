import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { getRecentActivity, getUserStats } from '@/db/queries/activities'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// get users activities
export const getUserStatsServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const result = await getUserStats(session.user.id, timeZone)
    if (!result.success) throw new Error('Failed to get user stats')
    return result.data
  },
)

export const getRecentActivityServer = createServerFn({ method: 'GET' })
  .inputValidator((data: { days?: number }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await getRecentActivity(session.user.id, data.days ?? 7)
    if (!result.success) throw new Error()
    return result.data
  })
