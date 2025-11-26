import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import type { UserPlants } from '@/db/plant-schema'
import { auth } from '@/lib/auth'
import {
  createPlant,
  deletePlant,
  getUsersPlants,
  updatePlant,
} from '@/db/queries/plants'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// Get user's plants
export const getUserPlants = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await getUsersPlants(session.user.id)
    if (!result.success) {
      throw new Error('Failed to get plants')
    }

    return result.data
  },
)

// Create plants

export const createPlantServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Omit<UserPlants, 'id' | 'createdAt' | 'updatedAt'>) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await createPlant({ ...data, userId: session.user.id })
    if (!result.success) {
      throw new Error('Failed to create plant')
    }
    return result.data
  })

// Update plants
export const updatePlantServer = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<UserPlants> }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await updatePlant(data.id, session.user.id, data.updates)
    if (!result.success) {
      throw new Error('Failed to update plant')
      return result.data
    }
  })

export const deletePlantServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const result = await deletePlant(session.user.id, data)
    if (!result.success) {
      throw new Error('Failed to delete plant')
    }
    return { success: true, id: data }
  })
