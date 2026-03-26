import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { resetPassword } from '@/lib/auth-client'
import Footer from '@/components/Footer'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordComponent,
})

function ResetPasswordComponent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const params = new URLSearchParams(window.location.search)
  const token = params.get('token') ?? undefined
  const urlError = params.get('error')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const newPassword = String(formData.get('password'))
    const confirmPassword = String(formData.get('confirmation'))
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match ')
      setLoading(false)
      return
    }
    try {
      await resetPassword({ newPassword, token })
      router.navigate({ to: '/login' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="w-full max-w-md px-6 text-center">
          {urlError ||
            (!token && (
              <>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Invalid or Link Expired
                </h1>
                <p className="text-gray-400 mb-6">
                  This reset link is no loger valid. Please request a new one
                </p>
                <a href="/forgot-password">
                  <button className="text-cyan-500 hover:text-cyan-400 font-medium">
                    Request New Link
                  </button>
                </a>
              </>
            ))}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Set New Password</h1>
            <p className="text-gray-400 mt-2">Enter your new password below</p>
          </div>
          <div className="bg-slate-900 rounded-x1 shadow-2xl p-8 border border-gray-700">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-slate-900/50 border border-red-700 text-red-200 px4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="New password (min 8 characters)"
                  required
                  name="password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmation"
                  className="block text-gray-300 text-sm font-mmedium mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmation"
                  type="password"
                  name="confirmation"
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-600 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full bg-cyan-700 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
