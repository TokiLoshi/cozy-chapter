import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { redirect } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { updateBookGoal } from '@/db/queries/activities'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// update user goals

export const updateUserPreferencesServer = createServerFn({ method: 'POST' })
  .inputValidator((data: { bookGoal: number }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await updateBookGoal(session.user.id, data.bookGoal)
    if (!result.success) {
      throw new Error('Failed to update user book goal preferences')
    }
    return result.data
  })
