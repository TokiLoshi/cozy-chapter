import { and, eq } from 'drizzle-orm'
import { UTApi } from 'uploadthing/server'
import { userPlants } from '../schemas/plant-schema'
import type { NewPlant } from '@/db/schemas/plant-schema'
import { db } from '@/db'

// Create new plant
export async function createPlant(plant: NewPlant) {
  try {
    const [result] = await db.insert(userPlants).values(plant).returning()
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating plant', plant)
    return { success: false, error }
  }
}

// get plant data for user
export async function getUsersPlants(userId: string) {
  try {
    const result = await db
      .select()
      .from(userPlants)
      .where(eq(userPlants.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error getting plants for user: ', userId)
    return { success: false, error }
  }
}

type PlantUpdates = Partial<
  Omit<NewPlant, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>

// Update plant
export async function updatePlant(
  id: string,
  userId: string,
  updates: PlantUpdates,
) {
  try {
    const result = await db
      .update(userPlants)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userPlants.id, id), eq(userPlants.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error editing plant with id: ', id)
    return { success: false, error }
  }
}

const utapi = new UTApi()

// Delete Plant
export async function deletePlant(userId: string, id: string) {
  try {
    const [plant] = await db
      .select({ plantImageUrl: userPlants.plantImageUrl })
      .from(userPlants)
      .where(and(eq(userPlants.id, id), eq(userPlants.userId, userId)))

    if (plant.plantImageUrl) {
      const fileKey = plant.plantImageUrl.split('/').pop()
      if (fileKey) {
        await utapi.deleteFiles(fileKey)
      }
    }

    const result = await db
      .delete(userPlants)
      .where(and(eq(userPlants.id, id), eq(userPlants.userId, userId)))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error deleting plant with id: ', id)
    return { success: false, error }
  }
}
