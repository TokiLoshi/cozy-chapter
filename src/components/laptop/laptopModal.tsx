import { useState } from 'react'
import TerminalBody from './terminalBody'

type LaptopModalProps = {
  isOpen: boolean
  username: string
  onClose: () => void
}

type TerminalTitleBarProps = {
  title: string
  onClose: () => void
  onToggleGUI: () => void
}

export function TerminalTitleBar({
  title,
  onClose,
  onToggleGUI,
}: TerminalTitleBarProps) {
  return (
    <>
      <div className="flex items-center h-9 bg-zinc-800 rounded-t-xl px-3 select-none border-zinc-700">
        {/** Traffic lights */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <span className="text-[8px] text-red-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              x
            </span>
          </button>
          <button
            className="w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
            aria-label="Minimize"
          >
            <span className="text-[8px] text-yellow-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              -
            </span>
          </button>
          <button
            onClick={onToggleGUI}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center cursor-pointer"
            aria-label="Toggle GUI mode"
          >
            <span className="text-[8px] text-green-900 opacity-0 group-hover:opacity-100 font-bold leading-none">
              ↗
            </span>
          </button>
        </div>
        {/** Centered Title */}
        <div className="flex-1 text-center">
          <span className="text-zinc-400 text-sm font-mono">📁 {title} </span>
        </div>
        {/** Spacer to balance traffic lights */}
        <div className="w-14" />
      </div>
    </>
  )
}

export default function LaptopModal({
  isOpen,
  onClose,
  username,
}: LaptopModalProps) {
  const [folder, setFolder] = useState(`~/${username}/`)
  const [isGUI, setIsGUI] = useState(false)

  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative z-60 w-full max-w-4xl max-h-[80vh] overflow-hidden bg-black rounded-xl shadow-2xl border border-zinc-700 m-4 flex flex-col">
          {/** Title Bar */}
          <TerminalTitleBar
            title={`${username}/~~/${username}/-zsh`}
            onClose={onClose}
            onToggleGUI={() => setIsGUI(!isGUI)}
          />

          {/** Terminal body */}
          <div className="flex-1 overflow-y-auto p-4 min-h-[400px]">
            {isGUI ? (
              <div className="text-white font-mono text-sm">
                {/** GUI mode placeholder */}
                <p className="text-zinc-500">GUI mode coming soon</p>
              </div>
            ) : (
              <>
                <TerminalBody username={username} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
