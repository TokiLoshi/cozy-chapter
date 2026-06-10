import { Link, createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/** Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/** Background image */}
          <div className="absolute inset-0">
            <img
              src="/homedemoupdate.png"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950" />
          </div>
          {/** Overlay */}
          <div className="absolute inset-0 backdrop-saturate-150 pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
              <span className="text-slate-200">About Cozy</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Chapter
              </span>
            </h1>
            <p className="text-xl mt-4 text-slate-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
              Hi, I'm Bee, or Toki online 👋 I made Cozy Chapter as a hobby
              project to put all my trackers in one cozy 3D room. It started as
              a place to keep up with what I'm reading, watching, and how my
              plants are doing. A few friends wanted a room of their own.
            </p>
            <p className="text-md text-slate-400 mt-5 ">
              I figure if you stumbled into this corner of the internet, I may
              owe you a short explanation. I built Cozy Chapter with curiosity,
              a little bit of chaos, and the desire to fix personal pain points.
              Please know there might be some bugs. If you let me know where
              they are I'll do my best to gently remove them from the room.{' '}
            </p>
            <p className="text-md text-slate-400 mt-5 mb-10">
              If you have somehow found yourself here and want to try it please
              read the <Link to="/terms">Terms of Use</Link> which are TLDR -
              this is a hobby project and not everything is guaranteed to go
              smoothly. If you have suggestions, feature requests, feedback or
              just want to say hi please feel free to reach out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="group relative px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
              >
                Get Cozy
              </Link>
              <Link
                to="/contact"
                className="group relative px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-400/40"
              >
                Reach Out
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
