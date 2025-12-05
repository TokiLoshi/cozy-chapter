import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { Edit, XIcon } from 'lucide-react'
import type { Plant } from '@/lib/types/Plant'
import { useAppForm } from '@/hooks/form'
import { updatePlantServer } from '@/lib/server/plants'

export default function EditPlantModal({
  plant,
  refreshPath,
}: {
  plant: Plant
  refreshPath: string
}) {
  const [open, setOpen] = useState(false)
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
      try {
        await updatePlantServer({
          data: plant.id,
          updates: value,
        })
        navigate({ to: refreshPath })
        setOpen(false)
      } catch (error) {
        console.log('Uh oh spaghetti os, something went wrong', error)
      }
    },
  })
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer px-8 py-3 bg-indigo-800/90 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg items-center justify-center gap-2"
      >
        <Edit className="w-4 h-4" />
        <span className="text-sm">Edit</span>
      </button>
      {open && (
        <div className="fixed-inset-0 z-50 flex-items-center justify-center">
          {/** Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            {/** Modal */}
          </div>
        </div>
      )}
    </>
  )
}
