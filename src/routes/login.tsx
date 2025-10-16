import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})

function LoginRoute() {
  console.log('Created Login Route')
  return <div>Hello "/login"!</div>
}
