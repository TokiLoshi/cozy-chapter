import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { Courses } from '@/db/schemas/course-schema'
import { useAppForm } from '@/hooks/form'
import { updateCoursesServer } from '@/lib/server/courses'

export default function EditCoursesModal({
  course,
  refreshPath,
  onClose,
}: {
  course: Courses
  refreshPath: string
  onClose: () => void
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      title: course.title,
      author: course.author ?? '',
      description: course.description ?? '',
      platform: course.platform ?? '',
      category: course.category ?? '',
      url: course.url ?? '',
      priority: course.priority,
      progressCurrent: course.progressCurrent,
      progressTotal: course.progressTotal ?? '',
      progressUnit: course.progressUnit,
      estimatedMinutesRemaining: course.estimatedMinutesRemaining ?? '',
      notes: course.notes ?? '',
      startedAt: course.startedAt ?? '',
      finishedAt: course.finishedAt,
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.title.length === 0) {
          errors.fields.title = 'Title is required'
        }

        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating course..., ', {
        classNames: {
          toast: 'bg-slate-800 border-slate-700',
          title: 'text-slate-100',
        },
      })
      try {
        await updateCoursesServer({
          data: {
            id: course.id,
            updates: {
              title: value.title,
              author: value.author,
              description: value.description,
              platform: value.platform,
              category: value.category,
              url: value.url,
              priority: value.priority,
              progressCurrent:
                typeof value.progressCurrent == 'string'
                  ? parseInt(value.progressCurrent) || 0
                  : value.progressCurrent,
              progressTotal: value.progressTotal
                ? parseInt(String(value.progressTotal))
                : null,
              progressUnit: value.progressUnit,
              estimatedMinutesRemaining: value.estimatedMinutesRemaining
                ? parseInt(String(value.estimatedMinutesRemaining))
                : null,
              notes: value.notes,
              startedAt: value.startedAt ? new Date(value.startedAt) : null,
              finishedAt: value.finishedAt ? new Date(value.finishedAt) : null,
            },
          },
        })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        toast.dismiss(loadingToast)
        toast.success('Course updated successfully!', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        navigate({ to: refreshPath })
        onClose()
      } catch (error) {
        console.error(`Error updating course: ${(error as Error).message}`)
        toast.error('Failed to update course: ', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
            description: 'text-slate-400',
          },
        })
      }
    },
  })
  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        {/** Modal */}
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border border-slate-700 m-4">
          <div className="sticky top-0 bg-slate-800/95 border-b backdrop-blur-md border-slate-700/50 p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Course</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your course info here
                </p>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
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
            {/** Title */}
            <form.AppField name="title">
              {(field) => <field.TextField label="Title" />}
            </form.AppField>

            {/** Author */}
            <form.AppField name="author">
              {(field) => (
                <field.TextField label="Author" placeholder={'Course Author'} />
              )}
            </form.AppField>

            {/** Description */}
            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label="Description"
                  placeholder={'Course Description'}
                />
              )}
            </form.AppField>

            {/** Platform */}
            <form.AppField name="platform">
              {(field) => (
                <field.TextField
                  label="Platform"
                  placeholder={'Course Platform'}
                />
              )}
            </form.AppField>

            {/** Category */}
            <form.AppField name="category">
              {(field) => (
                <field.TextField
                  label="Category"
                  placeholder={'Course Category'}
                />
              )}
            </form.AppField>

            {/** URL */}
            <form.AppField name="url">
              {(field) => (
                <field.TextField label="URL" placeholder={'Course URL'} />
              )}
            </form.AppField>

            {/** Priority */}
            <form.AppField name="priority">
              {(field) => (
                <field.Select
                  label="Priority"
                  values={[
                    { label: 'High', value: 'high' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Low', value: 'low' },
                    { label: 'None', value: 'none' },
                  ]}
                />
              )}
            </form.AppField>

            {/** ProgressCurrent */}
            <form.AppField name="progressCurrent">
              {(field) => (
                <field.NumberField
                  label="progressCurrent"
                  placeholder={'Current Progress'}
                />
              )}
            </form.AppField>

            {/** ProgressUnit */}
            <form.AppField name="progressUnit">
              {(field) => <field.TextField label="ProgressUnit" />}
            </form.AppField>

            {/** ProgressTotal */}
            <form.AppField name="progressTotal">
              {(field) => (
                <field.NumberField
                  label="ProgressTotal"
                  placeholder={'Course Progress Total'}
                />
              )}
            </form.AppField>

            {/** EstimatedMinutesRemaining */}
            <form.AppField name="estimatedMinutesRemaining">
              {(field) => (
                <field.NumberField
                  label="EstimatedMinutesRemaining"
                  placeholder={'Course Estimated Minues Remaining'}
                />
              )}
            </form.AppField>

            {/** Date Started */}
            <form.AppField name="startedAt">
              {(field) => (
                <field.DateField
                  label="date course started"
                  placeholder={'Started At'}
                />
              )}
            </form.AppField>

            {/** Date Finished */}
            <form.AppField name="finishedAt">
              {(field) => (
                <field.DateField
                  label="date course finished"
                  placeholder={'Finished At'}
                />
              )}
            </form.AppField>

            {/** Notes */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="notes"
                  placeholder={'Add your thoughts here'}
                />
              )}
            </form.AppField>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Edit Course"
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
