import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { sendContactEmail } from '@/lib/server/contact'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    const formData = new FormData(e.currentTarget)
    try {
      await sendContactEmail({
        data: {
          email: String(formData.get('email')),
          message: String(formData.get('message')),
          company: formData.get('company')
            ? String(formData.get('company'))
            : null,
        },
      })
      setSent(true)
    } catch (error) {
      console.error(`Error resetting password`)
      setErr(error instanceof Error ? error.message : 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

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
              <span className="text-slate-200">Contact Cozy</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Chapter
              </span>
            </h1>

            {!sent && (
              <>
                <div className="bg-slate-900/80 m-5 p-5 rounded-lg">
                  <p className="text-xl mt-4 text-slate-300 font-light max-w-2xl mx-auto mb-2 leading-relaxed">
                    Find a bug, have feedback, feature requests or just want to
                    say hi?
                  </p>
                  <p className="text-l mt-4 text-slate-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
                    Reach out 👋
                  </p>

                  <form onSubmit={handleSubmit}>
                    {err && (
                      <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {err}
                      </div>
                    )}
                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-ray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute left-[-999px] w-px h-px overflow-hidden"
                      />
                      <label
                        htmlFor="message"
                        className="block text-gray-300 mt-3"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        placeholder="message to cozy chapter"
                        className="w-full px-4 py-3 bg-gray-800 border border-ray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="cursor-pointer w-75 bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </>
            )}

            {sent && (
              <p className="mt-4 text-center text-sm text-emerald-400">
                Thank you, your message is on it's way 🚀
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
