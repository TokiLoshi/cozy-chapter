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
  const features = [
    {
      icon: <Newspaper className="w-16 h-6" />,
      title: 'Articles',
      description: 'Save articles and track your reading progress.',
      color: 'from-cyan-500/30 to-cyan-500-6',
      border: 'border-cyan-500/30',
      accent: 'text-cyan-400',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Books',
      description:
        'Track your reading page by page to achieve your reading goals',
      color: 'from-amber-500/20 to amber-500/5',
      border: 'border-amber-500/40',
      accent: 'text-ambber-400',
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'AudioBooks',
      description: 'Track your listening progress',
      color: 'from-purple-500 to-purple-500/5',
      border: 'border-purple-500/30',
      accent: 'text-purple-400',
    },
    {
      icon: <Popcorn className="w-6 h-6" />,
      title: 'Movies',
      description: 'Build your watchlist with TMDB integration',
      color: 'from-rose-500/20 to-rose-500/5',
      border: 'border-rose-500/30',
      accent: 'text-rose-400',
    },
    {
      icon: <MonitorPlay className="w-6 h-6" />,
      title: 'Series',
      description: 'Track seasons, episodes, and your binge progress',
      color: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/30',
      accent: 'text-blue-400',
    },
    {
      icon: <Film className="w-6 h-6" />,
      title: 'Podcasts',
      description:
        'Track your listens across spotify and youtube and launch your podcast',
      color: 'from-green-500/20 to-green-500/5',
      border: 'border-green-500/30',
      accent: 'text-green-400',
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Plants',
      description: 'Monitor watering schedules and plant health',
      color: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Terminal',
      description: 'Launch Movies, Series, Podcasts and soon, courses',
      color: 'from-zinc-500/20 to-zinc-500/5',
      border: 'border-zinc-500/30',
      accent: 'text-zinc-300',
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        <section className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0">
            {/** Background image */}
            <img
              src="/homedemo.png"
              alt="home demo"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
          </div>
          <div className="absolute inset-9 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
          {/** Content */}
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                <span className="text-gray-300">Cozy </span>
                <span className="bg-gradient-to-r from-cyan-200 to-blue-800 bg-clip-text text-transparent">
                  Chapter
                </span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              A 3D Media and Plant Tracker
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              A cozy place to view your progress
            </p>
            <div className="flex flex-col items-center gap-4">
              <a
                href="./signup"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
              >
                Sign up
              </a>
              <p className="text-gray-400 text-sm mt-2">
                Create an account if you want to begin your own cozy journey{' '}
                <code className="px-2 py-1 bg-slate-700 rounded text-cyan-400">
                  in 3D
                </code>
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium text-cyan-400 tracking-widest uppercase mb-3">
            Everything in one room
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
