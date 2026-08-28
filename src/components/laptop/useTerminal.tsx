import { useEffect, useRef, useState } from 'react'
import { commands } from '@/db/commands'

type TerminalLine = {
  id: number
  type: 'input' | 'output' | 'error' | 'system'
  content: string | React.ReactNode
}

export default function useTerminal(
  username: string,
  onLaunchApp: (app: string | null) => void,
  selfDestruct = false,
) {
  const [history, setHistory] = useState<Array<TerminalLine>>([
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
  const [currentDir] = useState(`~/${username}`)
  const lineIdRef = useRef(2)

  useEffect(() => {
    if (!selfDestruct) return
    const script: Array<[number, TerminalLine['type'], string]> = [
      [500, 'input', `~/${username} $ sudo rm -rf /cozyroom`],
      [1200, 'system', 'Password accepted. This time, you have root access.'],
      [1800, 'error', 'Erasing cozy room...'],
      [2400, 'output', '5.....'],
      [3000, 'output', '4....'],
      [3600, 'output', '3...'],
      [4200, 'output', '2..'],
      [4800, 'output', '1.'],
      [
        5400,
        'output',
        'CozyRoom has been erased. Thank you for visiting. Goodbye 👋',
      ],
    ]
    const timers = script.map(([ms, type, content]) =>
      setTimeout(() => addLine(type, content), ms),
    )
    return () => timers.forEach(clearTimeout)
  }, [selfDestruct])

  const addLine = (
    type: TerminalLine['type'],
    content: string | React.ReactNode,
  ) => {
    setHistory((prev) => [...prev, { id: lineIdRef.current++, type, content }])
  }

  const executeCommand = (rawInput: string) => {
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

    // Neofetch
    const handleNeofetch = () => {
      const specs = [
        ['user', username],
        ['os', 'CozyOS v1.0.0'],
        ['shell', 'cozy-zsh'],
        ['terminal', 'CozyTerm'],
        [
          'apps',
          'movies, series, podcasts, courses, books, articles, audiobooks, plants',
        ],
        ['uptime', 'Good vibes only'],
        ['chaos ratio', 'Perfection 🔥'],
      ]
      addLine(
        'output',
        <div className="flex-wrap gap-6 py-2 min-w-0">
          <pre className="text-amber-400 text-xs leading-tight">
            {`╔═══════════╗
║  ☕ cozy   ║
║    OS     ║
╚═══════════╝`}
          </pre>
          <div className="space-y-1 text-sm">
            {specs.map(([label, value]) => (
              <div key={label}>
                <span className="text-amber-400">{label}</span>{' '}
                <span className="text-slate-400">{value}</span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex gap-1">
            {[
              'bg-slate-600',
              'bg-slate-500',
              'bg-slate-400',
              'bg-amber-300',
              'bg-amber-400',
              'bg-amber-500',
              'bg-amber-600',
            ].map((c) => (
              <span key={c} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
        </div>,
      )
    }

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
      case 'echo':
        addLine('output', args.join(' '))
        break
      case 'sudo':
        handleSudo(args)
        break
      case 'movies':
        addLine('system', 'Launching movies')
        onLaunchApp('movies')
        break
      case 'series':
        addLine('system', 'Launching series')
        onLaunchApp('series')
        break
      case 'courses':
        addLine('system', 'Launching courses')
        onLaunchApp('courses')
        break
      case 'whoami':
        addLine('system', username)
        break
      case 'podcasts':
        addLine('system', 'Launching podcasts...')
        onLaunchApp('podcasts')
        break
      case 'cd':
        // setCurrentDir('')
        addLine('output', `cd: this room is cozy enough`)
        break
      case 'date': {
        const today = new Date()
        addLine('output', today.toLocaleString())
        break
      }
      case 'rm':
        if (args.join() === '-rf') {
          addLine(
            'output',
            "That's a bad idea. I'm not going to do that. You can try sudo though",
          )
        }
        break
      case 'history':
        addLine(
          'output',
          <div>
            {commandHistory
              .slice()
              .reverse()
              .map((command, i) => (
                <div key={i} className="text-zinc-300">
                  <span className="text-zinc-500 mr-3">{i + 1}</span>
                  {command}
                </div>
              ))}
          </div>,
        )
        break
      case 'neofetch':
        handleNeofetch()
        break
      // Easter eggs
      case 'tough':
        if (args.join() === 'love') {
          addLine('system', "you're not working hard enough")
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'play':
        if (args.join(' ') === 'that shit fred') {
          addLine('system', 'I need you to see me, we danced so, sooo hard')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'touch':
        if (args.join() === 'grass') {
          addLine('system', "You've had enough screen time. Please go away...")
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'f*ck':
        if (
          args.join(' ') === 'the neighbours' ||
          args.join(' ') === 'the neighbors'
        ) {
          addLine('system', 'TURN THE MUSIC UP')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'fuck':
        if (
          args.join(' ') === 'the neighbours' ||
          args.join(' ') === 'the neighbors'
        ) {
          addLine('system', 'TURN THE MUSIC UP')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'feel':
        if (args.join(' ') === 'it in my blood') {
          addLine('system', 'AND THE LIGHTS BURN DIMMER')
          addLine('system', 'AND THE LIGHTS BURN DIMMER')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'if':
        if (args.join(' ') === "you don't know") {
          addLine('system', "DON'T WORRY")
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'hey,':
        if (args.join(' ') === 'yo, listen you hear that') {
          addLine('system', 'KILLERS IN THE JUNGLE')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      default:
        if (commands.some((c) => c.action === cmd)) {
          addLine('output', `${cmd} ${args} not implemented`)
        } else {
          addLine('error', `zsh: command not found: ${cmd}`)
        }
    }
    setInputValue('')
  }

  const handleHelp = () => {
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
  }

  const [sandwichCount, setSandwichCount] = useState(0)

  const handleSudo = (args: Array<string>) => {
    const userInput = args.join(' ').toLowerCase()
    switch (userInput) {
      case 'make me a sandwich':
        setSandwichCount((prev) => prev + 1)
        switch (sandwichCount) {
          case 0:
            addLine('output', '🥙 how about a salad instead?')
            break
          case 1:
            addLine(
              'output',
              "🥗 are you sure you don't want a nice crunchy salad?",
            )
            break
          case 2:
            addLine('output', 'Fine, you win. Here is your sanwich 🥪')
            break
          case 3:
            addLine(
              'output',
              'You already got your sandwich, what more do you want?',
            )
            break
          case 4:
            addLine('output', 'KABOOM 💥')
            setSandwichCount(0)
        }
        break
      case 'rm -rf':
        addLine('error', 'Nice try! The cozy room remains intact.')

        break
      case '':
        addLine('error', 'sudo: a command is required')
        break
      default:
        addLine(
          'error',
          `Password required. Nice try, ${username}. You don't have root access.`,
        )
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInputValue(commandHistory[newIndex])
      } else {
        setHistoryIndex(-1)
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
  }

  return {
    history,
    inputValue,
    setInputValue,
    currentDir,
    handleKeyDown,
  }
}
