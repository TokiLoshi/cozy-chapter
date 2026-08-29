import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Movie, UserMovie } from '@/db/schemas/movies-schema'
import StarRating from '@/components/StarRating'
import { useAppForm } from '@/hooks/form'
import { updateUserMovieServer } from '@/lib/server/movies'
import { panelStyles } from '@/lib/panelStyles'

type EditMovieModalProps = {
  movie: Movie
  userMovie: UserMovie
  onClose: () => void
}

const editMovieSchema = z.object({
  status: z.enum(['toWatch', 'watching', 'watched']),
  watchingOn: z.string().nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditMovieFormValues = z.infer<typeof editMovieSchema>

export default function EditMovieModal({
  movie,
  userMovie,
  onClose,
}: EditMovieModalProps) {
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      status: userMovie.status,
      watchingOn: userMovie.watchingOn,
      startedAt: userMovie.startedAt,
      finishedAt: userMovie.finishedAt,
      rating: userMovie.rating,
      notes: userMovie.notes,
    } as EditMovieFormValues,
    validators: {
      onChange: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.rating && value.rating < 0) {
          errors.fields.rating =
            "rating can't be negative - the movie couldn't have been that bad"
        }

        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating movie...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateUserMovieServer({
          data: {
            id: userMovie.id,
            updates: {
              status: value.status,
              watchingOn: value.watchingOn,
              startedAt: value.startedAt,
              finishedAt: value.finishedAt,
              rating: value.rating,
              notes: value.notes,
            },
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Movie updated!', {
          classNames: {
            toast: 'bg-slate-800 border-sltate-700',
            title: 'text-slate-100',
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-movies'] })
        onClose()
      } catch (error) {
        console.error(`Error updating movies: ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error('Please try again', {
          description: 'Failed to update movie',
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/** Backdrop */}
      <div className={panelStyles.backdrop} onClick={onClose} />

      {/** Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
      >
        <div className={panelStyles.header}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4">
              {movie.posterPath && (
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
                {movie.tagline && (
                  <p className="text-slate-400">{movie.tagline}</p>
                )}
                {(movie.runtime ?? 0) > 0 && (
                  <p className="text-xs text-slate-500 mt-1">{movie.runtime}</p>
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
                            label="Date started"
                            placeholder="No date yet"
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
                            placeholder="No date yet"
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

          <form.AppField name="watchingOn">
            {(field) => (
              <field.TextField
                label="Platform watching on"
                placeholder="platform e.g Netflix"
              />
            )}
          </form.AppField>

          {/** Notes */}
          <form.AppField name="notes">
            {(field) => <field.TextField label="Notes" placeholder="notes" />}
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
