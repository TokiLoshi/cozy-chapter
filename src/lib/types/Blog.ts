// Typing
export type Blog = {
  id: string
  userId: string
  title: string
  url: string | null
  author: string | null
  description: string | null
  estimatedReadingTime: number | null
  wordCount: number | null
  status: 'toRead' | 'reading' | 'read'
  notes: string | null
}
