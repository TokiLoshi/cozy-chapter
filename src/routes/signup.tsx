import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '../components/Footer'
import { signUp } from '@/lib/auth-client'

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

    console.log(
      `about to try login in ${name} with email: ${email} and password: ${password} and confirmation: ${passwordConfirmation}`,
    )

    try {
      if (password !== passwordConfirmation) {
        console.log("Passwords don't match")
        setError('Bad Request')
      }
      const user = await signUp.email({
        email,
        password,
        name,
      })
      console.log('User post signup: ', user)
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
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <img
              src="/coffee.png"
              alt="Cozy Chapter"
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-white">Join Cozy Chapter</h1>
            <p className="text-gray-400 mt-2">Start your reading journey</p>
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
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
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus-ring-cyan-600 focus:border-transparent tranistion-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account... ' : 'Sign Up'}
            </button>
            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <a
                href="/users/login"
                className="text-cyan-500 hover:bg-cyan-600 font-medium"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
