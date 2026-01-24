import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import type { Plant } from '@/lib/types/Plant'
import { useAppForm } from '@/hooks/form'
import { updatePlantServer } from '@/lib/server/plants'

export default function EditPlantModal({
  plant,
  refreshPath,
  onClose,
}: {
  plant: Plant
  refreshPath: string
  onClose: () => void
}) {
  const navigate = useNavigate()
  const form = useAppForm({
    defaultValues: {
      species: plant.species,
      recommendedWateringIntervalDays:
        plant.recommendedWateringIntervalDays || null,
      group: plant.group || '',
      lastWatered: plant.lastWatered || null,
      plantHealth: plant.plantHealth,
      notes: plant.notes || '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.species.length === 0) {
          errors.fields.species = 'Species is required'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating plant...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updatePlantServer({
          data: {
            id: plant.id,
            updates: value,
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Plant updated successfully!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        navigate({ to: refreshPath })
        onClose()
      } catch (error) {
        console.error('Error editing plant modal', error)
        toast.error('Failed to update plant', {
          description: 'Please try again',
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
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-700/50 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Plant</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your plant info here
                </p>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="p-6 space-y-6 text-gray-100"
          >
            {/** Species Field */}
            <form.AppField name="species">
              {(field) => (
                <field.TextField label="Title" placeholder={plant.species} />
              )}
            </form.AppField>

            {/** Recommended Watering Interval Days field */}
            <form.AppField name="recommendedWateringIntervalDays">
              {(field) => (
                <field.NumberField
                  label="Recommended Days between waterings"
                  placeholder={
                    plant.recommendedWateringIntervalDays
                      ? String(plant.recommendedWateringIntervalDays)
                      : ''
                  }
                />
              )}
            </form.AppField>

            {/** Group field  */}
            <form.AppField name="group">
              {(field) => (
                <field.TextField
                  label="group"
                  placeholder={plant.group ? plant.group : ''}
                />
              )}
            </form.AppField>

            {/** Last watered field */}
            <form.AppField name="lastWatered">
              {(field) => (
                <field.DateField
                  label="date last watered"
                  placeholder="last week"
                />
              )}
            </form.AppField>

            {/** Plant health field */}
            <form.AppField name="plantHealth">
              {(field) => (
                <field.Select
                  label="Plant Health"
                  values={[
                    { label: 'Thriving', value: 'thriving' },
                    { label: 'Ok', value: 'ok' },
                    { label: 'Needs Attention', value: 'needsAttention' },
                  ]}
                  placeholder={plant.plantHealth}
                />
              )}
            </form.AppField>

            {/** Notes field */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="notes"
                  placeholder={
                    plant.notes ? plant.notes : 'add your thoughts here'
                  }
                />
              )}
            </form.AppField>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Edit Plant"
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
