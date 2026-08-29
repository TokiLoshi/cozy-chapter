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
  {
    action: 'plants',
    description:
      'Launch your plants dashboard to track their health and determine which ones need watering',
    category: 'app',
  },
  {
    action: 'audiobooks',
    description: 'Launch audiobooks from Spotify',
    category: 'app',
  },
  {
    action: 'reading',
    description:
      'Launch your reading room to pick up on your articles and books',
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
      'Run the command with the security privileges of the super user. This might also cause chaos... For extra chaos you can try asking CozyOS to make you a sandwich.',
    category: 'terminal',
  },
  {
    action: '🎵',
    description:
      'Know some fred again.. lyrics? CozyOS does too. Try out: "If you don\'t know don\'t worry"',
    category: 'terminal',
  },
  {
    action: 'touch grass',
    description: 'Step away from the keyboard.',
    category: 'system',
  },
  {
    action: 'whoami',
    description: 'Returns username',
    category: 'system',
  },
  {
    action: 'echo',
    description: 'Echoes your thoughts',
    category: 'system',
  },
  {
    action: 'date',
    description: 'Tells you the date and time',
    category: 'system',
  },
  {
    action: 'history',
    description: 'Prints command history',
    category: 'system',
  },
]
