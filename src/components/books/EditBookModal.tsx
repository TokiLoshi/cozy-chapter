import { toast } from 'sonner'
import { Star, XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Books, UserBooks } from '@/db/book-schema'
import { useAppForm } from '@/hooks/form'
import { updateUserBookServer } from '@/lib/server/books'

type EditBookModalProps = {
  book: Books
  userBook: UserBooks
  onClose: () => void
}

const editBookSchema = z.object({
  status: z.enum(['toRead', 'reading', 'read']),
  currentPage: z.number().min(0).nullable(),
  lastChapter: z.number().min(0).nullable(),
  rating: z.number().min(1).max(5).nullable(),
  notes: z.string().nullable(),
})

type EditBookFormValues = z.infer<typeof editBookSchema>

function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number | null
  onChange: (rating: number | null) => void
  disabled?: boolean
}) {
  return (
    <>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (value === star) {
                onChange(null)
              } else {
                onChange(star)
              }
            }}
            className={`p-1 transition-all ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-100'}`}
          >
            <Star
              className={`w-6 h-6 ${value && star <= value ? 'fill-amber-500 text-amber-500' : 'text-slate-500'} `}
            />
          </button>
        ))}
      </div>
    </>
  )
}

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
      rating: userBook.rating ?? null,
      notes: userBook.notes ?? '',
    } as EditBookFormValues,
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (
          book.pageCount &&
          value.currentPage &&
          value.currentPage > book.pageCount
        ) {
          errors.fields.pageCount = `PageCount cannot exceed ${book.pageCount}`
        }
        return errors
      },
    },
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
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-black//60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/** Modal */}
        <div className="relative w-full max-w-2xl max-h-[90h] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          {/** Header with Book info */}
          <div className="stick top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-700/50 p-6 z-10">
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
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
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

            {/** Current Page */}
            <form.AppField
              name="currentPage"
              validators={{
                onChange: ({ value }) => {
                  if (value && value < 0) return 'Chapters cannot be negative'
                  if (book.pageCount && value && value > book.pageCount) {
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
                    placeholder={book.pageCount ? String(book.pageCount) : '?'}
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

            {/** Notes field */}
            <form.AppField name="notes">
              {(field) => <field.TextArea label="Notes" />}
            </form.AppField>

            <div className="flex jusity-end">
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
