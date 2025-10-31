import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '../components/Footer'
import { signIn } from '@/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    try {
      const user = await signIn.email({
        email,
        password,
      })
      console.log('Result of user sign in: ', user)
      router.navigate({ to: '/readingroom' })
    } catch (err) {
      console.error('Login failed: ', err)
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <img
              src="/coffee.png"
              alt="Cozy chapter"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue reading</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-700"
          >
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                {error}
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
              className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in... ' : 'Login'}
            </button>
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-cyan-500 hover:bg-cyan-600 font-medium"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
