import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Plant } from '@/lib/types/Plant'
import { useAppForm } from '@/hooks/form'
import {
  deleteUploadedImageServer,
  updatePlantServer,
} from '@/lib/server/plants'
import { UploadDropzone } from '@/lib/uploadthing'
import { panelStyles } from '@/lib/panelStyles'

export default function EditPlantModal({
  plant,
  onClose,
}: {
  plant: Plant
  onClose: () => void
}) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(
    plant.plantImageUrl ?? null,
  )
  const [imagesToDelete, setImagesToDelete] = useState<Array<string>>([])

  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      species: plant.species,
      name: plant.name,
      recommendedWateringIntervalDays:
        plant.recommendedWateringIntervalDays || null,
      group: plant.group || '',
      lastWatered: plant.lastWatered || null,
      plantHealth: plant.plantHealth,
      lightPreferences: plant.lightPreferences || null,
      notes: plant.notes || '',
    },
    validators: {
      onChange: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.species.length === 0) {
          errors.fields.species = 'Species is required.'
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
            updates: {
              ...value,
              plantImageUrl: currentImageUrl,
            },
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-plants'] })
        toast.dismiss(loadingToast)
        toast.success('Plant updated successfully!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        for (const key of imagesToDelete) {
          try {
            await deleteUploadedImageServer({ data: key })
          } catch (error) {
            console.error(`Error deleting image(s).`)
          }
        }
        onClose()
      } catch (error) {
        console.error('Error editing plant modal', error)
        toast.error('Failed to update plant.', {
          description: 'Please try again.',
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
        <div className={`${panelStyles.backdrop}`} onClick={onClose} />
        {/** Modal */}
        <div
          className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto m-4 ${panelStyles.container}`}
        >
          <div className={`${panelStyles.header}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Plant</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your plant info here
                </p>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text-white hover:bg-white/10 rounded-md"
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
                <field.TextField
                  label="Species"
                  placeholder="Species / type of plant e.g Orchid."
                />
              )}
            </form.AppField>
            {/** Name */}
            <form.AppField name="name">
              {(field) => (
                <field.TextField
                  label="Name"
                  placeholder="Does this plant have a name?"
                />
              )}
            </form.AppField>

            {/** Recommended Watering Interval Days field */}
            <form.AppField name="recommendedWateringIntervalDays">
              {(field) => (
                <field.NumberField
                  label="Recommended days between waterings"
                  placeholder="How often should they be watered? E.g 7"
                />
              )}
            </form.AppField>

            {/** Group field  */}
            <form.AppField name="group">
              {(field) => (
                <field.TextField
                  label="Group"
                  placeholder="E.g lounge plants."
                />
              )}
            </form.AppField>

            {/** Last watered field */}
            <form.AppField name="lastWatered">
              {(field) => (
                <field.DateField
                  label="Date last watered"
                  placeholder="Not watered yet."
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
                  placeholder="How is this plant doing?"
                />
              )}
            </form.AppField>

            {/** Light Preferences */}
            <form.AppField name="lightPreferences">
              {(field) => (
                <field.Select
                  label="Plant Light Preferences"
                  values={[
                    { label: 'Low light', value: 'low' },
                    { label: 'Medium light', value: 'medium' },
                    { label: 'Bright Indirect', value: 'brightIndirect' },
                    { label: 'Bright Direct', value: 'brightDirect' },
                  ]}
                  placeholder="Which lighting does it tend to do better in?"
                />
              )}
            </form.AppField>

            {/** Notes field */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="Notes"
                  placeholder="Any thoughts or reminders to add here?"
                />
              )}
            </form.AppField>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Plant Photo
              </label>
              {currentImageUrl ? (
                <div className="relative w-24 h-24">
                  <img
                    src={currentImageUrl}
                    alt="Plant Image"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const fileKey = currentImageUrl.split('/').pop()
                      if (fileKey) {
                        setImagesToDelete((prev) => [...prev, fileKey])
                      }
                      setCurrentImageUrl(null)
                    }}
                    className="cursor-pointer absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <XIcon className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  appearance={{
                    container:
                      'border-2 border-dashed border-slate-700/50 bg-slate-950/40 rounded-lg',
                    button:
                      '!bg-amber-600/90 hover:!bg-amber-500/90 text-white font-semibold rounded-lg',
                    label: 'text-slate-300 cursor-pointer',
                    allowedContent: 'text-slate-500',
                  }}
                  onClientUploadComplete={(res) => {
                    if (res[0].ufsUrl) {
                      // delete old existing image
                      if (plant.plantImageUrl) {
                        const oldKey = plant.plantImageUrl.split('/').pop()
                        if (oldKey) {
                          setImagesToDelete((prev) => [...prev, oldKey])
                        }
                      }
                      setCurrentImageUrl(res[0].ufsUrl)
                      toast.success('Image ready - save edits to apply.')
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}.`)
                  }}
                />
              )}
            </div>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Update Plant"
                  className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 min-w-25 px-4 font-semibold"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
