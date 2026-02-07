import { Edit, LeafIcon, Trash, XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
} from '../ExpandedCard'
import SearchArea from '../SearchArea'
import EditPlantModal from './EditPlantModal'
import type { Plant } from '@/lib/types/Plant'
import {
  createPlantServer,
  deletePlantServer,
  deleteUploadedImageServer,
  getUserPlants,
} from '@/lib/server/plants'
import { useAppForm } from '@/hooks/form'
import { UploadDropzone } from '@/lib/uploadthing'

// Types
type PlantFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

type ExpandedPlantCardProps = {
  item: Plant
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

const getHealthColor = (health: Plant['plantHealth']) => {
  switch (health) {
    case 'thriving':
      return 'text-green-500'
    case 'ok':
      return 'text-yellow-500'
    case 'needsAttention':
      return 'text-rose-400'
  }
}

const checkWaterNeeds = (
  lastWatered: Date | null,
  recommendedWatering: Plant['recommendedWateringIntervalDays'],
) => {
  if (!lastWatered || !recommendedWatering) return false

  const today = new Date()
  const lastDate = new Date(lastWatered)
  const minutesSince = today.getTime() - lastDate.getTime()
  const daysSince = Math.floor(minutesSince / (1000 * 60 * 60 * 24))

  return daysSince > recommendedWatering
}

function ExpandedPlantCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: ExpandedPlantCardProps) {
  return (
    <>
      <BaseModal onClose={onClose}>
        {/** Header */}
        {/** Full image */}
        {item.plantImageUrl && (
          <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
            <img
              src={item.plantImageUrl}
              alt={item.species}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <div className="flex gap-4 mb-4">
          {/** Cover image */}
          {!item.plantImageUrl && (
            <LeafIcon className="w-16 h-16 object-cover rounded text-white" />
          )}
          {/** name */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-100 mb-1">
              {item.name ?? item.species}
            </h3>
            {checkWaterNeeds(
              item.lastWatered,
              item.recommendedWateringIntervalDays,
            ) && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mt-1">
                💧 Needs watering
              </span>
            )}

            {/** group */}
            {item.group && (
              <p className="text-sm mt-2 text-slate-400">{item.group}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/** last watered */}
          <DetailItem label="Last Watered">
            <p className="text-sm font-medium text-slate-200">
              {item.lastWatered
                ? item.lastWatered.toLocaleDateString()
                : 'data not available'}
            </p>
          </DetailItem>
          {/** recommendedWateringIntervalDays */}
          <DetailItem label="Recommended Watering Interval">
            <p className="text-sm font-medium text-slate-200">
              {item.recommendedWateringIntervalDays
                ? item.recommendedWateringIntervalDays
                : 'data not available'}
            </p>
          </DetailItem>
          {/** Plant health */}
          <DetailItem label="Plant Health">
            <p
              className={`${getHealthColor(item.plantHealth)} text-sm font-medium`}
            >
              {item.plantHealth}
            </p>
          </DetailItem>
        </div>
        {/** Actions */}
        <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

        {/** Notes */}
        {item.notes && <DisplayDescription description={item.notes} />}
      </BaseModal>
    </>
  )
}

function PlantCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Plant
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {item.plantImageUrl ? (
          <img
            src={item.plantImageUrl}
            alt={item.name ?? 'plant image name unkown'}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-slate-600/50 rounded">
            <LeafIcon
              className={`${getHealthColor(item.plantHealth)} text-xs`}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-100 truncate">
            {item.name ?? item.species}
          </h4>
          {checkWaterNeeds(
            item.lastWatered,
            item.recommendedWateringIntervalDays,
          ) && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full mt-1">
              💧 Needs watering
            </span>
          )}

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-300">
              Last watered:{' '}
              {item.lastWatered
                ? new Date(item.lastWatered).toLocaleDateString()
                : 'unknown'}
            </span>
            <span className={`${getHealthColor(item.plantHealth)} text-xs`}>
              {item.plantHealth}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={(e) => {
              // Prevents the expanded modal from opening
              e.stopPropagation()
              onEdit()
            }}
            className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transitioon-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyTabContent({ message }: { message: string }) {
  return <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
}

export default function PlantModal({
  isOpen,
  onClose,
  refreshPath,
  // userId,
}: PlantFormProps) {
  const [isAddFormOpen, setisAddFormOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [plantToEdit, setPlantToEdit] = useState<Plant | null>(null)
  const [plantSearch, setPlantSearch] = useState('')
  const [expandedPlant, setExpandedPlant] = useState<Plant | null>(null)
  const queryClient = useQueryClient()

  const { data: userPlants } = useQuery({
    queryKey: ['user-plants'],
    queryFn: async () => {
      const result = await getUserPlants()
      return result ?? []
    },
  })

  const closeModal = () => {
    onClose()
  }

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      deletePlantServer({
        data: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-plants'] })
      toast.success('Plant removed from your library')
    },
    onError: () => {
      toast.error('Failed to remove plant')
    },
  })

  const handleDelete = (id: string) => {
    toast('Are you sure you want to remove this plant', {
      action: {
        label: 'Remove',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'cancel',
        onClick: () => {},
      },
    })
  }

  const handleEdit = (item: Plant) => {
    setExpandedPlant(null)
    setPlantToEdit(item)
    setIsEditOpen(true)
  }

  const handleCardClick = (item: Plant) => {
    setExpandedPlant(item)
  }

  // Search filter
  const filteredPlants = useMemo(() => {
    if (!userPlants) return []

    if (!plantSearch.trim()) return userPlants

    const searchTerm = plantSearch.toLowerCase()

    return userPlants.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(searchTerm)
      const speciesMatch = item.species.toLowerCase().includes(searchTerm)
      return nameMatch || speciesMatch
    })
  }, [userPlants, plantSearch])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        {/** Edit modal */}
        {isEditOpen && plantToEdit && (
          <EditPlantModal
            plant={plantToEdit}
            refreshPath="/readingroom"
            onClose={() => {
              setIsEditOpen(false)
              setPlantToEdit(null)
            }}
          />
        )}
        {/** Expanded Card */}
        {expandedPlant && (
          <ExpandedPlantCard
            item={expandedPlant}
            onEdit={() => handleEdit(expandedPlant)}
            onDelete={() => handleDelete(expandedPlant.id)}
            onClose={() => setExpandedPlant(null)}
          />
        )}
        {/** Modal */}
        {!isEditOpen && (
          <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border-slate-700 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Plants</h2>
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
            {/** Plant Form */}
            <PlantForm
              isOpen={isAddFormOpen}
              onClose={() => setisAddFormOpen(false)}
              refreshPath={refreshPath}
            />
            {/** Search */}
            <div className="pt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                Who needs watering today?
              </h3>
              {/** Empty State */}
              {filteredPlants.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No plants added to inventory yet
                </div>
              )}
              <SearchArea value={plantSearch} onChange={setPlantSearch} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredPlants.length === 0 && plantSearch ? (
                <EmptyTabContent message="No plants match your search" />
              ) : (
                filteredPlants.map((item: Plant) => (
                  <div
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  >
                    <PlantCard
                      item={item}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function PlantForm({ isOpen, onClose, refreshPath }: PlantFormProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const queryClient = useQueryClient()
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
            plantImageUrl: uploadedImageUrl,
          },
        })
        queryClient.invalidateQueries({ queryKey: ['user-plants'] })
        toast.success('Plant added successfully! 🌱', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
        navigate({ to: refreshPath })
      } catch (error) {
        console.error('Something went wrong ', error)
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
                  label="Recommended days between waterings"
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Plant Photo
              </label>
              {uploadedImageUrl ? (
                <div className="relative w-24 h-24">
                  <img
                    src={uploadedImageUrl}
                    alt="Plant preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const fileKey = uploadedImageUrl.split('/').pop()
                        if (fileKey) {
                          await deleteUploadedImageServer({
                            data: fileKey,
                          })
                        }
                        setUploadedImageUrl(null)
                      } catch (error) {
                        console.error('Delete failed: ', error)
                      }
                    }}
                  >
                    <XIcon className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res[0].ufsUrl) {
                      setUploadedImageUrl(res[0].ufsUrl)
                    }
                    toast.success('image added')
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Upload failed: ${error.message}`)
                  }}
                />
              )}
            </div>

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
