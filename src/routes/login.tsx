import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { signIn } from '@/lib/auth-client'

// TODO: implement zod validation
// TODO: implement the tanstack form with shadcn documentation https://ui.shadcn.com/docs/forms/tanstack-form

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
    console.log(`Trying to log user in with ${email} ${password}`)
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
      <div className="flex items-center justify-center min-h-screen bg-slate-700">
        <form
          onSubmit={handleSubmit}
          className="bg-blue-200 border-blue-400 rounded-2xl text-slate-500 px-4 py-3 mb-4"
        >
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          {error && (
            <div className="bg-blue-300 border-blue-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 characters)"
            required
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account... ' : 'Login'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/users/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
