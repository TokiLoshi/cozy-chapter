import { betterAuth } from 'better-auth'
import { reactStartCookies } from 'better-auth/react-start'
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
    sendResetPassword: async ({ user, url, token }, request) => {
      void sendEmail({
        to: user.email,
        subject: 'Reset your Cozy Chapter password',
        html: `
        <h2>PPassword Reset</h2>
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
  trustedOrigins: ['http://localhost:3000', 'https://cozy-chapter.netlify.app'],
  plugins: [reactStartCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
