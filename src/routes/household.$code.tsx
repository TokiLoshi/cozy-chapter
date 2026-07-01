import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

import Footer from '@/components/Footer'
import { acceptInvite } from '@/lib/server/household'

export const Route = createFileRoute('/household/$code')({
  loader: async ({ params }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    return { code: params.code, session }
  },
  component: HouseholdPage,
})

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

function HouseholdPage() {
  const [loading, setLoading] = useState(false)
  const [err, setError] = useState<string | null>(null)
  const { code } = Route.useLoaderData()
  const [token, setToken] = useState(code)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    console.log('Form data: ', formData)
    try {
      await acceptInvite({ data: { code: token } })
      router.navigate({ to: '/readingroom' })
    } catch (error) {
      console.error(`Error joining household ${(error as Error).message}`)
      setError(
        error instanceof Error
          ? error.message
          : 'Something went werong joining household',
      )
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
              <span className="text-slate-200">Join Household</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Chapter
              </span>
            </h1>

            <div className="bg-slate-900/80 m-5 p-5 rounded-lg">
              <p className="text-xl mt-4 text-slate-300 font-light max-w-2xl mx-auto mb-2 leading-relaxed">
                Get cozy and water your plants together
              </p>
              <p className="text-l mt-4 text-slate-300 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
                Paste your token below and get cozy
              </p>

              <form onSubmit={handleSubmit}>
                {err && (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                    {err}
                  </div>
                )}
                <div className="mb-4">
                  <label
                    htmlFor="token"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    paste your token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="paste your token"
                    name="token"
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-ray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-75 bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Joining...' : 'Join'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
