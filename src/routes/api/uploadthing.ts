import { createFileRoute } from '@tanstack/react-router'
// import { createFileRoute } from '@tanstack/react-router'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { createRouteHandler } from 'uploadthing/server'
import { uploadRouter } from '../../lib/server/uploadthing'

const handlers = createRouteHandler({ router: uploadRouter })

export const Route = createAPIFileRoute('/api/uploadthing')({
  server: {
    handlers: {
      GET: ({ request }) => {
        console.log('==== uploadt thing GET request has been hit', request)
        return handlers(request)
      },
      POST: ({ request }) => {
        console.log('===== upload thing POST request has been made', request)
        return handlers(request)
      },
    },
  },
})
