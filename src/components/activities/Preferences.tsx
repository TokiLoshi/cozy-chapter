import { toast } from 'sonner'
import { LogOut, Pencil, XIcon } from 'lucide-react'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAppForm } from '@/hooks/form'
import { updateUserPreferencesServer } from '@/lib/server/preferences'
import {
  getHouseholdState,
  inviteHousehold,
  leaveHousehold,
  updateHousehold,
} from '@/lib/server/household'
import { exportData } from '@/lib/server/exportData'

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
  const [isEditing, setIsEditing] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const editHousholdForm = useAppForm({
    defaultValues: {
      householdName: household?.name ?? '',
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating houeshold name', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateHousehold({ data: { householdName: value.householdName } })
        queryClient.invalidateQueries({ queryKey: ['household-state'] })
        toast.dismiss(loadingToast)
        toast.success('Household renamed!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        setIsEditing(false)
      } catch (error) {
        console.error(`Error updating household ${(error as Error).message}`)
        toast.error('Failed to rename household')
      }
    },
  })

  const exportMutation = useMutation({
    mutationFn: async () => await exportData(),
    onSuccess: (data) => {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'cozy-chapter-export.json'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Your data has been exported!', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
    },
    onError: (error) => {
      console.error(`Export failed: ${error}`)
      toast.error('Error exporting datina', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
          description: 'text-slate-400',
        },
      })
    },
  })

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
  const handleRename = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(!isEditing)
  }

  const leaveHouseHold = async () => {
    const loadingToast = toast.loading('Leaving household...', {
      classNames: {
        toast: 'bg-slate-800 border-slate-700',
        title: 'text-slate-100',
      },
    })
    try {
      await leaveHousehold()
      queryClient.invalidateQueries({ queryKey: ['household-state'] })
      queryClient.invalidateQueries({ queryKey: ['user-plants'] })
      toast.dismiss(loadingToast)
      toast.success('You have left the household', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
    } catch (error) {
      console.error('Something went wrong')
      toast.dismiss(loadingToast)
      toast.error(
        'Something went wrong, please try again, or find the developer to complain!',
        {
          description: 'Failed to leave the household',
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
            description: 'text-slate-400',
          },
        },
      )
    }
  }

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    toast(
      'Are you sure you want to leave the houshold? This cannot be undone',
      {
        action: {
          label: 'Leave',
          onClick: () => leaveHouseHold(),
        },
        cancel: {
          label: 'cancel',
          onClick: () => {},
        },
      },
    )
  }

  const handleExport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Handling export...')
    exportMutation.mutate()
    console.log('Mutation finished')
  }
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
            {household?.status === 'shared' && (
              <div className="p-6">
                <div className="text-md text-white">
                  <p className="text-md text-white">
                    Sharing {household.name ?? 'your household'}{' '}
                    {household.housemate
                      ? `with ${household.housemate.name}`
                      : ''}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRename}
                      aria-label="Rename household"
                      title="Rename household"
                      className="cursor-pointer text-slate-400 hover:text-white p-2 rounded-md hover:bg-white/10-"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleLeave}
                      aria-label="Leave household"
                      title="Leave household"
                      className="cursor-pointer text-slate-400 hover:text-rose-400 p-2 rounded-md hover:bg-rose-300"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {isEditing && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      editHousholdForm.handleSubmit()
                    }}
                    className="mt-4 space-y-4 text-gray-100"
                  >
                    <editHousholdForm.AppField
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
                    </editHousholdForm.AppField>
                    <div className="flex justify-end">
                      <editHousholdForm.AppForm>
                        <editHousholdForm.SubmitButton
                          label="Rename"
                          className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                        />
                      </editHousholdForm.AppForm>
                    </div>
                  </form>
                )}
              </div>
            )}
            {household?.status === 'alone' && (
              <div className="p-6">
                <div className="text-md text-white">
                  <p className="text-md text-white">
                    You're not sharing {household.name ?? 'your household'} with
                    anyone, would you like to invite someone?
                  </p>
                  <button
                    onClick={() => setIsInviting(!isInviting)}
                    aria-label="Send Invitation"
                    className="cursor-pointer text-slate-400 hover:text-white p-2 rounded-md hover:bg-white/10"
                  >
                    Send Invite
                  </button>
                  {isInviting && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        householdForm.handleSubmit()
                      }}
                      className="p-6 space-y-6 text-gray-100"
                    >
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
                  <div className="flex gap-2">
                    <button
                      onClick={handleRename}
                      aria-label="Rename household"
                      title="Rename household"
                      className="cursor-pointer text-slate-400 hover:text-white p-2 rounded-md hover:bg-white/10"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleLeave}
                      aria-label="Leave household"
                      title="Leave household"
                      className="cursor-pointer text-slate-400 hover:text-rose-400 p-2 rounded-md hover:bg-rose-300"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {isEditing && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      editHousholdForm.handleSubmit()
                    }}
                    className="mt-4 space-y-4 text-gray-100"
                  >
                    <editHousholdForm.AppField
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
                    </editHousholdForm.AppField>
                    <div className="flex justify-end">
                      <editHousholdForm.AppForm>
                        <editHousholdForm.SubmitButton
                          label="Rename"
                          className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                        />
                      </editHousholdForm.AppForm>
                    </div>
                  </form>
                )}
              </div>
            )}
            {household?.status === 'pending' && (
              <p className="text-md ms-3 p-2 text-white">
                Invite pending for {household.name ?? 'your household'}
              </p>
            )}

            {household?.status === 'solo' && (
              <p className="text-md ms-3 p-2 text-white">
                You're flying solo. Would you like to invite someone to share
                your plants with
              </p>
            )}
          </div>
          <button
            onClick={handleExport}
            aria-label="export data"
            className="cursor-pointer ms-5 text-slate-400 hover:text-white p-2 rounded-md hover:bg-white/10"
          >
            Export My Data
          </button>
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
                  label="This year's reading goal"
                  min={0}
                  placeholder={bookGoal.toString()}
                />
              )}
            </form.AppField>
            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Update Goal"
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
