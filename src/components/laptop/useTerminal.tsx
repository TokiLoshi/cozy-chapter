import { useRef, useState } from 'react'
import { commands } from '@/db/commands'

type TerminalLine = {
  id: number
  type: 'input' | 'output' | 'error' | 'system'
  content: string | React.ReactNode
}

export default function useTerminal(
  username: string,
  onLaunchApp: (app: string | null) => void,
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
  const [currentDir, setCurrentDir] = useState(`~/${username}`)
  const lineIdRef = useRef(2)

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
      addLine(
        'output',
        <div className="flex gap-6 py-2">
          <pre className="text-amber-400 text-xs leading-tight">
            {`╔═══════════╗
║  ☕ cozy   ║
║    OS     ║
╚═══════════╝`}
          </pre>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-cyan-400">user</span>{' '}
              <span className="text-zinc-400">{username}</span>{' '}
            </div>
            <div>
              <span className="text-cyan-400">os</span>{' '}
              <span className="text-zinc-400"> CozyOs v1.0.0</span>
            </div>
            <div>
              <span className="text-cyan-400">shell</span>{' '}
              <span className="text-zinc-400"> cozy-zsh</span>
            </div>
            <div>
              <span className="text-cyan-400">terminal</span>{' '}
              <span className="text-zinc-400"> CozyTerm</span>
            </div>
            <div>
              <span className="text-cyan-400">apps</span>{' '}
              <span className="text-zinc-400">
                movies, series, podcasts, courses
              </span>
            </div>
            <div>
              <span className="text-cyan-400">uptime</span>{' '}
              <span className="text-zinc-400"> Good vibes only</span>
            </div>
            <div>
              <span className="text-cyan-400">chaos ratio</span>{' '}
              <span className="text-zinc-400"> Perfection 🔥</span>
            </div>
            <div className="pt-1 flex gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-sm" />{' '}
              <span className="w-3 h-3 bg-amber-500 rounded-sm" />
              <span className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="w-3 h-3 bg-green-500 rounded-sm" />
              <span className="w-3 h-3 bg-cyan-500 rounded-sm" />
              <span className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="w-3 h-3 bg-purple-500 rounded-sm" />
            </div>
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
      case 'whoami':
        addLine('system', username)
        break
      // Easter eggs
      case 'youtube':
        addLine('system', 'Launching movies...')
        break
      case 'podcasts':
        addLine('system', 'Launching podcasts...')
        onLaunchApp('podcasts')
        break
      case 'cd':
        setCurrentDir('placeholder')
        addLine('output', `cd ${args}`)
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
        if (args.join() === 'that shit fred') {
          addLine('system', 'I need you to see me, we danced so,, sooo hard')
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
          args.join() === 'the neighbours' ||
          args.join() === 'the neighbors'
        ) {
          addLine('system', 'TURN THE MUSIC UP')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'feel':
        if (args.join() === 'it in my blood') {
          addLine('system', 'AND THE LIGHTS BURN DIMMER')
          addLine('system', 'AND THE LIGHTS BURN DIMMER')
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'if':
        if (args.join() === "you don't know") {
          addLine('system', "Don't worry!")
        } else {
          addLine('error', `zsh: command not found: ${args.join()}`)
        }
        break
      case 'hey':
        if (args.join() === 'listen you hear that') {
          addLine('system', 'killers in the jungle')
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
    console.log('SUDO invoked, chaos will reign')
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
      case 'rm -rf /':
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
      console.log('Enter pressed')
      executeCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
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
