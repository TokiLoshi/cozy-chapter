import { XIcon } from 'lucide-react'
import { useState } from 'react'

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

type TerminalLine = {
  id: number
  type: 'input' | 'output' | 'error' | 'system'
  coontent: string | React.ReactNode
}

type Command = {
  action: string
  description: string
  category: 'app' | 'terminal' | 'system'
}

const commands: Array<Command> = [
  // Apps
  {
    action: 'movies',
    description: 'Launch the movie & series tracker',
    category: 'app',
  },
  {
    action: 'courses',
    description: 'Launch the course tracker',
    category: 'app',
  },
  {
    action: 'youtube',
    description: 'Launch podcast & playlist tracker',
    category: 'app',
  },
  { action: 'chat', description: 'Launch a chat with Claude', category: 'app' },
  {
    action: 'cd',
    description:
      'Change directory eg ```cd Documents``` use ```cd ..``` to go one level up and ```cd ~``` to go to the home directory.',
    category: 'terminal',
  },
  { action: 'gui', description: 'Switch to desktop mode', category: 'app' },
  // System
  {
    action: 'help',
    description: 'Display all possible commands.',
    category: 'system',
  },
  { action: 'clear', description: 'clear the terminal', category: 'system' },
  {
    action: 'neofetc',
    description: 'Display system info and stats',
    category: 'system',
  },
  {
    action: 'cat',
    description: 'print the contents of a file.',
    category: 'terminal',
  },
  {
    action: 'mkdir',
    description: "Create a new directory. Note these won't be permanent.",
    category: 'terminal',
  },
  {
    action: 'touch',
    description:
      "Create a new file. Note these won't persist after your session.",
    category: 'terminal',
  },
  {
    action: 'ls',
    description: 'List files in the directory.',
    category: 'terminal',
  },
  {
    action: 'ls -l',
    description: 'Long list the files in the directory.',
    category: 'terminal',
  },
  {
    action: 'ls -a',
    description: 'Long list of files in the directory including hidden files.',
    category: 'terminal',
  },
  {
    action: 'ls -lh',
    description: 'Long list of files with human readable file sizes',
    category: 'terminal',
  },
  {
    action: 'ls -R',
    description: 'Long listing of Human readable file sizes',
    category: 'terminal',
  },
  {
    action: 'pwd',
    description: 'Print working directory',
    category: 'terminal',
  },
  { action: 'cp', description: 'Copy a File', category: 'terminal' },
  { action: 'mv', description: 'Rename a file', category: 'terminal' },
  { action: 'rm', description: 'Delete a file', category: 'terminal' },
  {
    action: 'rm -rf',
    description:
      'Recursively delete the files in a folder. This should be done with caution and might cause KABOOMs.',
    category: 'terminal',
  },
  {
    action: 'man',
    description: 'Show the manual for a command',
    category: 'terminal',
  },
  {
    action: 'sudo',
    description:
      'Run the command with the security priveleges of the super user. This might also cause chaos.',
    category: 'terminal',
  },

  { action: 'open', description: 'open the files', category: 'terminal' },
  {
    action: 'top',
    description: 'Displays active process. Press q to quit',
    category: 'terminal',
  },
  {
    action: 'nano',
    description: 'Opens the nano editor',
    category: 'terminal',
  },
  { action: 'vim', description: 'Opens the ', category: 'terminal' },
  // Easter Egg Ideas
  // Sudo make me a sandwich
]

export function TerminalTitleBar({
  title,
  onClose,
  onToggleGUI,
}: TerminalTitleBarProps) {
  return (
    <>
      <div className="flex items-center h-9 bg-zinc-800 rounded-t-xl px-3 select-none border-zinc-700">
        <div className="flex items-center gap-2 group">
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
      </div>
    </>
  )
}

const CommandPrompt = ({ folder }: { folder: string }) => {
  return (
    <>
      <div className="bg-blue-600 text-white font-mono px-2 py-0.5 text-sm">
        {folder}
      </div>
      <input
        type="text"
        autoFocus
        className="w-full bg-transparent text-white font-mono text-sm outline-none border-none caret-white mt-1"
      />
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
                <p className="text-green-500 font-mono text-sm mb-2">
                  more stuff to go here
                </p>
                <CommandPrompt folder={folder} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
