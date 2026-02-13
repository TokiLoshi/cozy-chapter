type Command = {
  action: string
  description: string
  category: 'app' | 'terminal' | 'system'
}

export const commands: Array<Command> = [
  // Apps
  {
    action: 'movies',
    description: 'Launch the movie & series tracker.',
    category: 'app',
  },
  {
    action: 'courses',
    description: 'Launch the course tracker.',
    category: 'app',
  },
  {
    action: 'youtube',
    description: 'Launch podcast & playlist tracker.',
    category: 'app',
  },
  {
    action: 'chat',
    description: 'Launch a chat with Claude.',
    category: 'app',
  },
  {
    action: 'cd',
    description:
      'Change directory eg ```cd Documents``` use ```cd ..``` to go one level up and ```cd ~``` to go to the home directory.',
    category: 'terminal',
  },
  { action: 'gui', description: 'Switch to desktop mode.', category: 'app' },
  // System
  {
    action: 'help',
    description: 'Display all possible commands.',
    category: 'system',
  },
  { action: 'clear', description: 'Clear the terminal.', category: 'system' },
  {
    action: 'neofetc',
    description: 'Display system info and stats.',
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
    description: 'Long list of files with human readable file sizes.',
    category: 'terminal',
  },
  {
    action: 'ls -R',
    description: 'Long listing of Human readable file sizes.',
    category: 'terminal',
  },
  {
    action: 'pwd',
    description: 'Print working directory',
    category: 'terminal',
  },
  { action: 'cp', description: 'Copy a File.', category: 'terminal' },
  { action: 'mv', description: 'Rename a file.', category: 'terminal' },
  { action: 'rm', description: 'Delete a file.', category: 'terminal' },
  {
    action: 'rm -rf',
    description:
      'Recursively delete the files in a folder. This should be done with caution and might cause KABOOMs.',
    category: 'terminal',
  },
  {
    action: 'man',
    description: 'Show the manual for a command.',
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
    description: 'Displays active process. Press q to quit.',
    category: 'terminal',
  },
  {
    action: 'nano',
    description: 'Opens the nano editor.',
    category: 'terminal',
  },
  { action: 'vim', description: 'Opens the vim editor.', category: 'terminal' },
  // Easter Egg Ideas
  // Sudo make me a sandwich
]
