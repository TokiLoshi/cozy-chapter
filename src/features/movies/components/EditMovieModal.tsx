import type { Movie, UserMovie } from '@/db/schemas/movies-schema'

type EditMovieModalProps = {
  movie: Movie
  userMovie: UserMovie
  onClose: () => void
}

export default function EditMovieModal({
  movie,
  userMovie,
  onClose,
}: EditMovieModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/** Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        {/** Modal */}
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-800/50 p-6 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-4">Movie to edit {movie.title}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
