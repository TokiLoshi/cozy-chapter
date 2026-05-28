import type { Plant } from '@/db/schemas/plant-schema'

export type PlantAlert = 'allGood' | 'needsWater' | 'needsAttention'

export function checkWaterNeeds(
  lastWatered: Plant['lastWatered'],
  recommendedWatering: Plant['recommendedWateringIntervalDays'],
): boolean {
  if (!lastWatered || !recommendedWatering) return false
  const today = new Date()
  const lastDate = new Date(lastWatered)
  const daysSince = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  return daysSince >= recommendedWatering
}

export function getPlantAlert(plants: Array<Plant>): PlantAlert {
  if (plants.some((p) => p.plantHealth == 'needsAttention')) {
    return 'needsAttention'
  }
  if (
    plants.some((p) =>
      checkWaterNeeds(p.lastWatered, p.recommendedWateringIntervalDays),
    )
  ) {
    return 'needsWater'
  }
  return 'allGood'
}
