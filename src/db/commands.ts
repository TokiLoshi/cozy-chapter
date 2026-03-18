type Command = {
  action: string
  description: string
  category: 'app' | 'terminal' | 'system'
}

export const commands: Array<Command> = [
  // Apps
  {
    action: 'movies',
    description: 'Browse and track movies on your watch list',
    category: 'app',
  },
  {
    action: 'series',
    description: 'Track your series',
    category: 'app',
  },
  {
    action: 'courses',
    description: 'Launch the course tracker.',
    category: 'app',
  },
  {
    action: 'podcasts',
    description: 'Launch podcasts from Spotify or YouTube',
    category: 'app',
  },
  // System
  {
    action: 'help',
    description: 'Display all possible commands.',
    category: 'system',
  },
  { action: 'clear', description: 'Clear the terminal.', category: 'system' },
  {
    action: 'neofetch',
    description: 'Display system info and stats.',
    category: 'system',
  },
  {
    action: 'pwd',
    description: 'Print working directory.',
    category: 'terminal',
  },
  {
    action: 'rm -rf',
    description:
      'Recursively delete the files in a folder. This should be done with caution and might cause KABOOMs.',
    category: 'terminal',
  },
  {
    action: 'sudo',
    description:
      'Run the command with the security privileges of the super user. This might also cause chaos...',
    category: 'terminal',
  },
  {
    action: 'touch grass',
    description: 'Step away from the keyboard.',
    category: 'system',
  },
  {
    action: 'whoami',
    description: 'returns username',
    category: 'system',
  },
  {
    action: 'echo',
    description: 'echoes your thoughts',
    category: 'system',
  },
  {
    action: 'date',
    description: 'tells you the date and time',
    category: 'system',
  },
  {
    action: 'history',
    description: 'prints command history',
    category: 'system',
  },
]
