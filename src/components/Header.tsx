import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { BookCopy, BookOpen, Home, LogIn, LogOut, Menu, X } from 'lucide-react'
import { signOut } from '@/lib/auth-client'

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <header className="p-4 flex items-center bg-slate-800/90 text-white shadow-lg">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/">
            <img
              src="/coffee.png"
              alt="beach birb"
              className="h-10 rounded-2xl"
            />
          </Link>
        </h1>
        <Link to="/">
          <h3 className="ml-4 text-xl font-semibold">Cozy Chapter</h3>
        </Link>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Cozy Menu</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/900 transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-slate-600 hover:bg-slate-800 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Reading Links */}
          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <LogIn size={20} />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <LogIn size={20} />
                <span className="font-medium">Sign up</span>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              <Link
                to="/readingroom"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                }}
              >
                <BookOpen size={20} />
                <span className="font-medium">Reading Room</span>
              </Link>

              <div className="flex flex-row justify-between">
                <Link
                  to="/blogs"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors mb-2"
                  activeProps={{
                    className:
                      'flex-1 flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2',
                  }}
                >
                  <BookCopy size={20} />
                  <span className="font-medium">Blogs</span>
                </Link>
              </div>
              {/** Divider */}
              <div className="my-4 border-t border-gray-700"></div>
              <button
                onClick={async () => {
                  await signOut()
                  setIsOpen(false)
                  navigate({ to: '/login' })
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-400 transition-colors mb-2 w-full text-left"
              >
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </button>
            </>
          )}

          {/* Links End */}
        </nav>
      </aside>
    </>
  )
}
