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
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        {/** Modal */}
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-800/50 p-6 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                {podcast.coverImageUrl && (
                  <img
                    src={podcast.coverImageUrl}
                    alt={podcast.episodeTitle}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {podcast.episodeTitle}
                  </h2>
                  {podcast.showName && (
                    <p className="text-sm text-slate-400">{podcast.showName}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDuration(podcast.durationMs)}
                  </p>
                </div>
              </div>
              <button
                className="cursor-pointer text-white hover:bg-white/10 rounded-md"
                onClick={() => onClose()}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/** Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="p-6 space-y-6 text-gray-100"
          >
            {/** Status Edit  */}
            <form.AppField name="status">
              {(field) => (
                <field.Select
                  label="Listening Status"
                  values={[
                    { label: 'Want to listen to', value: 'toListen' },
                    { label: 'Listening to', value: 'listening' },
                    { label: 'Finished', value: 'listened' },
                  ]}
                />
              )}
            </form.AppField>

            <form.Subscribe
              selector={(state) => state.values.status}
              children={(status) => {
                const isListeningOrFinished =
                  status === 'listening' || status === 'listened'
                const isFinished = status === 'listened'
                return (
                  <>
                    {isListeningOrFinished && (
                      <>
                        {/** Last position MS */}
                        <form.AppField
                          name="lastPositionMs"
                          validators={{
                            onChange: ({ value }) => {
                              if (value && value < 0)
                                return 'Position cannot be negative'
                              return undefined
                            },
                          }}
                        >
                          {(field) => (
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Position
                              </label>
                              {podcastDurationMinutes > 0 ? (
                                <>
                                  <input
                                    type="range"
                                    min={0}
                                    max={podcastDurationMinutes}
                                    value={field.state.value ?? 0}
                                    onChange={(e) =>
                                      field.handleChange(Number(e.target.value))
                                    }
                                    className="w-full accent-amber-500"
                                  />
                                </>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    min={0}
                                    value={field.state.value ?? 0}
                                    onChange={(e) =>
                                      field.handleChange(Number(e.target.value))
                                    }
                                    placeholder="Minutes listened"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  />
                                  <p className="text-xs text-slate-400 mt-1">
                                    Duration unknown - enter minutes manually
                                  </p>
                                </>
                              )}

                              <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>
                                  {formatDuration(
                                    (field.state.value ?? 0) * 60000,
                                  )}
                                </span>
                                <span>
                                  /{formatDuration(podcast.durationMs)}
                                </span>
                              </div>
                            </div>
                          )}
                        </form.AppField>

                        {/** StartedAt */}
                        <form.AppField name="startedAt">
                          {(field) => (
                            <field.DateField
                              label="date started"
                              placeholder={
                                userPodcast.startedAt
                                  ? userPodcast.startedAt.toLocaleDateString()
                                  : new Date().toLocaleDateString()
                              }
                            />
                          )}
                        </form.AppField>
                      </>
                    )}

                    {isFinished && (
                      <>
                        {/** Finished at */}
                        <form.AppField name="finishedAt">
                          {(field) => (
                            <field.DateField
                              label="date finished"
                              placeholder={
                                userPodcast.finishedAt
                                  ? userPodcast.finishedAt.toLocaleDateString()
                                  : new Date().toLocaleDateString()
                              }
                            />
                          )}
                        </form.AppField>

                        {/** Rating */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Rating
                          </label>
                          <form.AppField name="rating">
                            {(field) => (
                              <StarRating
                                value={field.state.value}
                                onChange={(rating) =>
                                  field.handleChange(rating)
                                }
                                disabled={false}
                              />
                            )}
                          </form.AppField>
                        </div>
                      </>
                    )}
                  </>
                )
              }}
            />

            {/** Notes  */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="notes"
                  placeholder={userPodcast.notes ?? 'notes'}
                />
              )}
            </form.AppField>
            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Submit Edit"
                  className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
