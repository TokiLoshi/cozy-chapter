import { Edit, Laptop, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import EditCoursesModal from './EditCoursesModal'
import type { Courses } from '@/db/schemas/course-schema'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
} from '@/components/ExpandedCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SearchArea from '@/components/SearchArea'
import {
  createCourseServer,
  deleteCourseServer,
  getUserCoursesServer,
} from '@/lib/server/courses'

import { useAppForm } from '@/hooks/form'

type CourseFormProps = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

type CourseModal = {
  isOpen: boolean
  onClose: () => void
  refreshPath: string
}

function ExpandedCourseCard({
  item,
  onEdit,
  onDelete,
  onClose,
}: {
  item: Courses
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  return (
    <BaseModal onClose={onClose}>
      {/** Header */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-100 mb-1">
            {item.title}
          </h3>
          {item.category && (
            <p className="text-sm font-medium text-slate-200">
              {item.category}
            </p>
          )}
        </div>
      </div>
      {/** Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/** Author */}
        <DetailItem label="Author">
          <p className="text-sm font-medium text-slate-200">{item.author}</p>
        </DetailItem>

        {/** Platform */}
        {item.platform && (
          <DetailItem label="Platform">
            <p className="text-sm font-medium text-slate-200">
              {item.platform}
            </p>
          </DetailItem>
        )}

        {/** progressCurrent */}
        {item.progressCurrent && (
          <DetailItem label="Current Progress">
            <p className="text-sm font-medium text-slate-200">
              {item.progressCurrent}
            </p>
          </DetailItem>
        )}

        {/** progressTotal */}
        {item.progressTotal && (
          <DetailItem label="Total Volume">
            <p className="text-sm font-medium text-slate-200">
              {item.progressTotal}
            </p>
          </DetailItem>
        )}

        {/** progressUnit */}
        {item.progressUnit && (
          <DetailItem label="Progress Unit">
            <p className="text-sm font-medium text-slate-200">
              {item.progressUnit}
            </p>
          </DetailItem>
        )}

        {/** EstimatedMinutes remaining */}
        {item.progressTotal && (
          <DetailItem label="Estimated Time Remaining">
            <p className="text-sm font-medium text-slate-200">
              {item.progressTotal}
            </p>
          </DetailItem>
        )}

        {/** startedAt */}
        {item.startedAt && (
          <DetailItem label="Started learning at">
            <p className="text-sm font-medium text-slate-200">
              {item.startedAt.toLocaleString()}
            </p>
          </DetailItem>
        )}

        {/** url */}
        {item.url && (
          <DetailItem label="Link">
            <div className="mb-4">
              <a
                href={item.url}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-green-600"
              >
                <Laptop className="w-4 h-4" />
                Go do a lesson
              </a>
            </div>
            <p className="text-sm font-medium text-slate-200">{item.url}</p>
          </DetailItem>
        )}
      </div>
      {/** Notes */}
      {item.notes && (
        <DetailItem label="Notes">
          <p className="text-sm font-medium text-slate-200">{item.notes}</p>
        </DetailItem>
      )}

      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />

      {/** Overview */}
      {item.description && (
        <DisplayDescription description={item.description} />
      )}
    </BaseModal>
  )
}

function CourseCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Courses
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-3 p-3 bg-slate-700/50 text-white rounded-lg">
        <Laptop />
        {/** Title */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h4 className="font-medium text-slate-100 truncate">{item.title}</h4>
          <p className="text-sm text-slate-300 truncate">
            {item.description ?? 'No description provided'}
          </p>
          {/** Author */}
          <p className="text-sm text-slate">Author: {item.author}</p>
          {/** Category */}
          {item.category && <p className="text-slate-300">{item.category}</p>}
          {/** Progress Current */}
          <p className="text-slate-300">
            {/** Progress Total */}
            {item.progressCurrent} / {item.progressTotal ?? 'unknown total'}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="cursor-pointer bg-amber-600/80 hover:bg-amber-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="cursor-pointer bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  )
}

function EmptyTabContent({ message }: { message: string }) {
  return (
    <>
      <p className="text-slate-400 text-sm py-4 text-center">{message}</p>
    </>
  )
}

export default function CoursesModal({ isOpen, onClose }: CourseModal) {
  const [isAddOpen, setisAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Courses | null>(null)
  const [courseSearch, setCourseSearch] = useState('')
  const [expandedCourse, setExpandedCourse] = useState<Courses | null>(null)
  const queryClient = useQueryClient()

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const result = await getUserCoursesServer()
      return result ?? []
    },
  })
  const closeModal = () => {
    onClose()
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourseServer({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Course deleted')
    },
    onError: () => {
      toast.error('Failed to delete course')
    },
  })

  const handleDelete = (id: string) => {
    toast('Are you sure you want to delete this course', {
      action: {
        label: 'Remove',
        onClick: () => deleteMutation.mutate(id),
      },
      cancel: {
        label: 'cancel',
        onClick: () => {},
      },
    })
  }

  const handleEdit = (item: Courses) => {
    setExpandedCourse(item)
    setCourseToEdit(item)
    setIsEditOpen(true)
  }

  const handleCardClick = (item: Courses) => {
    setExpandedCourse(item)
  }

  const filteredCourses = useMemo(() => {
    if (!courses) return []

    const searchTerm = courseSearch.trim().toLowerCase()

    const filtered = searchTerm
      ? courses.filter((course) =>
          course.title.toLowerCase().includes(searchTerm),
        )
      : courses

    return filtered
  }, [courses, courseSearch])
  const refreshPath = '/readingroom'

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/** Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
          onClick={closeModal}
        />
        {/** Edit Modal */}
        {isEditOpen && courseToEdit && (
          <EditCoursesModal
            course={courseToEdit}
            refreshPath="/readingroom"
            onClose={() => {
              setIsEditOpen(false)
              setCourseToEdit(null)
            }}
          />
        )}
        {expandedCourse && (
          <ExpandedCourseCard
            item={expandedCourse}
            onEdit={() => handleEdit(expandedCourse)}
            onDelete={() => handleDelete(expandedCourse.id)}
            onClose={() => setExpandedCourse(null)}
          />
        )}

        {/** Modal */}
        {!isEditOpen && !expandedCourse && (
          <div className="relative w-full z-[60] max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 rounded-xl shadow-2xl border-slate-700 m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Courses</h2>
              <button
                className="cursor-pointer text-gray-400 hover:text-white text-2xl"
                onClick={closeModal}
              >
                <XIcon />
              </button>
            </div>
            <button
              className="bg-white mb-3 py-2 text-indigo-800/90 hover:text-indigo-700 hover:bg-gray-100 cursor-pointer rounded-lg px-6"
              onClick={() => {
                setisAddOpen(true)
              }}
            >
              + Add Course
            </button>
            {/** Course Form */}
            {isAddOpen && (
              <CourseForm
                isOpen={true}
                onClose={() => setisAddOpen(false)}
                refreshPath={refreshPath}
              />
            )}

            {/** Search */}
            <div className="pt-4">
              <h3 className="text-sm font-medium text-slate-400 mb-3">
                What are we learning today?
              </h3>
              {/** Empty State */}
              {courses?.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  No courses added to inventory yet, star
                </div>
              )}
              <SearchArea value={courseSearch} onChange={setCourseSearch} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {filteredCourses.length === 0 && courseSearch ? (
                <EmptyTabContent message="No courses match your search" />
              ) : (
                filteredCourses.map((item: Courses) => (
                  <div
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => handleCardClick(item)}
                  >
                    <CourseCard
                      item={item}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CourseForm({ isOpen, onClose, refreshPath }: CourseFormProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useAppForm({
    defaultValues: {
      title: '',
      author: '',
      description: '',
      platform: '',
      category: '',
      url: '',
      priority: 'none' as 'high' | 'medium' | 'low' | 'none',
      progressCurrent: '',
      progressTotal: '',
      progressUnit: '',
      estimatedMinutesRemaining: '',
      notes: '',
      startedAt: null as Date | null,
      finishedAt: null as Date | null,
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        // title required
        if (value.title.length === 0) {
          errors.fields.title = 'Title required'
        }
        // progress unit required
        if (value.progressUnit.length === 0) {
          errors.fields.progressUnite =
            'progess units required, please select video or text or lessons'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await createCourseServer({
          data: {
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
            startedAt: value.startedAt,
          },
        })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        toast.success('Course added successfully', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
      } catch (error) {
        console.error('Something went wrong: ', error)
        toast.error('Failed to add course', {
          classNames: {
            toast: 'bg-slate-800 border-slate-700',
            title: 'text-slate-100',
          },
        })
        onClose()
        navigate({ to: refreshPath })
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
                  Add a new course
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  What will you learn next?
                </p>
              </div>
              <button
                className="cursor-pointer text pointer text-white hover:bg-white/10 rounded-md"
                onClick={onClose}
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
              {(field) => (
                <field.TextField label="Title" placeholder="Course Title" />
              )}
            </form.AppField>

            {/** Author */}
            <form.AppField name="author">
              {(field) => (
                <field.TextField label="Author" placeholder="Course Author" />
              )}
            </form.AppField>

            {/** Description */}
            <form.AppField name="description">
              {(field) => (
                <field.TextField
                  label="Description"
                  placeholder="Course Description"
                />
              )}
            </form.AppField>

            {/** Platform */}
            <form.AppField name="platform">
              {(field) => (
                <field.TextField
                  label="Platform"
                  placeholder="Course Platform"
                />
              )}
            </form.AppField>

            {/** Category */}
            <form.AppField name="category">
              {(field) => (
                <field.TextField
                  label="Category"
                  placeholder="Course Category"
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
                  placeholder="Select status"
                />
              )}
            </form.AppField>

            {/** ProgressCurrent */}
            <form.AppField name="progressCurrent">
              {(field) => (
                <field.NumberField
                  label="progressCurrent"
                  placeholder="Course ProgressCurrent"
                />
              )}
            </form.AppField>

            {/** ProgressUnit */}
            <form.AppField name="progressUnit">
              {(field) => (
                <field.TextField
                  label="ProgressUnit"
                  placeholder="Course ProgressUnit"
                />
              )}
            </form.AppField>

            {/** ProgressTotal */}
            <form.AppField name="progressTotal">
              {(field) => (
                <field.NumberField
                  label="ProgressTotal"
                  placeholder="Course Progress Total"
                />
              )}
            </form.AppField>

            {/** EstimatedMinutesRemaining */}
            <form.AppField name="estimatedMinutesRemaining">
              {(field) => (
                <field.NumberField
                  label="EstimatedMinutesRemaining"
                  placeholder="Course Estimated Minues Remaining"
                />
              )}
            </form.AppField>

            {/** Date Started */}
            <form.AppField name="startedAt">
              {(field) => (
                <field.DateField
                  label="date course started"
                  placeholder="today"
                />
              )}
            </form.AppField>

            {/** Notes */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextField
                  label="notes"
                  placeholder="add your thoughts here"
                />
              )}
            </form.AppField>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Add Course"
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
