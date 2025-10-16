import { createMiddleware } from '@tanstack/react-start'
import { getRequest, setResponseStatus } from '@tanstack/react-start/server'
import { auth } from './auth'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query: {
      disableCookieCache: true,
    },
  })
  if (!session) {
    setResponseStatus(304)
    throw new Error('Unauthorized')
  }
  return next({
    context: {
      user: session.user,
    },
  })
})
