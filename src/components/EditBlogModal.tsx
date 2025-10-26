import { z } from 'zod'
import { createInsertSchema } from 'drizzle-zod'
import { useState } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../lib/auth'
import type { Blog } from '@/lib/types/Blog'
import {
  getArticlesbyId,
  getSingleBlog,
  updateArticle,
} from '@/db/queries/articles'
import { userBlogs } from '@/db/article-schema'
import { useAppForm } from '@/hooks/form'

export const getBlogToEdit = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      const blogId = data.id
      const singleBlog = getSingleBlog(blogId)
      console.log('Single. blog back from db: ', singleBlog)
    } catch (error) {
      console.log('Something went wrong getting blog: ', data.id)
      throw new Error('Issue getting single blog')
    }
  })

export const updateBlog = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Blog> }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    try {
      console.log('Updating blog with: ', data.id, data.updates)
      const updatedBlog = await updateArticle(data.id, data.updates)
      console.log('Updates from DB: ', updatedBlog)
      return { success: true, id: data.id }
    } catch (error) {
      console.error('Error updating blog: ', data.id, data.updates)
    }
    throw new Error('Something bad happend')
  })

const updateArticlesSchema = createInsertSchema(userBlogs, {
  title: z.string().min(1, 'title is required'),
  url: z.string().optional().or(z.literal('')),
  author: z.string().optional(),
  description: z.string().optional(),
  estimatedReadingTime: z.number().min(0).optional(),
  wordCount: z.number().optional(),
  status: z.enum(['toRead', 'reading', 'read']).default('toRead'),
  notes: z.string().optional(),
})

const EditModal = ({ blog }: { blog: Blog }) => {
  const [open, setOpen] = useState(false)
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
      console.log('Submitting form with: ', value)
      try {
        console.log('Submitting before db...')
        const article = await updateBlog({
          data: {
            id: blog.id,
            updates: value,
          },
        })
        console.log('Article successfully submitted: ', article)
        navigate({ to: '/blogs' })
      } catch (error) {
        console.log('Uh Oh spaghetti os, soemthing went wrong ', error)
      }
    },
  })
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
      >
        Edit
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
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Edit article
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Make changes to your article here
                  </p>
                </div>
                <button onClick={() => setOpen(false)}>x</button>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="p-6 space-y-6"
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
                  <form.SubmitButton label="Submit" />
                </form.AppForm>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
