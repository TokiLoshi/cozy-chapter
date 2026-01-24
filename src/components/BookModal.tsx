import { Edit, Loader2, Plus, Search, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useState } from 'react'
import EditBookModal from './EditBookModal'
import type { Books, UserBooks } from '@/db/book-schema'
import {
  addBook,
  deleteUserBookServer,
  getUserBookServer,
  searchBooks,
  updateUserBookServer,
} from '@/lib/server/books'

type BookModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function BookCard({
  item,
  onEdit,
  onDelete,
}: {
  item: { book: Books; userBook: UserBooks }
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
        {item.book.coverImageUrl && (
          <img
            src={item.book.coverImageUrl}
            alt={item.book.title}
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-100 truncate">
            {item.book.title}
          </h4>
          <p className="text-sm text-slate-400 truncate">
            {item.book.authors?.join(',')}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-300">
              Page {item.userBook.currentPage} / {item.book.pageCount}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={onEdit}
            className="cursor-pointer bg-amber-500/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyTabContent({ message }: { message: string }) {
  return <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
}

export default function BooksModal({ isOpen, onClose }: BookModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [bookToEdit, setBookToEdit] = useState<{
    book: Books
    userBook: UserBooks
  } | null>(null)

  const queryClient = useQueryClient()

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value)
    }, 500)
    return () => clearTimeout(timeoutId)
  }
}
