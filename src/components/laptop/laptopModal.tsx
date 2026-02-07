import { XIcon } from 'lucide-react'

type LaptopModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function LaptopModal({ isOpen, onClose }: LaptopModalProps) {
  const closeModal = () => {
    {
      onClose()
    }
  }

  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Laptop Interface to go here
            </h2>
            <button
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              <XIcon />
            </button>
          </div>
          <p className="text-white">More stuff to go here</p>
        </div>
      </div>
    </>
  )
}
