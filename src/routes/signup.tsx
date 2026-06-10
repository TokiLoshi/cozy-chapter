import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '../components/Footer'
import { signUp } from '@/lib/auth-client'
import { CozyHero } from '@/components/CozyHero'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const passwordConfirmation = String(formData.get('passwordConfirmation'))
    const name = String(formData.get('name'))

    try {
      if (password !== passwordConfirmation) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      await signUp.email({
        email,
        password,
        name,
      })
      router.navigate({ to: '/login' })
    } catch (err) {
      console.error('Error signing up user, ', err, error)
      setError(err instanceof Error ? err.message : 'Failed to create account')
      return
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <CozyHero>
        <h1 className="text-3xl  font-bold tracking-tight mb-2">
          <span className="text-slate-200">Create your own cozy</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Chapter
          </span>
        </h1>
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
              htmlFor="name"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Username / full name"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
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
              placeholder="email"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="passwordConfirmation"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Password Confirmation
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              placeholder="confirm password"
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent tranistion-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating your cozy chapter... ' : 'Get Cozy'}
          </button>
          <span>
            <p className="text-sm mt-2">
              By signing up you agree to the{' '}
              <Link
                to="/terms"
                className="text-cyan-500 hover:text-cyan-600 font-medium"
              >
                terms
              </Link>{' '}
              and{' '}
              <Link
                to="/privacy"
                className="text-cyan-500 hover:text-cyan-600 font-medium"
              >
                privacy
              </Link>
            </p>
          </span>
          <p className="cursor-pointer mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-cyan-500 hover:text-cyan-600 font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </CozyHero>
      <Footer />
    </>
  )
}
