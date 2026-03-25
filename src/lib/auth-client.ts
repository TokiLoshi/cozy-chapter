import { createAuthClient } from 'better-auth/react'
import { magicLinkClient } from 'better-auth/client/plugins'

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  getSession,
  requestPasswordReset,
  resetPassword,
  magicLink,
} = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  redirectTo: '/',
  plugins: [magicLinkClient()],
})
