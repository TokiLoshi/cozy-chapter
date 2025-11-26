export type Plant = {
  id: string
  userId: string
  species: string
  recommendedWateringIntervalDays: number
  group: string
  lastWatered: Date | null
  health: 'thriving' | 'ok' | 'needsAttention'
  notes: string | null
}

export type healthStatus = 'thriving' | 'ok' | 'needsAttention'
