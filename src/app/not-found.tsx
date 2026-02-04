import { ArrowBigLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <p className="text-red-400">404</p>
      <h1>Page not found</h1>
      <button className="mt-8 text-white">
        <a href="/">
          <ArrowBigLeft className="h-4 w-4" />
        </a>
      </button>
    </>
  )
}
