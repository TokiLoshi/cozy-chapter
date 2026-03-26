import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { magicLink } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db'
import * as schema from '../db/schemas/auth-schema'
import sendEmail from './email'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    // eslint-disable-next-line @typescript-eslint/require-await
    sendResetPassword: async ({ user, url }, _request) => {
      void sendEmail({
        to: user.email,
        subject: 'Reset your Cozy Chapter password',
        html: `
        <h2>Password Reset</h2>
        <p>Hi ${user.name}</p>
        <p>Click the link below to reset your password. This link expires in 1 hour</p>
        <a href="${url}">Sign in</a>
        <p>If you didn't request this you can ignore this email.</p>
        `,
      })
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || '',
  basePath: '/api/auth',
  trustedOrigins: [
    'http://localhost:3000',
    'https://cozy-chapter.netlify.app',
    'https://cozychapter.xyz',
    'https://www.cozychapter.xyz',
  ],
  plugins: [
    magicLink({
      // eslint-disable-next-line @typescript-eslint/require-await
      sendMagicLink: async ({ email, url }, _ctx) => {
        void sendEmail({
          to: email,
          subject: 'Your Cozy chapter magic link',
          html: `
          <h2>Sign in to Cozy Chapter</h2>
          <p>Click the link below to sign in. This link expires in 5 minutes</p>
          <a href="${url}">Sign In</a>
          <p>If you didn't request this, you can ignore this email</p>
          `,
        })
      },
    }),
    tanstackStartCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
