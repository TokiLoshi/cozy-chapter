export function formatDuration(ms: number | null): string {
  if (!ms) return '--'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const hours = Math.floor(totalSeconds / 3600)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
