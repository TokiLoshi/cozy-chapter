import { Search, XIcon } from 'lucide-react'

type SearchAreaProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchArea({
  value,
  onChange,
  placeholder = 'Search your Library',
}: SearchAreaProps) {
  return (
    <div className="mb-2 p-4 border-b border-slate-700">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        {value.length >= 1 && (
          <button
            className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            onClick={() => onChange('')}
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
