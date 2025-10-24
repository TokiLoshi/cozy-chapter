// import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
// import { createServerFn } from "@tanstack/start"
// import { createInsertSchema } from 'drizzle-zod'
// import { userBlogs } from '@/db/article-schema'
// import { useAppForm } from '@/hooks/form'
// import { z } from 'zod'
// import { getRequest } from "@tanstack/react-start/server"
// import { auth } from "../lib/auth"
// import { useSession } from "@/lib/auth-client"
// import { createArticle } from '@/db/queries/articles'

// const getSessionServer = createServerFn({ method: "GET"}).handler(async() => {
//   const session = await auth.api.getSession({ headers: getRequest().headers })
//   return session
// })

// export const Route = createFileRoute('/logarticle')({
//   beforeLoad: async () => {
//     const session = await getSessionServer()
//     console.log("Session in article form: ", session)
//     if (!session) throw redirect({ to: "/login"})
//   },
//   component: ArticleForm,
// })

// const insertArticlesSchema = createInsertSchema(userBlogs, {
//   title: z.string().min(1, "title is required"),
//   url: z.string().optional(),
//   author: z.string().optional(),
//   publishedDate: z.date().optional(),
//   description: z.string().optional(),
//   estimatedReadingTime: z.number().optional(),
//   wordCount: z.number().optional(),
//   tags: z.array(z.string()).default([]).optional(),
//   highlights: z.array(z.object({
//     text: z.string(),
//     note: z.string().optional(),
//     createdAt: z.string()
//   })).default([])
// })

// const articleFormSchema = insertArticlesSchema.omit({
//   userId: true,
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// })

// function ArticleForm() {
//   const { data: clientSession } = useSession()
//   const session = clientSession
//   const navigate = useNavigate()

//   const form = useAppForm({
//     schema: articleFormSchema,
//     defaultValues: {
//       title: "",
//       url: "",
//       author: "",
//       description: "",
//       status: "toRead",
//       tags: [],
//       highlights: [],
//       notes: ""
//     },
//     onSubmit: async ({ title, url, author, description, status, tags, highlights, notes }) => {
//       try {
//         const result = createArticle()
//         console.log("Success, I think...? ", result)
//       }catch(error) {
//       console.warn("Error saving article: ", error)
//     }
//     }
//   })
//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
//       style={{
//         backgroundImage:
//           'radial-gradient(50% 50% at 5% 40%, #add8e6 0%, #0000ff 70%, #00008b 100%)',
//       }}
//     >
//       <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
//         <form
//   onSubmit={(e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     form.handleSubmit()
//   }}
//   className="space-y-6"
//   >
//     <form.AppField name="title">
//       {(field) => <field.TextField label="Title"} />}
//     </form.AppField>
//     </form>
//       </div>
//       <p>Hi { session?.user.name }</p>
//     </div>
//   )
// }
