import { Trash, XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'
import { createPlantServer } from '@/lib/server/plants'
import { useAppForm } from '@/hooks/form'
import { Button } from '@/components/ui/button'

type PlantFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

export default function PlantModal({
  isOpen,
  onClose,
  refreshPath,
}: PlantFormProps) {
  const [isAddFormOpen, setisAddFormOpen] = useState(false)
  const plantsPlaceholder = []

  if (!isOpen) return null

  const closeModal = () => {
    console.log('Close modal')
    onClose()
  }

  const handleDelete = (id: string) => {
    console.log('User wants to delete plant: ', id)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        {/** Modal Content */}
        <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Your plants 🌱</h2>
            <button
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              <XIcon />
            </button>
          </div>
          <button
            className="bg-white mb-3 py-2 text-indigo-800/90 hover:text-indigo-700 hover:bg-gray-100 cursor-pointer rounded-lg px-6"
            onClick={() => {
              setisAddFormOpen(true)
            }}
          >
            + Add Plant
          </button>
          <PlantForm
            isOpen={isAddFormOpen}
            onClose={() => setisAddFormOpen(false)}
            refreshPath={refreshPath}
          />

          {/** Empty State */}
          {plantsPlaceholder.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No plants added to inventory yet
            </div>
          )}

          {plantsPlaceholder.length > 0 && (
            <ScrollArea className="h-[500px] p-2">
              <div
                key={1}
                className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  Plant 1 title
                </h3>
                <p className="text-lg font-semibold text-white mb-2">
                  <span className="text-l font-semibold">Some info</span>
                  more info
                </p>
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 items-center">
                <button
                  onClick={() => console.log('Edit button should go here')}
                  className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Edit
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={() => handleDelete('1')}
                  className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </>
  )
}

function PlantForm({ isOpen, onClose, refreshPath }: PlantFormProps) {
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
                <field.NumberField
                  label="Recommended Days between Waterings"
                  placeholder="7"
                />
              )}
            </form.AppField>

            {/** group */}
            <form.AppField name="group">
              {(field) => (
                <field.TextField label="group" placeholder="lounge plants" />
              )}
            </form.AppField>

            {/** last watered */}
            <form.AppField name="lastWatered">
              {(field) => (
                <field.DateField
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
                    {
                      label: 'Needs Attention',
                      value: 'needsAttention',
                    },
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
            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Add Plant"
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
