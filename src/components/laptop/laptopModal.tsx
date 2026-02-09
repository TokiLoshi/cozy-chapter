import { XIcon } from 'lucide-react'
import { useState } from 'react'

type LaptopModalProps = {
  isOpen: boolean
  username: string
  onClose: () => void
}

const CommandPrompt = ({ folder }: { folder: string }) => {
  return (
    <>
      <div className="bg-blue-600 text-white">{folder}</div>
      <input type="text" value="|" />
    </>
  )
}

export default function LaptopModal({
  isOpen,
  onClose,
  username,
}: LaptopModalProps) {
  const [folder, setFolder] = useState(`~/${username}/`)
  const closeModal = () => {
    {
      onClose()
    }
  }

  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-50 flex font-mono items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-black rounded-xl shadow-xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6 bg-zinc-800 ">
            <h2 className="text-3xl font-bold text-white">📁 {folder}-zsh</h2>
            <button
              className="cursor-pointer text-gray-400 hover:text-white text-2xl"
              onClick={closeModal}
            >
              <XIcon />
            </button>
          </div>
          <p className="text-green-500 ">More stuff to go here</p>
          <CommandPrompt folder={folder} />
        </div>
      </div>
    </>
  )
}
