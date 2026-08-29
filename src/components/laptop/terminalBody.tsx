import { useEffect, useRef } from 'react'
import { useWindowStore } from '../ui/windowStore'
import useTerminal from './useTerminal'
import type { ReadStatus } from '@/lib/types/Blog'

export default function TerminalBody({
  username,
  onLaunchApp,
}: {
  username: string
  onLaunchApp: (app: { name: string; status?: ReadStatus } | null) => void
}) {
  const { selfDestruct } = useWindowStore()
  const { history, inputValue, setInputValue, currentDir, handleKeyDown } =
    useTerminal(username, onLaunchApp, selfDestruct)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const lineStyles = {
    input: 'text-slate-100',
    error: 'text-red-300',
    system: 'text-emerald-400',
    output: 'text-slate-400',
  } as const

  return (
    <div
      className="flex-1 overflow-y-auto p-4 min-h-[360px] font-mono text-sm cursor-text"
      onClick={handleContainerClick}
    >
      {/** History */}
      {history.map((line) => (
        <div key={line.id} className={lineStyles[line.type]}>
          {line.content}
        </div>
      ))}
      {/** Active prompt */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-amber-400">{currentDir}</span>
        {!selfDestruct && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white outline-none border-none caret-white"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
