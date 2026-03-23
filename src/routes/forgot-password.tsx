import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '@/components/Footer'
import { requestPasswordReset } from '@/lib/auth-client'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  }
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const urlError = params.get('error')

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-800">
        <div className="w-full max-w-md px-6 text-center">
          {(!token || urlError) && (
            <h1 className="text-3xl font-bold text-white mb-4">Invalid or </h1>
          )}
        </div>
      </div>
    </>
  )
}
