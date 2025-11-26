// import { createFileRoute, redirect } from '@tanstack/react-router'
// import { createServerFn } from '@tanstack/react-start'
import { XIcon } from 'lucide-react'
// import { z } from 'zod'
// import { createInsertSchema } from 'drizzle-zod'
// import { getRequest } from '@tanstack/react-start/server'
// import { auth } from '../lib/auth'
// import type { Plant } from '@/lib/types/Plant'
// import { useAppForm } from '@/hooks/form'

// import { waterOrchids, getLastWatered } from "@/db/queries/orchids"
// import { orchidType } from "@/db/article-schema"
// import { getSessionServer } from '@/lib/utils'

// TODO:
// Create Orchid Schema
// Create CRUD Operations
// Create Modal

type PlantFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

export default function ArticleForm({ isOpen, onClose }: PlantFormProps) {
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
            <div className="flex-items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Water your plants
                </h2>
                <p>Here is the status report</p>
              </div>
              <button
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
                onClick={onClose}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <p>Stuff about plants goes here</p>
        </div>
      </div>
    </>
  )
}
