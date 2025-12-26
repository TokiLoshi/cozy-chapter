// import { useNavigate } from '@tanstack/react-router'
// import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import type { AudioBook } from '@/lib/types/AudioBook'
import { useAppForm } from '@/hooks/form'

// TODO Wire up server side logic

export default function EditAudioBookModal({
  audioBook,
  refreshPath,
  onClose,
}: {
  audioBook: AudioBook
  refreshPath: string
  onClose: () => void
}) {
  console.log('Audio book: ', audioBook)
  console.log('Refresh path: ', refreshPath)

  // const navigate = useNavigate()
  const form = useAppForm({
    // TODO wire up server side values and types here
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
        <div className="relative w-full max-w-2xl max-h-[90h] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-700/50 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Edit Audiobook
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your audibook here
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
          ></form>
        </div>
      </div>
    </>
  )
}
