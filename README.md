# ☕️📚 Cozy Chapter

A 3D interactive room where you can track your books, articles, movies, series, podcasts, audiobooks and plants — all from a cozy virtual space filled with clickable objects and hidden easter eggs.

## ❔What is it?

Cozy Chapter is a full-stack media tracker wrapped in a 3D room. Instead of a traditional dashboard, you interact with objects in the room — click the bookshelf to manage articles, the laptop to browse movies, the headphones for audiobooks, the orchid for plant care, and so on. There's also a terminal emulator with hidden commands to launch, and several buried easter eggs.

## Motivation

I wanted a better Goodreads. Then I wanted somewhere to track my plant watering. Then my movie watchlist. Then podcasts. At some point I realized I just wanted one cozy place to put all my stuff — so I built one. This started as a Three.js learning project and kept growing because every time I finished a feature I thought "wouldn't it be nice if it also did..." and here we are.

## ✨ Features

### Media Tracking

- **Articles** — save articles with URL, author, and reading status (to read / reading / read)
- **Books** — track page-by-page progress with chapter bookmarks via Google Books
- **Audiobooks** — monitor listening progress with chapter and position tracking
- **Movies** — search and add from TMDB, rate, review, and track watchlist status
- **Series** — track seasons and episodes with TMDB integration
- **Podcasts** — save episodes from Spotify and YouTube with playback position

### Beyond Media

- **Plants** — track watering schedules, light preferences, and plant health status
- **Terminal** — a command-line interface to launch apps, view stats, and discover easter eggs
- **Sound effects** — every clickable object has audio feedback (fireplace crackle, guitar strums, page turns)
- **Ambient music** — multiple lo-fi tracks to set the mood while you browse

### 3D Room

- Fully interactive Three.js environment
- Clickable objects: bookshelf, laptop, headphones, orchid, guitar, fireplace, DJ decks, lamp, and more
- Toggle the lamp on and off
- A husky that does husky things

- Interactive 3D reading room environment
- Track read, currently reading, and to-read blogs
- Optional authentication or demo mode
- Full-stack application with modern tech
- Audio and sound efffects implemented with howler.js

## 🛠️ Tech Stack

| Layer         | Tools                                           |
| ------------- | ----------------------------------------------- |
| Framework     | TanStack Start, TanStack Router, TanStack Query |
| 3D            | Three.js, React Three Fiber, Drei               |
| Styling       | Tailwind CSS, shadcn/ui                         |
| Database      | Neon (PostgreSQL), Drizzle ORM                  |
| Auth          | Better Auth                                     |
| Validation    | Zod                                             |
| Forms         | TanStack Form                                   |
| Audio         | Howler.js                                       |
| Image uploads | UploadThing                                     |
| Deployment    | Netlify                                         |

## APIs

- **TMDB** — movie and TV series search, details, and metadata
- **Google Books** — book search and details
- **Spotify** — podcast episode search
- **YouTube** — podcast and video search

# Quick Start

```bash
# Clone the repo
git clone https://github.com/TokiLoshi/cozy-chapter.git
cd cozy-chapter

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

```

Fill in your API keys — the `.env.example` file has comments linking to where you can get each one. The app will run without all keys, but some features will be limited:

| Key                    | Required for                     |
| ---------------------- | -------------------------------- |
| `VITE_DATABASE_URL`    | Everything (database connection) |
| `BETTER_AUTH_SECRET`   | Authentication                   |
| `TMDB_API_KEY`         | Movies and series search         |
| `GOOGLE_BOOKS_API_KEY` | Book search                      |
| `SPOTIFY_KEY`          | Podcast search                   |
| `YOUTUBE_API_KEY`      | YouTube podcast search           |
| `UPLOADTHING_TOKEN`    | Image uploads                    |

```bash
# Run database migrations
npx drizzle-kit push

# Start the dev server
npm run dev
```

## Usage

### Example Terminal Commands

The laptop in the 3D room opens a terminal emulator. Some commands to try:

| Command                   | What it does                |
| ------------------------- | --------------------------- |
| `help`                    | Show all available commands |
| `movies`                  | Launch the movie tracker    |
| `series`                  | Launch the series tracker   |
| `podcasts`                | Launch the podcast tracker  |
| `neofetch`                | Display system info         |
| `whoami`                  | Print your username         |
| `history`                 | Show command history        |
| `sudo make me a sandwich` | Try it and find out         |

There are more hidden commands. Explore and you might even see a humorous KABOOM💥

## 🚧 Roadmap

### Planned (subject to change)

- **Course tracker** — track online courses, lectures, and progress across platforms
- **Reading stats** — visualize reading habits, streaks, pages per week, and completion rates
- **Progress sync** — automatically update book/audiobook progress when marking chapters complete
- **User panel** — account settings, profile customization, and a dashboard overview of all tracked media
- **Meal planning** — recipes and weekly meal plans (schema exists, UI coming)
- **Reading goals** — set and track yearly/monthly reading targets
- **Export data** — download your tracking data as CSV or JSON
- **Accessibility audit** — keyboard navigation, screen reader support, ARIA labels, focus management, and color contrast across all modals and the 3D room
- **Magic link auth** — passwordless login via email magic links
- **More easter eggs** — always more easter eggs

