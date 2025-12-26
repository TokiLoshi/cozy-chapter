import { Edit, Trash, XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useState } from 'react'
import EditAudioBookModal from './EditAudioBookModal'
// import { useAppForm } from '@/hooks/form'
import type { AudioBook } from '@/lib/types/AudioBook'

type AudioBooksFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
  audiobooks?: Array<AudioBook>
}

export default function AudioBooksModal({
  isOpen,
  onClose,
  refreshPath,
  audiobooks = [],
}: AudioBooksFormProps) {
  console.log('Audio data in audio books modal')

  const [isAddFormOpen, setisAddFormOpen] = useState(false)
  console.log('Refresh path: ', refreshPath)
  console.log('audio books in modal: ', audiobooks)

  if (!isOpen) return null

  const closeModal = () => {
    console.log('Close auidobooks modal ')
    onClose()
  }

  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    console.log('User wants to delete audiobook: ', id)
    toast('Are you sure you want to delete this plant?', {
      description: 'this action cannot be undone',
      classNames: {
        toast: 'bg-slate-800 border-slate-700',
        title: 'text-slate-100',
        description: 'text-slate-400',
        actionButton: 'bg-amber-600 hover:bg-amber-500 text-white',
        cancelButton: 'bg-slate-600 hover:bg-slate-500 text-slate-200',
      },
      action: {
        label: 'Delete',
        onClick: async () => {
          const loadingToast = toast.loading('Removing audiobook...', {
            classNames: {
              toast: 'bg-slate-800 border-slate-700',
              title: 'text-slate-100',
            },
          })
          try {
            // TODO: add server logic here
            console.log('User wants to delete audiobook')
            navigate({ to: '/readingroom' })
          } catch (error) {
            console.error('Uh oh spahetti ohs something went wrong')
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  // const [isEditOpen, setIsEditOpen ] = useState(false)
  // const [audioBookToEdit, setAudioBookToEdit ] = useState(null)

  // const handleEdit = (audioBook: AudioBook) => {
  //   setAudioBookToEdit(audioBook)
  //   setIsEditOpen(true)
  // }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <h2>Audio books stuff goes here</h2>
      </div>
    </>
  )
}
