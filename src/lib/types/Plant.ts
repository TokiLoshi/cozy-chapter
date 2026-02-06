import type { userPlants } from '@/db/schemas/plant-schema'

export type PlantType = {
  id: string
  userId: string
  species: string
  name: string
  recommendedWateringIntervalDays: number
  group: string
  lastWatered: Date | null
  plantHealth: 'thriving' | 'ok' | 'needsAttention'
  notes: string | null
  plantImageUrl: string | null
}

export type healthStatus = 'thriving' | 'ok' | 'needsAttention'

export type Plant = typeof userPlants.$inferSelect
