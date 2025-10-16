import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  console.log('Created sign up route!')
  return <div>Hello "/signup"!</div>
}
