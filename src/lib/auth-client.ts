import { createAuthClient } from 'better-auth/react'

export const { useSession, signIn, signOut, signUp, getSession } =
  createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || '/api/auth',
    redirectTo: '/',
  })
