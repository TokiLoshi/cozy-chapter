import { createFileRoute } from '@tanstack/react-router'

import {
  BookOpen,
  Film,
  Headphones,
  Leaf,
  MonitorPlay,
  Newspaper,
  Popcorn,
  Terminal,
} from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  //
  const features = [
    {
      icon: <Newspaper className="w-6 h-6" />,
      title: 'Articles',
      description: 'Save articles and track your reading progress.',
      color: 'from-cyan-500/30 to-cyan-500/5',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Books',
      description:
        'Track your reading page by page to achieve your reading goals.',
      color: 'from-amber-500/30 to-amber-500/5',
      border: 'border-amber-500/30',
      accent: 'text-amber-400',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'AudioBooks',
      description: 'Track your listening progress.',
      color: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
      accent: 'text-purple-400',
    },
    {
      icon: <Popcorn className="w-6 h-6" />,
      title: 'Movies',
      description: 'Build your watchlist with TMDB integration.',
      color: 'from-rose-500/20 to-rose-500/5',
      border: 'border-rose-500/30',
      accent: 'text-rose-400',
    },
    {
      icon: <MonitorPlay className="w-6 h-6" />,
      title: 'Series',
      description: 'Track seasons, episodes, and your binge progress.',
      color: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/30',
      accent: 'text-blue-400',
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: 'Podcasts',
      description:
        'Track your listens across spotify and youtube and launch your podcast.',
      color: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/30',
      accent: 'text-green-400',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Plants',
      description: 'Monitor watering schedules and plant health.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Terminal',
      description: 'Launch Movies, Series, Podcasts and soon, courses.',
      color: 'from-zinc-500/20 to-zinc-500/5',
      border: 'border-zinc-500/30',
      accent: 'text-zinc-400',
    },
  ]
  const steps = [
    {
      step: '01',
      title: 'Explore the room',
      description:
        'Navigate a 3D cozy room filled with clickable objects, and easter eggs',
      accent: 'text-cyan-400',
      border: 'border-cyan-500/20',
    },
    {
      step: '02',
      title: 'Track your media',
      description:
        'Add movies and series from TMDB, save podcast episodes from Spotify, track your reading progress and monitor your plants.',
      accent: 'text-amber-400',
      border: 'border-amber-500/20',
    },
    {
      step: '03',
      title: 'Find the easter eggs',
      description:
        "There's a terminal with hidden commands, play around and see what you discover",
      accent: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/** Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/** Background image */}
          <div className="absolute inset-0">
            <img
              src="/homedemo.png"
              alt="home demo"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950" />
          </div>
          {/** Grain overlay */}
          <div className="absolute inset-0 backdrop-saturate-150 pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            {/** Logo mark */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="text-sm text-slate-400">☕️</span>
              <span className="text-sm font-medium text-slate-300 tracking-wide">
                a cozy place for your stuff
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
              <span className="text-slate-200">Cozy</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Chapter
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
              Track your books, articles, movies, series, podcasts, plants (and
              soon... courses)
            </p>

            <p className="text-sm text-slate-500 mb-10">
              Built with Three.js, TanStack Start, and a love for cozy vibes
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="./signup"
                rel="noopener noreferrer"
                className="group relative px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
              >
                Get started
              </a>
            </div>
          </div>
          {/** Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 bg-slate-500 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/** Trackable */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-3">
                Everything in one room
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Track all your media
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Click around the 3D room to open different trackers. Most
                objects are interactive
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className={`group relative bg-gradient-to-b ${feature.color} border ${feature.border} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                >
                  <div
                    className={`${feature.accent} mb-4 transition-transform duration-300 group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/** How it works */}
        <section className="py-24 px-6 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-amber-400 tracking-widest uppercase mb-3">
                How it works
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Your room your rules
              </h2>
            </div>
            <div className="space-y-12">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className={`flex gap-6 items-start p-6 rounded-2xl border ${item.border} bg-slate-800/20`}
                >
                  <span
                    className={`text-4xl font-black ${item.accent} opacity-60 shrink-0 font-mono`}
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/** CTA */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-6xl mb-6">☕️</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to get cozy?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
              Create an account to start tracking your media in your own 3D room
              in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="./signup"
                className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
              >
                Create your own room
              </a>
              <a
                href="./login"
                className="px-8 py-3.5 text-slate-400 hover:text-white font-medium transition-colors"
              >
                Already have an account? Login →
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
