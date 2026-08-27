import { Search, XIcon } from 'lucide-react'
import { panelStyles } from '@/lib/panelStyles'

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
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div className={panelStyles.backdrop} onClick={closeModal} />
        <div
          className={`relative w-full z-[60] max-w-4xl max-h-[85dvh] overflow-y-auto p-6 ${panelStyles.container}`}
        >
          <div className="flex items-center justify-between mb-6">Media</div>
          <button
            className="cursor-pointer font-bold text-gray-400 hover:text-white text-2xl"
            onClick={closeModal}
          >
            <XIcon />
          </button>
        </div>
        {/** Search */}
        <div className="p-4 border-b border-slate-800">
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
        {isOpen && <div>Open</div>}
      </div>
    </>
  )
}
