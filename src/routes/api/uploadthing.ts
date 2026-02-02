import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'
import { uploadRouter } from '@/lib/server/uploadthing'

const handler = createRouteHandler({ router: uploadRouter })

export const Route = createFileRoute('/api/uploadthing')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const response = await handler(request)
        return response
      },
      POST: async ({ request }) => {
        return handler(
          new Request(request.url, {
            method: request.method,
            body: request.body,
            headers: request.headers,
            // This is a work around from Tanstack's Discord (courtesy of Andy Coupe)
            // Omit the signal as it's getting prematurely triggered
            // signal: request.signal,
          }),
        )
      },
    },
  },
})
