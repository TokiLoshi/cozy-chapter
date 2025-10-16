import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/readingRoom')({
  component: ReadingRoomComponent,
})

function ReadingRoomComponent() {
  console.log('Created reading room component')
  return <div>Hello "/readingRoom"!</div>
}
