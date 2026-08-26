import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import StarRating from '../StarRating'
import type { Books, UserBooks } from '@/db/schemas/book-schema'
import { useAppForm } from '@/hooks/form'
import { updateUserBookServer } from '@/lib/server/books'
import { panelStyles } from '@/lib/panelStyles'

type EditBookModalProps = {
  book: Books
  userBook: UserBooks
  onClose: () => void
}

const editBookSchema = z.object({
  status: z.enum(['toRead', 'reading', 'read']),
  currentPage: z.number().min(0).nullable(),
  lastChapter: z.number().min(0).nullable(),
  startedAt: z.date().nullable(),
  finishedAt: z.date().nullable(),
  rating: z.number().min(1).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditBookFormValues = z.infer<typeof editBookSchema>

export default function EditBookModal({
  book,
  userBook,
  onClose,
}: EditBookModalProps) {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      status: userBook.status ?? 'toRead',
      currentPage: userBook.currentPage ?? 0,
      lastChapter: userBook.lastChapter ?? 0,
      startedAt: userBook.startedAt,
      finishedAt: userBook.finishedAt,
      rating: userBook.rating ?? null,
      notes: userBook.notes ?? '',
    } as EditBookFormValues,

    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating book...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateUserBookServer({
          data: {
            id: userBook.id!,
            updates: {
              status: value.status,
              currentPage: value.currentPage,
              lastChapter: value.lastChapter,
              startedAt: value.startedAt,
              finishedAt: value.finishedAt,
              rating: value.rating,
              notes: value.notes,
            },
            bookPageCount: book.pageCount,
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Book progress updated!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-books'] })
        queryClient.invalidateQueries({ queryKey: ['user-stats'] })
        queryClient.invalidateQueries({ queryKey: ['recent-activity'] })
        onClose()
      } catch (error) {
        console.error(`Error updating book: ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error('Please try again', {
          description: 'Failed to update book',
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
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div className={`${panelStyles.backdrop}`} onClick={onClose} />

        {/** Modal */}
        <div
          className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
        >
          {/** Header with Book info */}
          <div className={`${panelStyles.header}`}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">
                {book.coverImageUrl && (
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-16 h-16 object-cover rounded-lg shadow-md"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {book.title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    by {book.authors?.join(', ') ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {book.pageCount} pages
                  </p>
                </div>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text-white hover:bg-white/10 rounded-md"
              >
                <XIcon className="w-5 h-5" />
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
                  label="Reading Status"
                  values={[
                    { label: 'Want to Read', value: 'toRead' },
                    { label: 'Reading', value: 'reading' },
                    { label: 'Read', value: 'read' },
                  ]}
                />
              )}
            </form.AppField>

            <form.Subscribe
              selector={(state) => state.values.status}
              children={(status) => {
                const isReadingOrFinished =
                  status === 'reading' || status === 'read'
                const isFinished = status === 'read'
                return (
                  <>
                    {isReadingOrFinished && (
                      <>
                        {/** Current Page */}
                        <form.AppField
                          name="currentPage"
                          validators={{
                            onChange: ({ value }) => {
                              if (value && value < 0)
                                return 'Pages cannot be negative'
                              if (
                                book.pageCount &&
                                value &&
                                value > book.pageCount
                              ) {
                                return `Page count cannot exceed ${book.pageCount}`
                              }
                              return undefined
                            },
                          }}
                        >
                          {(field) => (
                            <div>
                              <field.NumberField
                                label="Current Page"
                                placeholder={
                                  book.pageCount ? String(book.pageCount) : '?'
                                }
                                min={0}
                                max={book.pageCount ?? undefined}
                              />
                            </div>
                          )}
                        </form.AppField>

                        {/** Last Chapter */}
                        <form.AppField name="lastChapter">
                          {(field) => (
                            <field.NumberField
                              label="Last Chapter Read"
                              placeholder="0"
                              min={0}
                            />
                          )}
                        </form.AppField>
                        {/** Started At */}
                        <form.AppField name="startedAt">
                          {(field) => (
                            <field.DateField
                              label="Date Started"
                              placeholder="e.g today's date"
                            />
                          )}
                        </form.AppField>
                      </>
                    )}
                    {isFinished && (
                      <>
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
                          {/** Finished At */}
                          <form.AppField name="finishedAt">
                            {(field) => (
                              <field.DateField
                                label="Date Finished"
                                placeholder="e.g today's date"
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

            {/** Notes field */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextArea
                  label="Notes"
                  placeholder="What do you think?"
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
