import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '../components/Footer'
import { signIn } from '@/lib/auth-client'
import { CozyHero } from '@/components/CozyHero'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    try {
      const { error } = await signIn.email({
        email,
        password,
      })
      if (error) {
        setErr(error.message ?? 'Login failed')
        return
      }
      await router.invalidate()
      router.navigate({ to: '/readingroom' })
    } catch (error) {
      console.error('Login failed: ', error)
      setErr(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CozyHero>
        <h1 className="text-3xl  font-bold tracking-tight mb-4">
          <span className="text-slate-200">Welcome back! Login</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
            and get cozy
          </span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-700"
        >
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
              name="email"
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in... ' : 'Login'}
          </button>
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a
              href="/signup"
              className="cursor-pointer text-cyan-500 hover:bg-cyan-600 font-medium"
            >
              Sign Up
            </a>
          </p>
          <p className="mt-6 text-center text-sm text-gray-400">
            Forgot your password?{' '}
            <a
              href="/forgot-password"
              className="cursor-pointer text-cyan-500 hover:bg-cyan-600 font-medium"
            >
              Reset it
            </a>
          </p>
        </form>
      </CozyHero>
      <Footer />
    </>
  )
}
