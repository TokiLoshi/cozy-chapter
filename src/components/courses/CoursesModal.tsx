import { Edit, Laptop, Trash, XIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import EditCoursesModal from './EditCoursesModal'
import type { Courses } from '@/db/schemas/course-schema'
import {
  BaseModal,
  DetailItem,
  DisplayActions,
  DisplayDescription,
  DisplayNotes,
} from '@/components/ExpandedCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SearchArea from '@/components/SearchArea'
import {
  createCourseServer,
  deleteCourseServer,
  getUserCoursesServer,
} from '@/lib/server/courses'
import { panelStyles } from '@/lib/panelStyles'

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
        {item.author && (
          <DetailItem label="Author">
            <p className="text-sm font-medium text-slate-200">{item.author}</p>
          </DetailItem>
        )}

        {/** Platform */}
        {item.platform && (
          <DetailItem label="Platform">
            <p className="text-sm font-medium text-slate-200">
              {item.platform}
            </p>
          </DetailItem>
        )}

        {/** progressCurrent */}
        {item.progressCurrent > 0 && (
          <DetailItem label="Current Progress">
            <p className="text-sm font-medium text-slate-200">
              {item.progressCurrent} {item.progressUnit}
            </p>
          </DetailItem>
        )}

        {/** progressTotal */}
        {(item.progressTotal ?? 0) > 0 && (
          <DetailItem label="Total Progress">
            <p className="text-sm font-medium text-slate-200">
              {item.progressTotal} {item.progressUnit}
            </p>
          </DetailItem>
        )}

        {/** EstimatedMinutes remaining */}
        {item.estimatedMinutesRemaining && (
          <DetailItem label="Estimated Time Remaining">
            <p className="text-sm font-medium text-slate-200">
              {item.estimatedMinutesRemaining} min
            </p>
          </DetailItem>
        )}

        {/** startedAt */}
        {item.startedAt && (
          <DetailItem label="Started learning at">
            <p className="text-sm font-medium text-slate-200">
              {item.startedAt.toLocaleDateString()}
            </p>
          </DetailItem>
        )}
      </div>

      {/** Overview */}
      {item.description && (
        <DisplayDescription description={item.description} />
      )}
      {/** Notes */}
      {item.notes && <DisplayNotes description={item.notes} />}

      {/** url */}
      {item.url && (
        <DetailItem label="Go do a Lesson">
          <div className="mb-4 flex justify-center mt-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-centeritems-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors bg-amber-600 hover:bg-amber-500"
            >
              <Laptop className="w-4 h-4 mt-1 text-amber-300" />
              Start
            </a>
          </div>
        </DetailItem>
      )}
      {/** Actions */}
      <DisplayActions onEdit={onEdit} onDelete={onDelete} onClose={onClose} />
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
  const priorityColor = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-300/30',
    low: 'bg-emerald-500/20 text-emerald-300 border-emerald-300/30',
    none: 'bg-slate-600/30 text-slate-400 border-slate-600/40',
  }

  const pct =
    item.progressCurrent && item.progressTotal
      ? Math.min(
          100,
          Math.round((item.progressCurrent / item.progressTotal) * 100),
        )
      : null
  return (
    <>
      <div className="flex items-start gap-3 p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all duration-200 text-white">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Laptop className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/** Title */}
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-100 ">{item.title}</h4>

            {/** Priority */}
            <span
              className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${priorityColor[item.priority]}`}
            >
              {item.priority}
            </span>
          </div>

          {/** Description */}
          {item.description && (
            <p className="text-sm text-slate-400 truncate">
              {item.description}
            </p>
          )}

          {/** Author */}
          {item.author && (
            <p className="text-sm text-slate-400">Author: {item.author}</p>
          )}

          {/** Category */}
          {item.category && <p className="text-slate-400">{item.category}</p>}

          {/** Progress  */}
          {pct !== null ? (
            <div className="mt-1.5">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>
                  {item.progressCurrent} / {item.progressTotal}{' '}
                  {item.progressUnit ? item.progressUnit : ''}
                </span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {item.progressCurrent && item.progressTotal && (
                <p className="text-xs text-slate-500 mt-1">
                  {item.progressCurrent} / {item.progressTotal}
                </p>
              )}
            </>
          )}
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
            className="cursor-pointer bg-red-500/80 hover:bg-red-400 text-white p-2 rounded-lg transition-all duration-200"
          >
            <Trash className="w-4 h-4" />
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

function CourseGrid({
  items,
  onCardClick,
  onEdit,
  onDelete,
  emptyMessage,
}: {
  items: Array<Courses>
  onCardClick: (i: Courses) => void
  onEdit: (i: Courses) => void
  onDelete: (i: string) => void
  emptyMessage: string
}) {
  if (items.length === 0) return <EmptyTabContent message={emptyMessage} />
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer"
            onClick={() => onCardClick(item)}
          >
            <CourseCard
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default function CoursesModal({ isOpen, onClose }: CourseModal) {
  const [isAddOpen, setisAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [courseToEdit, setCourseToEdit] = useState<Courses | null>(null)
  const [courseSearch, setCourseSearch] = useState('')
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null)
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
  const expandedCourse =
    courses?.find((course) => course.id === expandedCourseId) ?? null
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
    setExpandedCourseId(null)
    setCourseToEdit(item)
    setIsEditOpen(true)
  }

  const handleCardClick = (item: Courses) => {
    setExpandedCourseId(item.id)
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

  const byPriority = useMemo(() => {
    const base = filteredCourses
    const group = (p: string) => base.filter((c) => c.priority === p)
    return {
      high: group('high'),
      medium: group('medium'),
      low: group('low'),
      none: group('none'),
    }
  }, [filteredCourses])

  const refreshPath = '/readingroom'

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/** Backdrop */}
        <div className={`${panelStyles.backdrop}`} onClick={closeModal} />
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
            onClose={() => setExpandedCourseId(null)}
          />
        )}

        {/** Modal */}
        {!isEditOpen && !expandedCourse && (
          <div
            className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
          >
            <div className={`${panelStyles.header}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Courses</h2>
                <button
                  className="cursor-pointer text-gray-400 hover:text-white text-2xl"
                  onClick={closeModal}
                >
                  <XIcon />
                </button>
              </div>
            </div>
            <div className="p-6">
              <button
                className="mb-3 py-2 px-6 rounded-lg cursor-pointer bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
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
                    No courses added to inventory yet
                  </div>
                )}
                <SearchArea value={courseSearch} onChange={setCourseSearch} />
              </div>
              <Tabs defaultValue="high" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                  <TabsTrigger
                    value="high"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    <span>High</span>
                    <span className="hidden sm:inline">
                      {byPriority.high.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="medium"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    <span>Medium </span>
                    <span className="hidden sm:inline">
                      {byPriority.medium.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="low"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    <span>Low</span>
                    <span className="hidden sm:inline">
                      {byPriority.low.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="none"
                    className="cursor-pointer data-[state=active]:bg-amber-600 text-slate-200"
                  >
                    <span>None</span>
                    <span className="hidden sm:inline">
                      {byPriority.none.length}
                    </span>
                  </TabsTrigger>
                </TabsList>
                {(['high', 'medium', 'low', 'none'] as const).map((p) => (
                  <TabsContent key={p} value={p} className="mt-4">
                    <CourseGrid
                      items={byPriority[p]}
                      onCardClick={handleCardClick}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      emptyMessage={
                        courseSearch
                          ? 'No courses match your search'
                          : 'Nothing added to courses yet'
                      }
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function CourseForm({ isOpen, onClose }: CourseFormProps) {
  const queryClient = useQueryClient()
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
      onChange: ({ value }) => {
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
          errors.fields.progressUnit =
            'Progress units required, please select video, lessons or chapters.'
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
          if (parseInt(value.progressTotal) > 0) {
            errors.fields.progressCurrent =
              "Total progress possible can't be negative"
          }
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
      }
    },
  })
  if (!isOpen) return null
  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className={panelStyles.backdrop} onClick={onClose} />
        <div
          className={`relative w-full max-w-2xl max-h-[85dvh] overflow-y-auto ${panelStyles.container}`}
        >
          <div className={panelStyles.header}>
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
                className="cursor-pointer text-white hover:bg-white/10 rounded-md"
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
                  label="Current Progress"
                  placeholder="Current Progress"
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
                  label="Progress Total"
                  placeholder="Course Progress"
                />
              )}
            </form.AppField>

            {/** EstimatedMinutesRemaining */}
            <form.AppField name="estimatedMinutesRemaining">
              {(field) => (
                <field.NumberField
                  label="Estimated Minutes Remaining"
                  placeholder="Course Estimated Minutes Remaining"
                />
              )}
            </form.AppField>

            {/** Date Started */}
            <form.AppField name="startedAt">
              {(field) => (
                <field.DateField
                  label="Date Course Started"
                  placeholder="today"
                />
              )}
            </form.AppField>

            {/** Notes */}
            <form.AppField name="notes">
              {(field) => (
                <field.TextArea
                  label="Notes"
                  placeholder="Add your thoughts here"
                />
              )}
            </form.AppField>

            <div className="flex justify-end">
              <form.AppForm>
                <form.SubmitButton
                  label="Add Course"
                  className="cursor-pointer bg-amber-600/90 ps-2 pe-2 hover:bg-amber-500/90 p-2 w-25 font-semibold"
                />
              </form.AppForm>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
