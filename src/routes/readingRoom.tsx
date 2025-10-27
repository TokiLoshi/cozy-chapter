import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
// @ts-ignore - jsx file
import Experience from '../components/Experience'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth-client'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const Route = createFileRoute('/readingroom')({
  beforeLoad: async () => {
    const session = await getSessionServer()
    console.log('Session: ', session)
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
  component: ReadingRoomComponent,
})

function ReadingRoomComponent() {
  const { session } = Route.useRouteContext()

  const navigate = useNavigate()

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-slate-700 text-white">
        <Experience />
        <div className="mx-auto text-white bg-slate-500 py-2 px-3 rounded">
          <h1 className="text-2xl">Welcome to the reading room</h1>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <div>
            <button
              onClick={async () => {
                console.log('Logout clicked')
                await signOut()
                navigate({ to: '/login' })
              }}
              className="bg-green-500 text-white py-2 px-2 rounded mt-6"
            >
              Logout user
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
