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
  redirectTo: '/',
  plugins: [magicLinkClient()],
})
