import { Github } from 'lucide-react'

export default function Footer() {
  const currentDate: Date = new Date()
  const currentYear: number = currentDate.getFullYear()
  return (
    <>
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/coffee.png"
                alt="Cozy Chapter"
                className="h-8 rounded-xl"
              />
              <span className="text-lg font-semibold text-white">
                Cozy Chapter
              </span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} creative coding with a touch of chaos and a
              lot of curiosity by{' '}
              <span className="text-gray-400 hover:text-cyan-400 transition-colors">
                <a
                  className="underline-none text-cyan-400"
                  href="https://www.tokiloshi.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TokiLoshi
                </a>
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="https://github.com/TokiLoshi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Github />
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
