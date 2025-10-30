import { createFileRoute } from '@tanstack/react-router'

import { Panda, Sparkles, Waves } from 'lucide-react'
import Footer from '../components/Footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const features = [
    {
      icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
      title: 'Easy to use (hopefully)',
      description: 'Track your reading in a cozy 3D environment.',
    },

    {
      icon: <Waves className="w-12 h-12 text-cyan-400" />,
      title: 'Work in progress (WIP)',
      description: 'Trying to make article tracking cozy and more fun.',
    },
    {
      icon: <Panda className="w-12 h-12 text-cyan-400" />,
      title: 'Coded with chaotic curiosity',
      description: 'Built to learn tanstack start and practice three.js.',
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <section className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
          <div className="relative max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <h1 className="text-6xl md:text-7xl font-bold text-white">
                <span className="text-gray-300">Cozy</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Chapter
                </span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              A WIP 3D Reading Tracker
            </p>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Trying to make reading a little more fun
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
                Create an account so you can begin a new cozy reading journey{' '}
                <code className="px-2 py-1 bg-slate-700 rounded text-cyan-400">
                  launch 3D
                </code>
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 max-w-7xl mx-auto">
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
      {/* <footer className="py-16 px-6 max-w-7xl mx-auto text-center bg-slate-800 text-emerald-600">
        &copy; {currentYear} coded with chaotic curiosity by TokiLoshi
      </footer> */}
      <Footer />
    </>
  )
}
