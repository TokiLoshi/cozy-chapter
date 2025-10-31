import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Edit, Link, Trash, XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import Experience from '../components/Experience'
import type { Blog, ReadStatus } from '@/lib/types/Blog'
import {
  deleteArticle,
  getArticlesbyId,
  getSingleBlog,
  updateArticle,
} from '@/db/queries/articles'
import { useAppForm } from '@/hooks/form'

const getUserBlogs = createServerFn({ method: 'GET' }).handler(async () => {
  const demoId = 'KUoxnc1cNGmjNUpBbnXPecmKpCfcsMLZ'
  const blogs = await getArticlesbyId(demoId)
  return blogs
})

export const getBlogToEdit = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(({ data }) => {
    try {
      const blogId = data.id
      const singleBlog = getSingleBlog(blogId)
      console.log('Single blog: ', singleBlog)
    } catch (error) {
      console.log('Something went wrong getting blog: ', data.id)
      throw new Error('Issue getting single blog')
    }
  })

export const deleteBlogs = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const blogId = data
    try {
      console.log('In delete server function passing this to the query: ', data)
      const deletedBlog = await deleteArticle(blogId)
      console.log('Deleted: ', deletedBlog)
      return { success: true, id: blogId }
    } catch (error) {
      console.error(
        'Oops, something went wrong deleting the article: ',
        error,
        blogId,
      )
      throw new Error('Something bad happened')
    }
  })

export const updateBlog = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Blog> }) => data)
  .handler(async ({ data }) => {
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

const EditModal = ({ blog }: { blog: Blog }) => {
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

        navigate({ to: '/readingroomdemo' })
        setOpen(false)
      } catch (error) {
        console.log('Uh Oh spaghetti os, soemthing went wrong ', error)
      }
    },
  })
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-8 py-3 bg-indigo-800/90 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <Edit className="w-4 h-4" />
        <span className="text-sm">Edit</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/** Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm text-white"
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

export const Route = createFileRoute('/readingroomdemo')({
  loader: async () => {
    const blogs = await getUserBlogs()
    return { blogs }
  },
  component: ReadingRoomDemoComponent,
})

function ReadingRoomDemoComponent() {
  const { blogs } = Route.useLoaderData()
  const navigate = useNavigate()
  // const [showBlogsOverlay, setShowBlogsOverlay] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ReadStatus | null>(null)

  const filteredBlogs = useMemo(() => {
    if (!selectedStatus) return []
    return blogs.filter((blog: Blog) => blog.status === selectedStatus)
  }, [blogs, selectedStatus])

  const stats = useMemo(() => {
    return {
      toRead: blogs.filter((blog: Blog) => blog.status === 'toRead').length,
      reading: blogs.filter((blog: Blog) => blog.status === 'reading').length,
      read: blogs.filter((blog: Blog) => blog.status === 'read').length,
      total: blogs.length,
    }
  }, [blogs])

  const handleBookcaseClick = (status: ReadStatus) => {
    setSelectedStatus(status)
  }

  const closeModal = () => {
    setSelectedStatus(null)
  }

  const getModalTitle = () => {
    switch (selectedStatus) {
      case 'read':
        return "Articles you've read"
      case 'reading':
        return 'Currently Reading'
      case 'toRead':
        return 'Want to Read'
      default:
        return 'Your Reading List'
    }
  }

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this article?', {
      description: 'This action cannot be undone.',
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
          const loadingToast = toast.loading('Deleting article...', {
            classNames: {
              toast: 'bg-slate-800 border-slate-700',
              title: 'text-slate-100',
            },
          })
          try {
            await deleteBlogs({ data: id })
            toast.dismiss(loadingToast)
            toast.success('Article deleted successfully!', {
              classNames: {
                toast: 'bg-slate-800 border-slate-700',
                title: 'text-slate-100',
              },
            })
            closeModal()
            navigate({ to: '/readingroomdemo' })
          } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Failed to delete article', {
              description: 'Please try again.',
              classNames: {
                toast: 'bg-slate-800 border-slate-700',
                title: 'text-slate-100',
                description: 'text-slate-400',
              },
            })
            console.error('Something went wrong deleting blog: ', error, id)
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    })
  }

  return (
    <>
      <div className="relative w-full h-screen">
        {/** Stats Overlay - Top Left */}
        <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              welcome back, Three.js Journey!
            </h2>
            <p className="text-sm text-gray-400">
              {stats.total} {stats.total === 1 ? 'article' : 'articles'} in
              total
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300">Want to Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.toRead}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-300">Reading</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.reading}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300">Read</span>
              </div>
              <span className="text-lg font-semibold text-white">
                {stats.read}
              </span>
            </div>
          </div>
        </div>

        {/** 3D component  */}
        <Experience onBookcaseClick={handleBookcaseClick} />

        {/** Blogs Overlay */}

        {selectedStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/** Backdrop */}
            <div
              className="absolute inset-0 bg-slate/80 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/** Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {getModalTitle()}
                </h2>

                <button
                  className="text-gray-400 hover:text-white text-2xl"
                  onClick={closeModal}
                >
                  <XIcon />
                </button>
              </div>
              <button
                className="bg-white mb-3 py-2 text-indigo-800/90 hover:text-indigo-900 hover:bg-gray-100 rounded-lg px-6"
                onClick={() => navigate({ to: '/logdemo' })}
              >
                + Add Article
              </button>
              {/** Empty State */}
              {filteredBlogs.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No books in this category yet
                </div>
              )}

              {/** Blogs Grid */}
              {filteredBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBlogs.map((blog: Blog) => (
                    <div
                      key={blog.id}
                      className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {blog.title}
                      </h3>
                      {blog.author && (
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          <span className="text-l font-semibold">Author: </span>
                          {blog.author}
                        </p>
                      )}
                      {blog.description && (
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          <span className="text-l font-semibold">
                            Description:{' '}
                          </span>
                          {blog.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {blog.notes && (
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                            <span className="text-l font-semibold">Notes:</span>{' '}
                            {blog.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        {blog.url && (
                          <>
                            <Link className="w-4 h-4 flex-shrink-0" />
                            <a
                              href={blog.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 hover:text-blue-200 text-sm hover:underline truncate"
                            >
                              {blog.url.length > 50
                                ? blog.url.substring(0, 50) + '...'
                                : blog.url}
                            </a>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3 mt-4 pt-4 border-t border-white/10 items-center">
                        <EditModal blog={blog} />
                        <div className="flex-1"></div>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className=" bg-amber-600/80 hover:bg-amber-500 text-white py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <Trash className="w-4 h-4" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