## 🙌 Attributions:

<summary>3D Models</summary>

1. Bookcase with Books by Quaternius via [polypizza](https://poly.pizza/m/tACDGJ4CGW)
2. Wall Corner by Kenney via [polypizza](https://poly.pizza/m/Rad76BJn2L)
3. Wall by Kenney via [polypizza](https://poly.pizza/m/N8d0nkQGOn)
4. Book by Quaternius (https://poly.pizza/m/LC0w7VI75u)
5. L Couch by Quaternius (https://poly.pizza/m/1kwsjhpY84)
6. Planks by Kay Lousberg (https://poly.pizza/m/5m4LLpNl2M)
7. Open Book by Quaternius (https://poly.pizza/m/1A07aI9j2d)
8. Open Book by Quaternius (https://poly.pizza/m/JEDMpG0UIR)
9. DJ gear by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/5Zq4tgSECXz)
10. Plants - Assorted shelf plants by Jakers_H [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/5COCzyz489J)
11. Book by Quaternius (https://poly.pizza/m/h3Wh4fxSQX)
12. Headphones by Michael Fuchs [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/fPJoG2u0gnN)
13. Husky by Quaternius (https://poly.pizza/m/wcWiuEqwzq)
14. Windows by Francis Chen [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/c93mqlf3yl1)
15. Light Stand by Quaternius (https://poly.pizza/m/9L6lLUl9sD)
16. Record player by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/6XodSi_3y_i)
17. Fireplace by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/fueH4_5W9Ug)
18. Radio by Quaternius (https://poly.pizza/m/TPqvwkyWdV)
19. Table by Kenney (https://poly.pizza/m/41R2HTYj1O)
20. Houseplant by Quaternius (https://poly.pizza/m/bfLOqIV5uP)
21. Painting by CreativeTrio (https://poly.pizza/m/Pi6oReAizt)
22. Vines by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/2jffIS8PMjZ)
23. Orchid by Poly by Google [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/0gEtIcRV4do)
24. Acoustic Guitar by Dave Edwards [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/bf6_h_1wp2D)
25. Laptop by J-Toastie [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/WMW4C2J021)

Model JSX auto-generated by NikkitaFTW and [Poimandres](https://gltf.pmnd.rs/)

</details>

### Sound effects

1. Sassy Husky Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=62412) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=62412)
2. Ambient noise background by [ido berg](https://pixabay.com/users/idoberg-34953295/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=248205) from [Pixabay](https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=248205)
3. Ambient track 2 by [kaveesha Senanayake](https://pixabay.com/users/lofidreams-25132446/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=336230) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=336230)
4. Ambient track 3 by [Nver Avetyan](https://pixabay.com/users/nveravetyanmusic-29393722/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=412839) from [Pixabay](https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=412839)>
5. Ambient track 4 by [Evgeny Bardyuzha](https://pixabay.com/users/evgeny_bardyuzha-25235210/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=364091") from [Pixabay](https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=364091)
6. Ambient track 5 by [AllWorldMusic](https://pixabay.com/users/allworldmusic-46839791/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=258550) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=258550)
7. Ambient track 6 by (Yurii Semchyshyn)[https://pixabay.com/users/coma-media-24399569/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=11492] from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=11492)
8. Ambient track 7 by (Villatic Music)[https://pixabay.com/users/villatic_music-46790459/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=257044] from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=257044)
9. Fireplace generated on 11Labs
10. Guitar strum G Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=36237) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=36237)
11. Guitar in D Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=89205) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=89205)
12. Pluck Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=104882) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=104882)
13. E flat minor Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=78603) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=78603)
14. Guitar Strumming Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=88479) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=88479)
15. Intro Ambient Audio Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=63590) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=63590)
16. Euro Samples Sound Effect by [Alpha-Samples](https://pixabay.com/users/alpha-samples-46316338/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=249333) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=249333)
17. Alpha Samples Sound Effect by (Alpha-Samples)[https://pixabay.com/users/alpha-samples-46316338/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=246889] from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=246889)
18. Lamp Click Sound Effect by (freesound_community)[https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=101351] from (Pixabay)[https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=101351]
19. Pages Turning Sound Effect by (freesound_community)[https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=79935] from (Pixabay)[https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=79935]
20. Book Close Sound Effect by (freesound_community)[https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=48184] from (Pixabay)[https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=48184]
21. Bush movement Sound Effect by (freesound_community)[https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6986] from (Pixabay)[https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6986]

## 🤝 Contributing

For questions, feedback, or just to say hi, find me on X [@3DBeeing](https://x.com/3DBeeing).

## License

MIT — see [LICENSE](https://github.com/TokiLoshi/cozy-chapter/blob/main/LICENSE.txt) for details.

3D models and sound effects are used under their respective licenses (CC-BY 3.0, CC0, Pixabay Content License). See attributions above for full credits.
