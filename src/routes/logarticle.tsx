import { createFileRoute } from '@tanstack/react-router'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userBlogs } from '@/db/article-schema'
import { useAppForm } from '@/hooks/form'

export const Route = createFileRoute('/logarticle')({
  component: ArticleForm,
})

const insertArticlesSchema = createInsertSchema(userBlogs, {})

const selectArticleSchema = createSelectSchema(userBlogs)
const articleFormSchema = insertArticlesSchema.omit({
  userId: true,
})

function ArticleForm() {
  // const form = useAppForm({
  //   schema: articleFormSchema,
  //   defaultValues: {
  //     status: 'toRead',
  //     tags: [],
  //     highlights: [],
  //   },
  // })
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        {/* <form
  onSubmit={(e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }}
  className="space-y-6"
  >
    <form.AppField name="status">
      {(field) => <field.TextField lable="Title"} />}
    </form.AppField>
    </form> */}
        Blog form will go here
      </div>
    </div>
  )
}
