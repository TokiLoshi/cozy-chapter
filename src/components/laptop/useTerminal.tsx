import { commands } from '@/db/commands'
import { useCallback, useState } from 'react'

type TerminalLine = {
  id: number
  type: 'input' | 'output' | 'error' | 'system'
  coontent: string | React.ReactNode
}

export default function useTerminal(username: string) {
  const [history, setHistory] =
    useState <
    Array<TerminalLine>([
      { id: 0, type: 'system', content: 'Welcome to CozyOS v1.0.0' },
      {
        id: 1,
        type: 'system',
        content: 'Type "help" to see available commands',
      },
    ])
  const [inputValue, setInputValue] = useState('')
  const [commandHistory, setCommandHistory] = useState<Array<string>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentDir, setCurrentDir] = useState(`~/${username}`)

  const addLine = useCallback(
    (type: TerminalLine['type'], content: string | React.ReactNode) => {
      setHistory((prev) => [...prev, { id: Date.now(), type, content }])
    },
    [],
  )

  const executeCommand = useCallback(
    (rawInput: string) => {
      const trimmed = rawInput.trim()
      if (!trimmed) return

      // Echo thee inputline
      addLine('input', `${currentDir} $ ${trimmed}`)

      // Save the command for up/down
      setCommandHistory((prev) => [trimmed, ...prev])
      setHistoryIndex(-1)

      // Parse command
      const parts = trimmed.split(/\s+/)
      const cmd = parts[0].toLowerCase()
      const args = parts.slice(1)

      // Route to the handler
      switch (cmd) {
        case 'help':
          handleHelp()
          break
        case 'clear':
          setHistory([])
          break
        case 'pwd':
          addLine('output', currentDir)
          break
        case 'sudo':
          handleSudo([cmd])
          break
        case 'movies':
          addLine('output', 'Movies coming soon')
          console.log('Movies coming soon...')
          break
        case 'youtube':
          addLine('output', 'YouTube coming soon')
          console.log('YouTube coming soon')
          break
        case 'chat':
          addLine('output', 'Chat coming soon')
          console.log('Chat coming soon')
          break
        case 'gui':
          addLine('system', 'Switching to desktop mode...')
          console.log('GUI not implemented yet')
          break
        default:
          if (commands.some((c) => c.action === cmd)) {
            addLine('output', `${cmd} ${args} not implemented`)
          } else {
            addLine('error', `zsh: command not found: ${cmd}`)
          }
      }
      setInputValue('')
    },
    [currentDir, addLine],
  )
  const handleHelp = useCallback(() => {
    console.log('HELP echoed from your terminal!')
    const appCommands = commands.filter((c) => c.category === 'app')
    const systemCommands = commands.filter((c) => c.category === 'system')
    const terminalCommands = commands.filter((c) => c.category === 'terminal')
    addLine(
      'output',
      <>
        <div className="py-2 space-y-3">
          <div>
            <span className="text-yellow-400 font-bold">⚡️ Applications</span>
            {appCommands.map((c) => (
              <div key={c.action} className="ml-2">
                <span className="text-cyan-400">{c.action.padEnd(12)}</span>
                <span className="text-zinc-400">{c.description}</span>
              </div>
            ))}
          </div>
          <div>
            <span className="text-yellow-400 font-bold">🔧 System</span>
            {systemCommands.map((s) => (
              <div key={s.action} className="ml-2">
                <span className="text-cyan-400">{s.action.padEnd(12)}</span>
                <span className="text-zinc-400">{s.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-yellow-400 font-bold"> 💻 Terminal</span>
          {terminalCommands.map((t) => (
            <div key={t.action} className="ml-2">
              <span className="text-cyan-400">{t.action.padEnd(12)}</span>
              <span className="text-zinc-400">{t.description}</span>
            </div>
          ))}
        </div>
      </>,
    )
  }, [addLine])

  const handleSudo = useCallback(
    (args: Array<string>) => {
      console.log('SUDO invoked, chaos will reign', args)
      if (args.join(' ').toLowerCase() === 'make me a sandwhich') {
        addLine('output', '🥙 how about a salad instead?')
      } else {
        addLine('error', `Password: nice try, ${username}`)
      }
    },
    [username, addLine],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        console.log('Enter pressed')
        executeCommand(inputValue)
      } else if (e.key === 'ArrowUp') {
        if (commandHistory.length > 0) {
          const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
          setHistoryIndex(newIndex)
          setInputValue(commandHistory[newIndex])
        }
        console.log('Arrow up pushed')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1
          setHistoryIndex(newIndex)
          setInputValue(commandHistory[newIndex])
        } else {
          setHistory(-1)
          setInputValue('')
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        const matches = commands
          .map((c) => c.action)
          .filter((a) => a.startsWith(inputValue.toLowerCase()))
        if (matches.length === 1) {
          setInputValue(matches[0])
        }
      }
    },
    [inputValue, commandHistory, historyIndex, executeCommand, addLine],
  )
}
