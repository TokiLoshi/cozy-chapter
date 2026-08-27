import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { Courses } from '@/db/schemas/course-schema'
import { useAppForm } from '@/hooks/form'
import { updateCoursesServer } from '@/lib/server/courses'
import { panelStyles } from '@/lib/panelStyles'

export default function EditCoursesModal({
  course,
  onClose,
}: {
  course: Courses
  refreshPath: string
  onClose: () => void
}) {
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
      progressCurrent: String(course.progressCurrent),
      progressTotal: course.progressTotal?.toString() ?? '',
      progressUnit: course.progressUnit,
      estimatedMinutesRemaining:
        course.estimatedMinutesRemaining?.toString() ?? '',
      notes: course.notes ?? '',
      startedAt: course.startedAt ?? '',
      finishedAt: course.finishedAt,
    },
    validators: {
      onChange: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.title.length === 0) {
          errors.fields.title = 'Title is required'
        }
        if (value.progressTotal && value.progressCurrent) {
          if (parseInt(value.progressCurrent) > parseInt(value.progressTotal)) {
            errors.fields.progressCurrent =
              'Current progress cannot exceed total progress'
          }
        }
        if (value.progressCurrent) {
          if (parseInt(value.progressCurrent) < 0) {
            errors.fields.progressCurrent = "Progress can't be negative"
          }
        }
        if (value.progressTotal) {
          if (parseInt(value.progressTotal) < 0) {
            errors.fields.progressTotal =
              "Total progress possible can't be negative"
          }
        }

        return errors
      },
    },
    onSubmit: async ({ value }) => {
      const loadingToast = toast.loading('Updating course...', {
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
              progressCurrent: value.progressCurrent
                ? parseInt(value.progressCurrent)
                : 0,
              progressTotal: value.progressTotal
                ? parseInt(value.progressTotal)
                : null,
              progressUnit: value.progressUnit,
              estimatedMinutesRemaining: value.estimatedMinutesRemaining
                ? parseInt(value.estimatedMinutesRemaining)
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
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div className={panelStyles.backdrop} onClick={onClose} />
        {/** Modal */}
        <div
          className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
        >
          <div className={`${panelStyles.header}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Course</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Update your course info here
                </p>
              </div>
              <button
                onClick={() => onClose()}
                className="cursor-pointer text-white hover:bg-white/10 rounded-md"
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
                <field.TextField label="Author" placeholder="Course author" />
              )}
            </form.AppField>

            {/** Description */}
            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label="Description"
                  placeholder="Course description"
                />
              )}
            </form.AppField>

            {/** Platform */}
            <form.AppField name="platform">
              {(field) => (
                <field.TextField
                  label="Platform"
                  placeholder="Course platform"
                />
              )}
            </form.AppField>

            {/** Category */}
            <form.AppField name="category">
              {(field) => (
                <field.TextField
                  label="Category"
                  placeholder="Course category"
                />
              )}
            </form.AppField>

            {/** URL */}
            <form.AppField name="url">
              {(field) => (
                <field.TextField label="URL" placeholder="Course URL" />
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
                  label="Current Progress"
                  placeholder="Current progress"
                  min={0}
                />
              )}
            </form.AppField>

            {/** ProgressUnit */}
            <form.AppField name="progressUnit">
              {(field) => (
                <field.Select
                  label="Progress Unit"
                  values={[
                    { label: 'Videos', value: 'videos' },
                    { label: 'Lessons', value: 'lessons' },
                    { label: 'Chapters', value: 'chapters' },
                  ]}
                  placeholder="How is progress measured?"
                />
              )}
            </form.AppField>

            {/** ProgressTotal */}
            <form.AppField name="progressTotal">
              {(field) => (
                <field.NumberField
                  label="Total Progress"
                  placeholder={'Course Progress Total'}
                  min={0}
                />
              )}
            </form.AppField>

            {/** EstimatedMinutesRemaining */}
            <form.AppField name="estimatedMinutesRemaining">
              {(field) => (
                <field.NumberField
                  label="Estimated Minutes Remaining"
                  placeholder={'Course Estimated Minutes Remaining'}
                  min={0}
                />
              )}
            </form.AppField>

            {/** Date Started */}
            <form.AppField name="startedAt">
              {(field) => (
                <field.DateField
                  label="Date Course Started"
                  placeholder={'Started At'}
                />
              )}
            </form.AppField>

            {/** Date Finished */}
            <form.AppField name="finishedAt">
              {(field) => (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <field.DateField
                      label="Date Course Finished"
                      placeholder={'Finished At'}
                    />
                    {field.state.value && (
                      <button
                        type="button"
                        onClick={() => field.handleChange(null)}
                        className="cursor-pointer mt-2 mb-2 px-3 py-2 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                      >
                        Reset Date
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form.AppField>

            {/** Notes */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextArea
                  label="Notes"
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
