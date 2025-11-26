export type Plant = {
  id: string
  userId: string
  type: string
  reccommendedWateringInterval: string
  lastWatered: Date | null
  health: 'thriving' | 'ok' | 'needsAttention'
  notes: string | null
}

export type healthStatus = 'thriving' | 'ok' | 'needsAttention'
