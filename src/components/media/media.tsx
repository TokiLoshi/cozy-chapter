import { Search, XIcon } from 'lucide-react'

type MediaModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function MediaModal({ isOpen, onClose }: MediaModalProps) {
  const closeModal = () => {
    onClose()
  }
  return (
    <>
      <div className="fixed inset-0 z-[50] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        <div className="relative w-full z-[60] max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">Media</div>
          <button
            className="cursor-pointer text-gray-400 hover:text-white text-2xl"
            onClick={closeModal}
          >
            <XIcon />
          </button>
        </div>
        {/** Search */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search for media"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        </div>
        {/** Content */}
        <div className="flex-1 overflow-y-auto p-4">Media Stuff goes here</div>
      </div>
    </>
  )
}
