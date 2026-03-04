import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { formatDuration } from '../utils/utils'
import type { Podcast, UserPodcast } from '@/db/schemas/podcast-schema'
import StarRating from '@/components/StarRating'
import { useAppForm } from '@/hooks/form'
import { updateUserPodcastServer } from '@/lib/server/podcasts'

type EditPodcastModalProps = {
  podcast: Podcast
  userPodcast: UserPodcast
  onClose: () => void
}

const editPodcastSchema = z.object({
  status: z.enum(['toListen', 'listening', 'listened']),
  lastPositionMs: z.number().min(0).nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditPodcastFormValues = z.infer<typeof editPodcastSchema>

export default function EditPodcastModal({
  podcast,
  userPodcast,
  onClose,
}: EditPodcastModalProps) {
  const queryClient = useQueryClient()
  const currentPositionMinutes =
    Math.floor(userPodcast.lastPositionMs ?? 0) / 60000
  const podcastDurationMinutes = Math.floor((podcast.durationMs ?? 0) / 60000)

  const form = useAppForm({
    defaultValues: {
      status: userPodcast.status,
      lastPositionMs: currentPositionMinutes,
      startedAt: userPodcast.startedAt,
      finishedAt: userPodcast.finishedAt,
      rating: userPodcast.rating,
      notes: userPodcast.notes,
    } as EditPodcastFormValues,
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.lastPositionMs && value.lastPositionMs < 0) {
          errors.fields.lastPositionMinutes = 'Position cannot be negative'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating podcast...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        const lastPositionMs = value.lastPositionMs
          ? Math.round(value.lastPositionMs * 60000)
          : 0
        await updateUserPodcastServer({
          data: {
            id: userPodcast.id,
            updates: {
              status: value.status,
              lastPositionMs: lastPositionMs,
              startedAt: value.startedAt,
              finishedAt: value.finishedAt,
              rating: value.rating,
              notes: value.notes,
            },
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Podcast progress updated!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-podcasts'] })
        onClose()
      } catch (error) {
        console.error(`Error updating podcast: ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error('Please try again', {
          description: 'Failed to update podcast',
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
            description: 'text-slate-400',
          },
        })
      }
    },
  })
  return (
    <>
      <div className="fixed inset-0 z-[60]">{/** Backdrop */}</div>
    </>
  )
}
