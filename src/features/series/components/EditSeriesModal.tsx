import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import type { TvSeries, UserSeries } from '@/db/schemas/series-schema'
import StarRating from '@/components/StarRating'
import { useAppForm } from '@/hooks/form'
import { updateUserSeriesServer } from '@/lib/server/series'

type EditSeriesModalProps = {
  series: TvSeries
  userSeries: UserSeries
  onClose: () => void
}

const editSeriesSchema = z.object({
  status: z.enum(['toWatch', 'watching', 'watched']),
  watchingOn: z.string().nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  currentSeason: z.number().nullable(),
  currentEpisode: z.number().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditSeriesFormValues = z.infer<typeof editSeriesSchema>

export default function EditSeriesModal({
  series,
  userSeries,
  onClose,
}: EditSeriesModalProps) {
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      status: userSeries.status,
      watchingOn: userSeries.watchingOn,
      startedAt: userSeries.startedAt,
      finishedAt: userSeries.finishedAt,
      currentSeason: userSeries.currentSeason,
      currentEpisode: userSeries.currentEpisode,
      rating: userSeries.rating,
      notes: userSeries.notes,
    } as EditSeriesFormValues,
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.rating && value.rating < 0) {
          errors.fields.rating =
            "rating can't be negative - the series couldn't have been that bad"
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating series...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateUserSeriesServer({
          data: {
            id: userSeries.id,
            updates: {
              status: value.status,
              watchingOn: value.watchingOn,
              startedAt: value.startedAt,
              finishedAt: value.finishedAt,
              currentSeason: value.currentSeason,
              currentEpisode: value.currentEpisode,
              rating: value.rating,
              notes: value.notes,
            },
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Series updated!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-series'] })
        onClose()
      } catch (error) {
        console.error(`Error updating movies: ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error('Please try again', {
          description: 'Failed to update series',
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/** Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/** Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 m-4">
        <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-800/50 p-6 z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              {series.posterPath && (
                <img
                  src={series.posterPath}
                  alt={series.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {series.title}
                </h2>
                {series.tagline && (
                  <p className="text-slate-400">{series.tagline}</p>
                )}
                {series.numberOfEpisodes && (
                  <p className="text-xs text-slate-500 mt-1">
                    {series.numberOfEpisodes}
                  </p>
                )}
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
          {/** Status Edit */}
          <form.AppField name="status">
            {(field) => (
              <field.Select
                label="Watching Status"
                values={[
                  { label: 'Want to Watch', value: 'toWatch' },
                  { label: 'Watching', value: 'watching' },
                  { label: 'Watched', value: 'watched' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe
            selector={(state) => state.values.status}
            children={(status) => {
              const isWatchingOrFinished =
                status === 'watching' || status === 'watched'
              const isFinished = status === 'watched'
              return (
                <>
                  {isWatchingOrFinished && (
                    <>
                      {/**  Watching on */}
                      {/** StartedAt */}
                      <form.AppField name="startedAt">
                        {(field) => (
                          <field.DateField
                            label="date started"
                            placeholder={
                              userSeries.startedAt
                                ? userSeries.startedAt.toLocaleDateString()
                                : new Date().toLocaleDateString()
                            }
                          />
                        )}
                      </form.AppField>
                      {/** Current Season */}
                      <form.AppField name="currentSeason">
                        {(field) => (
                          <field.NumberField
                            label="current season"
                            placeholder={String(userSeries.currentSeason ?? 0)}
                          />
                        )}
                      </form.AppField>
                      {/** Current Episode */}
                      <form.AppField name="currentEpisode">
                        {(field) => (
                          <field.NumberField
                            label="current episode"
                            placeholder={String(userSeries.currentEpisode ?? 0)}
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
                            label="Date Finished"
                            placeholder={
                              userSeries.finishedAt
                                ? userSeries.finishedAt.toLocaleDateString()
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
                              onChange={(rating) => field.handleChange(rating)}
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
          {/** Watching on */}
          <form.AppField name="watchingOn">
            {(field) => (
              <field.TextField
                label="platform watching on"
                placeholder={
                  userSeries.status === 'watched'
                    ? 'watched on:'
                    : 'watching on'
                }
              />
            )}
          </form.AppField>

          {/** Notes */}
          <form.AppField name="notes">
            {(field) => (
              <field.TextField
                label="notes"
                placeholder={userSeries.notes ?? 'notes'}
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
  )
}
