import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { XIcon } from 'lucide-react'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { getRequest } from '@tanstack/react-start/server'
import { useState } from 'react'
import { auth } from '../lib/auth'
import { useAppForm } from '@/hooks/form'
import { userBlogs } from '@/db/article-schema'
import { createArticle } from '@/db/queries/articles'
import { getSessionServer } from '@/lib/utils'

const insertArticlesSchema = createInsertSchema(userBlogs, {
  title: z.string().min(1, 'title is required'),
  url: z.string().optional().or(z.literal('')),
  author: z.string().optional(),
  description: z.string().optional(),
  estimatedReadingTime: z.number().min(0).optional(),
  wordCount: z.number().optional(),
  status: z.enum(['toRead', 'reading', 'read']).default('toRead'),
  notes: z.string().optional(),
})

// type ArticleInput = z.infer<typeof insertArticlesSchema>

const submitArticle = createServerFn({ method: 'POST' })
  .inputValidator(insertArticlesSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({ headers: getRequest().headers })
    if (!session) throw new Error('Unauthorized')

    const articleData = {
      ...data,
      userId: session.user.id,
    }
    const article = await createArticle(articleData)
    return article
  })

export const Route = createFileRoute('/logarticle')({
  loader: async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
  component: ArticleForm,
})

function ArticleForm() {
  const [open, setOpen] = useState(true)
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
        navigate({ to: '/readingroom' })
      } catch (error) {
        console.error('Something went wrong updating article: ', error)
      }
    },
  })

  return (
    <>
      {open && (
        <div className="mt-5 inset-0 z-0 flex items-center justify-center">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Log new article...
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    What are you reading today?
                  </p>
                </div>
                <button onClick={() => setOpen(false)}>
                  <XIcon className="text-white" />
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
                  <field.TextField
                    label="Author"
                    placeholder="article author"
                  />
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
                    label="Submit"
                    className="bg-amber-600/90 p-2 w-25 font-semibold"
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
