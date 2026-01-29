import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import StarRating from '../StarRating'
import type { AudioBooks, UserAudioBooks } from '@/db/schemas/audiobook-schema'
import { useAppForm } from '@/hooks/form'
import { updateUserAudiobookServer } from '@/lib/server/audioBook'

type EditAudioBookModalProps = {
  audioBook: AudioBooks
  userAudioBook: UserAudioBooks
  onClose: () => void
}

const editAudioBookSchema = z.object({
  status: z.enum(['toListen', 'listening', 'listened']),
  lastChapter: z.number().min(0).nullable(),
  positionMinutes: z.number().min(0).nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  rating: z.number().min(0).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditAudioBookFormValues = z.infer<typeof editAudioBookSchema>

export default function EditAudioBookModal({
  audioBook,
  userAudioBook,
  onClose,
}: EditAudioBookModalProps) {
  const queryClient = useQueryClient()

  const currentPositionMinutes = Math.floor(
    (userAudioBook.lastPositionMs ?? 0) / 60000,
  )

  const form = useAppForm({
    defaultValues: {
      status: userAudioBook.status ?? 'toListen',
      lastChapter: userAudioBook.lastChapter ?? 0,
      positionMinutes: currentPositionMinutes,
      startedAt: userAudioBook.startedAt,
      finishedAt: userAudioBook.finishedAt,
      rating: userAudioBook.rating,
      notes: userAudioBook.notes,
    } as EditAudioBookFormValues,
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (
          audioBook.totalChapters &&
          value.lastChapter &&
          value.lastChapter > audioBook.totalChapters
        ) {
          errors.fields.lastChapter = `Chapter cannot exceed ${audioBook.totalChapters}`
        }
        if (value.positionMinutes && value.positionMinutes < 0) {
          errors.fields.positionMinutes = 'Position cannot be negative'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating audibook...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        const lastPositionMs = value.positionMinutes
          ? Math.round(value.positionMinutes * 60000)
          : 0
        await updateUserAudiobookServer({
          data: {
            id: userAudioBook.id!,
            updates: {
              status: value.status,
              lastChapter: value.lastChapter,
              lastPositionMs,
              startedAt: value.startedAt,
              finishedAt: value.finishedAt,
              rating: value.rating,
              notes: value.notes,
            },
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Audiobook progress updated!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })

        queryClient.invalidateQueries({ queryKey: ['user-audiobooks'] })
        onClose()
      } catch (error) {
        console.error(`Error updating audiobook: ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error('Please try again', {
          description: 'Failed to update audiobook',
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
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/** Modal */}
        <div className="relative w-full max-w-2xl max-h-[90h] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          {/** Header with audiobook info */}
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-700/50 p-6 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                {audioBook.coverImageUrl && (
                  <img
                    src={audioBook.coverImageUrl}
                    alt={audioBook.title}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {audioBook.title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    by {audioBook.authors?.join(', ') ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {audioBook.totalChapters} chapters
                  </p>
                </div>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/** Form  */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="p-6 space-y-6 text-gray-100"
          >
            {/**  Status Edit */}
            <form.AppField name="status">
              {(field) => (
                <field.Select
                  label="Listening Status"
                  values={[
                    { label: 'Want to Listen to', value: 'toListen' },
                    { label: 'Listening to', value: 'listening' },
                    { label: 'Finished listening to', value: 'listened' },
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
                        {/** Current Chapter Edit */}
                        <form.AppField
                          name="lastChapter"
                          validators={{
                            onChange: ({ value }) => {
                              if (value && value < 0)
                                return 'Chapters cannot be negative'
                              if (
                                audioBook.totalChapters &&
                                value &&
                                value > audioBook.totalChapters
                              ) {
                                return `Chapters cannot exceed total chapters: ${audioBook.totalChapters}`
                              }
                              return undefined
                            },
                          }}
                        >
                          {(field) => (
                            <div>
                              <field.NumberField
                                label="Current Chapter"
                                min={0}
                                max={audioBook.totalChapters ?? undefined}
                                placeholder={
                                  userAudioBook.lastChapter
                                    ? userAudioBook.toString()
                                    : 'last chapter'
                                }
                              />
                            </div>
                          )}
                        </form.AppField>

                        {/** Position in Chapter  */}
                        <form.AppField
                          name="positionMinutes"
                          validators={{
                            onChange: ({ value }) => {
                              if (value && value < 0)
                                return 'Position cannot be negative'
                              return undefined
                            },
                          }}
                        >
                          {(field) => (
                            <field.NumberField
                              label="Current Position (in minutes)"
                              min={0}
                              placeholder={
                                userAudioBook.lastChapter
                                  ? userAudioBook.lastChapter.toString()
                                  : '0'
                              }
                            />
                          )}
                        </form.AppField>

                        {/** Started At */}
                        <form.AppField name="startedAt">
                          {(field) => (
                            <field.DateField
                              label="date started"
                              placeholder={
                                userAudioBook.startedAt
                                  ? userAudioBook.startedAt.toLocaleDateString()
                                  : new Date().toLocaleDateString()
                              }
                            />
                          )}
                        </form.AppField>
                      </>
                    )}
                    {isFinished && (
                      <>
                        {/** Finished At */}
                        <form.AppField name="finishedAt">
                          {(field) => (
                            <field.DateField
                              label="date finished"
                              placeholder={
                                userAudioBook.finishedAt
                                  ? userAudioBook.finishedAt.toLocaleDateString()
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
                    {/** Notes  */}
                    <form.AppField name="notes">
                      {(field) => (
                        <field.TextField
                          label="notes"
                          placeholder={userAudioBook.notes ?? 'notes'}
                        />
                      )}
                    </form.AppField>
                  </>
                )
              }}
            />

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
