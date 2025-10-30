import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import Header from '../components/Header'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { auth } from '@/lib/auth'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Cozy Chapter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: async () => {
    const session = await getSessionServer()
    return { session }
  },

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { session } = Route.useLoaderData()
  const isAuthenticated = !!session?.user

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header isAuthenticated={isAuthenticated} />
        {children}
        <Toaster
          toastOptions={{
            style: {
              background: '#1e293b',
              borderColor: '#334155',
              color: '#f1f5f9',
            },
          }}
        />
        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        /> */}
        <Scripts />
      </body>
    </html>
  )
}
