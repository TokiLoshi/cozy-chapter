import { 
  // Edit, 
  // Trash, 
  XIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
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
}: AudioBooksFormProps ) 
{
  const [isAddFormOpen, setisAddFormOpen] = useState(false)
  console.log('Audiobook data in modal: ', audiobooks)
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
              title: 'text-slate-100'
            },
          })
          try {
            // TODO: add server logic here
            console.log("User wants to delete audiobook")
            navigate({ to: "/readingroom"})
          } catch (error) {
            console.error("Uh oh spahetti ohs something went wrong")
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      }
    })
  }

  const [isEditOpen, setIsEditOpen ] = useState(false) 
  const [audioBookToEdit, setAudioBookToEdit ] = useState(null) 

  const handleEdit = (audioBook: AudioBook) => {
    setAudioBookToEdit(audioBook)
    setIsEditOpen(true)
  }

  return (
   <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/** Backdrop  */}
      <div className="absolute inset-0 bg-slate-80 backdrop-blur-sm" onClick={closeModal} />

      {/** Edit Modal */}
      {isEditOpen && audioBookToEdit && (
        <EditAudioBookModal audioBook={audioBookToEdit} refreshPath="/readingroom" onClose={() => setIsEditOpen(false)} />
      )}

      {/** Modal Content */}
      {!isEditOpen && (
        <div className="relative w-full z-60 max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Your AudioBookd 🎧</h2>
            <button
              className="cursor-pointer text-gray0400 hover:text-white text-2xl"
              onClick={closeModal}>
              <XIcon />
            </button>
          </div>
          <button className="bg-white mb-3 py-2 text-indigo-800/90 hover:text-indigo-700 hover:bg-gray-100 cursor-pointer rounded-lg px-6"
            onClick={() => {
            setisAddFormOpen(true)
            }}
          >
          + Audio Book
          </button>
          <AudioBookForm 
            isOpen={isAddFormOpen}
            onClose={() => setisAddFormOpen(false)}
            refreshPath={refreshPath} 
          />
         
          {/** Empty State */} 
          { audiobooks.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No audiobooks in your listening library yet
            </div>
          )}

          {audiobooks.length > 0 && (
            <>
            {audiobooks.map((audioBook: AudioBook) => (
              <div key={audioBook.id} className="bg-white/10 border mt">
                AudioBooks stuff to go here
              </div>
            ))}
            </>
          )}

    </div>
    </>
  )
  
}