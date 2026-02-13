import { useEffect, useRef } from 'react'
import useTerminal from './useTerminal'

export default function TerminalBody({ username }: { username: string }) {
  const { history, inputValue, setInputValue, currentDir, handleKeyDown } =
    useTerminal(username)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 min-h-[400px] font-mono text-sm cursor-text"
      onClick={handleContainerClick}
    >
      {/** History */}
      {history.map((line) => (
        <div
          key={line.id}
          className={
            line.type === 'input'
              ? 'text-white'
              : line.type === 'error'
                ? 'text-red-400'
                : line.type === 'system'
                  ? 'text-green-400'
                  : 'text-zinc-300'
          }
        >
          {line.content}
        </div>
      ))}
      {/** Active prompt */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-blue-400">{currentDir}</span>
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
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
