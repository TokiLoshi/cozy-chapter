import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '@/components/Footer'
import { requestPasswordReset } from '@/lib/auth-client'
import { CozyHero } from '@/components/CozyHero'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email'))

    try {
      await requestPasswordReset({
        email,
        redirectTo: '/reset-password',
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
      <CozyHero>
        <h1 className="text-3xl  font-bold tracking-tight mb-4">
          <span className="text-slate-200">Reset your password, login</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
            and get cozy
          </span>
        </h1>

        <div className="bg-slate-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          {sent ? (
            <div>
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  If an account with that email exists you'll receive a link
                  shortly
                </p>
                <a
                  href="/login"
                  className="text-cyan-500 hover:text-cyan-400 font-medium"
                >
                  Back to Login
                </a>
              </div>
            </div>
          ) : (
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
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="mt-6 text-center text-sm text-gray-400">
                Remember your password?{' '}
                <a
                  href="/login"
                  className="text-cyan-500 hover:text-cyan-400 font-medium"
                >
                  Login
                </a>
              </p>
            </form>
          )}
        </div>
      </CozyHero>
      <Footer />
    </>
  )
}
