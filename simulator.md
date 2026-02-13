# Phases and Features

## Terminal mode (default)

- Styled after terminal with green-on-dark zsh
- username at the top
- ASCII art welcome message
- Map out commands
- Commands launch sub-modals :
  - movies
  - courses
  - youtube
  - chat (ai integration)
  - lastfm discord bot maybe?
  - help lists out commands
  - gui "closes" terminal and launches GUI modal

## GUI mode (entered by clicking out of the terminal)

- Styled after MacOs
- Draggable Icons
- Icons:
  - movies
  - courses
  - youtube
  - chat (ai integration)
  - discord bot (lastfm integration) - maybe
  - terminal "closes" gui interface and launches terminal modal
  - settings (help equivalent) - explains what's available

### Roadmap

#### Phase 1: Terminal Shell

- [ ] Create modal styled as terminal with title bar, traffic buttons and username
- [ ] Create ASCII art welcome banner (maybe with figlet fonts) or figlet.js
- [ ] Create blinking cursor input
- [ ] Map out commands and accept search
- [ ] Watch for keyboard input and allow for tab autocomplete
- [ ] Create output for help command
- [ ] Add updown arrow tracking to cycle through command history (maybe using zustand here)
- [ ] Add neofetch/status command (visually impressive and force thinking how apps expose data to terminal layer for architecture)

#### Phase 2: Courses App

- [ ] Generate courses schema
- [ ] Generate courses modal
- [ ] Generate queries for courses
- [ ] Generate crud for courses
- [ ] Wire up modal for courses
- [ ] Research making CRUD pattern reusable
- [ ] Filter for books

#### Phase 3: Movies and Series

- [ ] Generate youtube schema
- [ ] Generate queries for youtube
- [ ] Generate crud for youtube
- [ ] Wire up modal for youtube
- [ ] Research movies and series api
- [ ] Generate movies modal
- [ ] Generate schemas for media (movies and series)
- [ ] Generate queries for movies
- [ ] Generate crud for moviees
- [ ] Wire up movies modal
- [ ] Generate queries for series
- [ ] Generate crud for series

#### Phase 4: OS Dock

- [ ] Generate OS style dock and desktop
- [ ] Wire up commands to launch each one of them
- [ ] Make icons draggable on desktop mode with framer-motion or react spring
- [ ] Animate launch modal
- [ ] Add animation to reading, podcasts and plants modals
- [ ] Make windows resizable

#### Phase 5: Chat Modal

- [ ] Generate chat modal
- [ ] Reasearch Anthropic API from front end
- [ ] Research prompt design
- [ ] Create chat modal
- [ ] Wire up chat

#### Phase 6: User Preferences and Stats

- [ ] Generate user preferences schema
- [ ] Generate user stats schema
- [ ] Generate user preferences queries
- [ ] Generate user states queries
- [ ] Wire up user preferences modal
- [ ] Wire up user stats modal
- [ ] Generate option to change screensaver (store on upload thing) and save on upload thing
- [ ] Generate different terminal settings options

#### Phase 7: LastFm and Discord Bot (maybe stretch)

- [ ] Listening stats

#### Phase 8: Refinement

- [ ] Add easter eggs
- [ ] toggle music player from terminal
