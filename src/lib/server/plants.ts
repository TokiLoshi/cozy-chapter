import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { UTApi } from 'uploadthing/server'
import type { NewPlant } from '@/db/schemas/plant-schema'
import { auth } from '@/lib/auth'
import {
  createPlant,
  deletePlant,
  getUsersPlants,
  updatePlant,
  waterAllPlants,
} from '@/db/queries/plants'
import {
  getHouseholdMembers,
  getMembershipByUser,
} from '@/db/queries/household'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// Resolve membership
const getCurrentHousehold = async (userId: string) => {
  const household = await getMembershipByUser(userId)
  return household.data?.householdId
}

// Get user's plants
export const getUserPlants = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const householdId = await getCurrentHousehold(userId)
    const nameByUserId = new Map<string, string>()
    if (householdId) {
      const housemates = await getHouseholdMembers(householdId)
      for (const housemate of housemates.members ?? []) {
        nameByUserId.set(housemate.userId, housemate.name)
      }
    }

    const result = await getUsersPlants(userId, householdId)
    if (!result.success) {
      throw new Error('Failed to get plants')
    }
    const plants = (result.data ?? []).map((plant) => ({
      ...plant,
      updatedByName: plant.updatedBy
        ? (nameByUserId.get(plant.updatedBy) ?? null)
        : null,
    }))

    return plants
  },
)

// Create plants
export const createPlantServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Omit<NewPlant, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const householdId = await getCurrentHousehold(userId)
    const result = await createPlant({ ...data, userId: userId, householdId })
    if (!result.success) {
      throw new Error('Failed to create plant')
    }
    return result.data
  })

type PlantUpdates = Partial<
  Omit<NewPlant, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>

// Update plants
export const updatePlantServer = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: PlantUpdates }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const household = await getCurrentHousehold(userId)

    const result = await updatePlant(data.id, userId, data.updates, household)
    if (!result.success) {
      throw new Error('Failed to update plant')
    }
    return result.data
  })

// Water all plants
export const waterAllPlantServer = createServerFn({ method: 'POST' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const householdId = await getCurrentHousehold(userId)
    const result = await waterAllPlants(userId, householdId)
    if (!result.success) {
      throw new Error('Failed to water all plants')
    }
    return { count: result.data?.length ?? 0 }
  },
)

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

const utapi = new UTApi()

export const deleteUploadedImageServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    try {
      const result = await utapi.deleteFiles(data)
      return { success: result.success, deletedCount: result.deletedCount }
    } catch (error) {
      throw new Error('Failed to delete image')
    }
  })
