import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FileText, Link, Trash, XIcon } from 'lucide-react'
import EditArticleModal from './EditArticleModal'
import type { Blog } from '@/lib/types/Blog'
import { useAppForm } from '@/hooks/form'
import { submitArticle } from '@/lib/server/articles'
import { getSessionServer } from '@/lib/utils'

export const Route = createFileRoute('/logarticle')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
})

export function ArticleCardModal({
  item,
  onDelete,
}: {
  item: Blog
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
      <div className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center flex-shrink-0">
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <Link className="w-6 h-6 text-amber-500/80 hover:text-amber-400 transition-colors cursor-pointer" />
          </a>
        ) : (
          <FileText className="w-6 h-6 text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-100 ">{item.title}</h4>

        <p className="text-sm text-slate-200 ">
          {item.author ? `by: ${item.author}` : 'author unknown'}
        </p>
        <span>
          {item.description && (
            <p className="text-sm text-slate-400">
              Description: {item.description}
            </p>
          )}
          {item.estimatedReadingTime && (
            <p className="text-sm text-slate-400">
              Estimated Reading Time: {item.estimatedReadingTime}
            </p>
          )}
          {item.wordCount && (
            <p className="text-sm text-slaate-400">
              Word Count: {item.wordCount}
            </p>
          )}
          {item.notes && (
            <p className="text-sm text-slate-400">Notes: {item.notes}</p>
          )}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        <EditArticleModal blog={item} refreshPath="/readingroom" />

        <button
          onClick={onDelete}
          className="cursor-pointer px-3 py-3 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

type ArticleFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

export default function ArticleForm({ isOpen, onClose }: ArticleFormProps) {
  const queryClient = useQueryClient()

  const form = useAppForm({
    defaultValues: {
      userId: '',
      title: '',
      url: '',
      author: '',
      description: '',
      status: 'toRead' as 'toRead' | 'reading' | 'read',
      estimatedReadingTime: undefined,
      wordCount: undefined,
      tags: [],
      highlights: [],
      notes: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        // Title Required
        if (value.title.length === 0) {
          errors.fields.title = 'Title is required'
        }
        // Validate URL
        if (value.url && value.url.length > 0) {
          try {
            new URL(value.url)
          } catch {
            errors.fields.url = 'Must be a valid URL'
          }
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await submitArticle({ data: value })
        queryClient.invalidateQueries({ queryKey: ['user-blogs'] })
        form.reset()
        toast.success('Article added! 📖', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
      } catch (error) {
        console.error(`Error submitting article: ${error}`)
        toast.error('Failed to add article', {
          description: 'Something went wrong. Please try again',
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
            description: 'text-slate-400',
          },
        })
      }
    },
  })

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-amber-500/10 shadow-2xl shadow-amber-900/20 m-4">
          <div className="sticky top-0 bg-gradient-to-r from-slate-80/95 to-slate-800/80 backdrop-blur-md border-b border-amber500/10 p-6 z-[10]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Log new article...
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  What are you reading today?
                </p>
              </div>
              <button
                onClick={onClose}
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
              >
                <XIcon className=" w-5 h-5 " />
              </button>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="p-6 space-y-6 text-gray-100"
          >
            {/** Title field */}
            <form.AppField name="title">
              {(field) => (
                <field.TextField label="Title" placeholder="Article title" />
              )}
            </form.AppField>

            {/** URL field */}
            <form.AppField name="url">
              {(field) => (
                <field.TextField
                  label="Article URL"
                  placeholder="http://www.example.com"
                />
              )}
            </form.AppField>

            {/** Author field */}
            <form.AppField name="author">
              {(field) => (
                <field.TextField label="Author" placeholder="article author" />
              )}
            </form.AppField>

            {/** Description field */}
            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label="Description"
                  placeholder="what is it about?"
                />
              )}
            </form.AppField>

            {/** Notes field */}
            <form.AppField name="notes">
              {(field) => <field.TextArea label="Notes" />}
            </form.AppField>

            {/** Tags field */}
            <form.AppField name="status">
              {(field) => (
                <field.Select
                  label="Reading Status"
                  values={[
                    { label: 'To Read', value: 'toRead' },
                    { label: 'Reading', value: 'reading' },
                    { label: 'Read', value: 'read' },
                  ]}
                  placeholder="Select status"
                />
              )}
            </form.AppField>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Add"
                  className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
