import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { Edit, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Blog } from '@/lib/types/Blog'
import { useAppForm } from '@/hooks/form'
import { updateArticle } from '@/db/queries/articles'

export const updateBlog = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Blog> }) => data)
  .handler(async ({ data }) => {
    try {
      await updateArticle(data.id, data.updates)
      return { success: true, id: data.id }
    } catch (error) {
      console.error('Error updating blog: ', data.id, data.updates)
    }
    throw new Error('Something bad happened')
  })

export default function EditArticleModal({
  blog,
  refreshPath,
}: {
  blog: Blog
  refreshPath: string
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const form = useAppForm({
    defaultValues: {
      title: blog.title,
      url: blog.url || '',
      author: blog.author || '',
      description: blog.description || '',
      status: blog.status,
      estimatedReadingTime: blog.estimatedReadingTime || undefined,
      wordCount: blog.wordCount || undefined,
      notes: blog.notes || '',
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
      const loadingToast = toast.loading('Updating article...', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateBlog({
          data: {
            id: blog.id,
            updates: value,
          },
        })
        toast.dismiss(loadingToast)
        toast.success('Article updated successfully!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        navigate({ to: refreshPath })
        setOpen(false)
      } catch (error) {
        toast.error('Failed to update plant', {
          description: 'Please try again',
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
            description: 'text-slate-400',
          },
        })
        console.log('Uh Oh spaghetti os, soemthing went wrong ', error)
      }
    },
  })

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer px-3 py-3 bg-amber-500/80 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <Edit className="w-4 h-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/** Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/** Modal */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
            <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md  border-slate-700/50 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Edit article
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Make changes to your article here
                  </p>
                </div>
                <button
                  className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
                  onClick={() => setOpen(false)}
                >
                  <XIcon className="w-5 h-5" />
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
                  <field.TextField label="Title" placeholder={blog.title} />
                )}
              </form.AppField>

              {/** URL Field */}
              <form.AppField name="url">
                {(field) => (
                  <field.TextField
                    label="url"
                    placeholder={blog.url ? blog.url : 'https://....'}
                  />
                )}
              </form.AppField>

              {/** Author */}
              <form.AppField name="author">
                {(field) => (
                  <field.TextField
                    label="author"
                    placeholder={blog.author ? blog.author : 'who wrote it?'}
                  />
                )}
              </form.AppField>

              {/** Description */}
              <form.AppField name="description">
                {(field) => (
                  <field.TextField
                    label="description"
                    placeholder={
                      blog.description
                        ? blog.description
                        : "description, what's it about?"
                    }
                  />
                )}
              </form.AppField>

              {/** Notes field */}
              <form.AppField name="notes">
                {(field) => <field.TextArea label="Notes" />}
              </form.AppField>

              {/** Status */}
              <form.AppField name="status">
                {(field) => (
                  <field.Select
                    label="Reading Status"
                    values={[
                      { label: 'Want to Read', value: 'toRead' },
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
                    label="Submit"
                    className="cursor-pointer bg-amber-600/90 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                  />
                </form.AppForm>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
