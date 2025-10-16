import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
// import * as z from "zod"
// import { toast } from "sonner"
// import { Button } from "@components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, }
import { signUp } from '@/lib/auth-client'

// const userSchema = z.object({
//   email: z.ZodEmail(),
//   password: z.string().min(8),
// })

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
          <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
          {error && (
            <div className="bg-blue-300 border-blue-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            type="text"
            name="name"
            placeholder="Username / full name"
            required
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-blue-500"
          />
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
          <input
            type="password"
            name="passwordConfirmation"
            required
            className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account... ' : 'Sign Up'}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/users/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </>
  )
}
