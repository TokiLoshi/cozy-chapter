// TODO: this probably needs to be abstracted so podcasts, books, and audiobooks can use it
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Edit, Star, Trash, XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type BaseModalProps = {
  onClose: () => void
  children: ReactNode
}

type DetailItemProps = {
  label: string
  children: ReactNode
}

type StarRatingProps = {
  rating: number
  maxStars?: number
}

type ActionsProps = {
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function DisplayDescription({ description }: { description: string }) {
  return (
    <div className="mb-2">
      <p className="text-xs text-slate-400 mb-1">Description</p>
      <ScrollArea className="max-h-[120px] mb-2">
        <p className="text-sm mb-3 font-medium text-slate-300 pr-3">
          {description}
        </p>
        <div className="p-2" />
      </ScrollArea>
    </div>
  )
}

export function DisplayActions({ onClose, onEdit, onDelete }: ActionsProps) {
  return (
    <>
      <div className="flex gap-3 pt-4 m-2 border-t border-slate-700">
        <button
          onClick={() => {
            onEdit()
            onClose()
          }}
          className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            onDelete()
            onClose()
          }}
          className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </>
  )
}

export function DisplayStarRating({ rating, maxStars = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export function DetailItem({ label, children }: DetailItemProps) {
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {children}
    </div>
  )
}

export function BaseModal({ onClose, children }: BaseModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative mb-2 z-10 w-full max-w-md max-h-[150] overflow-y-auto bg-slate-800 rounded-xl shadow-2xl border border-slate-600 m-4 p-6">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <XIcon className="w-4 h-4" />
          </button>
          {children}
        </div>
      </div>
    </>
  )
}
