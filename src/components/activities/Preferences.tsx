import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppForm } from '@/hooks/form'
import { updateUserPreferencesServer } from '@/lib/server/preferences'
import { getHouseholdState, inviteHousehold } from '@/lib/server/household'

type UserPreferencesModal = {
  bookGoal: number
  onClose: () => void
}

const editUserPreferences = z.object({
  booksGoal: z.number().min(0),
})

const editUserHousehold = z.object({
  email: z.email(),
  householdName: z.string().min(3),
})

type EditUserPreferences = z.infer<typeof editUserPreferences>
type EditUserHousehold = z.infer<typeof editUserHousehold>

export default function EditUserPreferences({
  bookGoal,
  onClose,
}: UserPreferencesModal) {
  const queryClient = useQueryClient()
  const { data: household } = useQuery({
    queryKey: ['household-state'],
    queryFn: async () => await getHouseholdState(),
  })

  console.log(' Household data: ', household)

  const householdForm = useAppForm({
    defaultValues: {
      email: '',
      householdName: '',
    } as EditUserHousehold,
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Sending Invite', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await inviteHousehold({
          data: { emailTo: value.email, householdName: value.householdName },
        })
        queryClient.invalidateQueries({ queryKey: ['household-state'] })
        toast.dismiss(loadingToast)
        toast.success('Household Invite has been sent!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
      } catch (error) {
        console.error(`Error updating household ${(error as Error).message}`)
        toast.dismiss(loadingToast)
        toast.error(
          `Something went wrong, please try again, or find the developer`,
          {
            description: 'Failed to update household',
            classNames: {
              toast: 'bg-slate-800 border-slate-700',
              title: 'text-slate-800',
              description: 'text-slate-400',
            },
          },
        )
      }
    },
  })

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
            <h2 className="text-2xl font-bold text-white">Sharing and Goals</h2>

            <button
              onClick={() => onClose()}
              className="cursor-pointer text-white hover:bg-white/10 rounded-md"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
          <div>
            <p className="text-md ms-3 p-2 font-semibold text-white">
              You currently have the goal of reading {bookGoal} this year
            </p>
            <p className="text-md ms-3 p-2  text-white">
              Houeshold Status: {household ? household.status : 'No household'}
            </p>
          </div>

          {household && household.status === 'solo' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                householdForm.handleSubmit()
              }}
              className="p-6 space-y-6 text-gray-100"
            >
              <householdForm.AppField
                name="householdName"
                validators={{
                  onChange: ({ value }) => {
                    if (value && value.length === 0)
                      return 'please name your houshold'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <field.TextField
                    label="Household Name"
                    placeholder="Name your household"
                  />
                )}
              </householdForm.AppField>
              <householdForm.AppField
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (value && value.length === 0)
                      return 'please enter a valid email address'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <field.TextField
                    label="Housemate's email address"
                    placeholder="e.g housemate@cozy.com"
                  />
                )}
              </householdForm.AppField>
              <div className="flex justify-end">
                <householdForm.AppForm>
                  <householdForm.SubmitButton
                    label="Send Invite"
                    className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                  />
                </householdForm.AppForm>
              </div>
            </form>
          )}

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
                  label="Update Reading Goal"
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
