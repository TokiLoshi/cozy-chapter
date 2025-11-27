import { XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { createPlantServer } from '@/lib/server/plants'
import { useAppForm } from '@/hooks/demo.form'

type PlantFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

export default function PlantForm({
  isOpen,
  onClose,
  refreshPath,
}: PlantFormProps) {
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      species: '',
      recommendedWateringIntervalDays: 7,
      group: '',
      lastWatered: null as Date | null,
      plantHealth: 'thriving' as 'thriving' | 'ok' | 'needsAttention',
      notes: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }

        // Species Required
        if (value.species.length === 0) {
          errors.fields.species = 'Species is required'
        }

        // Watering Days required
        if (
          !value.recommendedWateringIntervalDays ||
          value.recommendedWateringIntervalDays <= 0
        ) {
          errors.fields.recommendedWateringIntervalDays =
            'Please enter plant watering period'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await createPlantServer({
          data: {
            species: value.species,
            recommendedWateringIntervalDays:
              value.recommendedWateringIntervalDays,
            group: value.group || null,
            lastWatered: value.lastWatered,
            plantHealth: value.plantHealth,
            notes: value.notes || null,
          },
        })
        toast.success('Plant added successfully! 🌱', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
        navigate({ to: refreshPath })
      } catch (error) {
        console.error('Uh oh spaghetti os, something went wrong ', error)
        toast.error('Failed to add plant', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
      }
    },
  })
  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Water your plants
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Here is the status report
                </p>
              </div>
              <button
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
                onClick={onClose}
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
            {/** species */}
            <form.AppField name="species">
              {(field) => (
                <field.TextField
                  label="Species"
                  placeholder="Species / type of plant e.g Orchid"
                />
              )}
            </form.AppField>

            {/** recommended watering */}
            <form.AppField name="recommendedWateringIntervalDays">
              {(field) => (
                <field.TextField
                  label="Recommended Days between Waterings"
                  placeholder="7"
                />
              )}
            </form.AppField>

            {/** group */}
            <form.AppField name="group">
              {(field) => (
                <field.TextField label="group" placeholder="lounge. plants" />
              )}
            </form.AppField>

            {/** last watered */}
            <form.AppField name="lastWatered">
              {(field) => (
                <field.TextField
                  label="date last watered"
                  placeholder="last week"
                />
              )}
            </form.AppField>

            {/** Plant Health */}
            <form.AppField name="plantHealth">
              {(field) => (
                <field.Select
                  label="Plant Health"
                  values={[
                    { label: 'Thriving', value: 'thriving' },
                    { label: 'Ok', value: 'ok' },
                    { label: 'Needs Attention', value: 'needsAttention' },
                  ]}
                  placeholder="Select status"
                />
              )}
            </form.AppField>

            {/** Notes */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="notes"
                  placeholder="add your thoughts here"
                />
              )}
            </form.AppField>
          </form>
        </div>
      </div>
    </>
  )
}
