import * as Sentry from '@sentry/tanstackstart-react'
import { createMiddleware } from '@tanstack/react-start'

export const middleware = [
  createMiddleware().server(Sentry.sentryGlobalServerMiddlewareHandler()),
]
