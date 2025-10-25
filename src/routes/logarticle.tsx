import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { getRequest } from '@tanstack/react-start/server'
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
    console.log('Article submitted: ', article)
    return article
  })

export const Route = createFileRoute('/logarticle')({
  loader: async () => {
    const session = await getSessionServer()
    console.log('Session in article form: ', session)
    if (!session) throw redirect({ to: '/login' })
    return { session }
  },
  component: ArticleForm,
})

function ArticleForm() {
  // const { session } = Route.useLoaderData()
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
        const article = await submitArticle({ data: value })
        console.log('Article successfully submitted: ', article)
      } catch (error) {
        console.log('Uh Oh spaghetti os, soemthing went wrong ', error)
      }
    },
  })

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <h2 className="w-full max-w-2xl p-8 text-white text-2xl text-center">
          Log new article
        </h2>
        <form
          onSubmit={(e) => {
            console.log('Clicked!')
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/** Title field */}
          <form.AppField name="title">
            {(field) => <field.TextField label="Title" />}
          </form.AppField>

          {/** URL field */}
          <form.AppField name="url">
            {(field) => <field.TextField label="URL" placeholder="url" />}
          </form.AppField>

          {/** Author field */}
          <form.AppField name="author">
            {(field) => <field.TextField label="Author" />}
          </form.AppField>

          {/** Description field */}
          <form.AppField name="description">
            {(field) => <field.TextField label="Description" />}
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
              <form.SubmitButton label="Submit" />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  )
}
