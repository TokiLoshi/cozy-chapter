import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAppForm } from '@/hooks/form'
import { updateUserPreferencesServer } from '@/lib/server/preferences'

type UserPreferencesModal = {
  bookGoal: number
  onClose: () => void
}

const editUserPreferences = z.object({
  booksGoal: z.number().min(0),
})

type EditUserPreferences = z.infer<typeof editUserPreferences>

export default function EditUserPreferences({
  bookGoal,
  onClose,
}: UserPreferencesModal) {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      booksGoal: bookGoal,
    } as EditUserPreferences,
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating user preferences...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateUserPreferencesServer({
          data: { bookGoal: value.booksGoal },
        })
        queryClient.invalidateQueries({ queryKey: ['user-stats'] })
        toast.dismiss(loadingToast)
        toast.success('Preferences have been updated!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
      } catch (error) {
        console.error(
          `Error updating user preferences ${(error as Error).message}`,
        )
        toast.dismiss(loadingToast)
        toast.error(
          'Something went wrong, please try again, or find the developer to complain!',
          {
            description: 'Failed to update user preferneces',
            classNames: {
              toast: 'bg-slate-800 border-slate-700',
              title: 'text-slate-100',
              description: 'text-slate-400',
            },
          },
        )
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
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="flex items-center justify-between border-b border-slate-700/50 p-6">
            <h2 className="text-2xl font-bold text-white">
              Update your preferences
            </h2>
            <button
              onClick={() => onClose()}
              className="cursor-pointer text-white hover:bg-white/10 rounded-md"
            >
              <XIcon className="w-5 h-5" />
            </button>
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
            <form.AppField
              name="booksGoal"
              validators={{
                onChange: ({ value }) => {
                  if (value && value < 0) return 'invalid goal'
                  return undefined
                },
              }}
            >
              {(field) => (
                <field.NumberField
                  label="Reading Goal"
                  min={0}
                  placeholder={bookGoal.toString()}
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
