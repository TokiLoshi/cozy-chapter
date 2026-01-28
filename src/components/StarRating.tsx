import { Star } from 'lucide-react'

export default function StarRating({
  value,
  onChange,
  disabled,
}: {
  value: number | null
  onChange: (rating: number | null) => void
  disabled?: boolean
}) {
  return (
    <>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (value === star) {
                onChange(null)
              } else {
                onChange(star)
              }
            }}
            className={`p-1 transition-all ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-100'}`}
          >
            <Star
              className={`w-6 h-6 ${value && star <= value ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`}
            />
          </button>
        ))}
      </div>
    </>
  )
}
