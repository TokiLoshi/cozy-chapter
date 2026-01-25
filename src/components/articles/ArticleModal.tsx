import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'
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

type ArticleFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

export default function ArticleForm({
  isOpen,
  onClose,
  refreshPath,
}: ArticleFormProps) {
  const navigate = useNavigate()

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
        onClose()
        navigate({ to: refreshPath })
      } catch (error) {
        console.error(`Error submitting article: ${error}`)
      }
    },
  })

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 p-6 z-10">
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
            {/* <form.AppField name="status">
            {(field) => <field.TextField label="status" />}
          </form.AppField> */}
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
                  label="Add article"
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
