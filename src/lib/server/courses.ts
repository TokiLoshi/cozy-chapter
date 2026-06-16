import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../auth'
import type { Courses, NewCourse } from '@/db/schemas/course-schema'
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from '@/db/queries/courses'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const createCourseServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Omit<NewCourse, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await createCourse({ ...data, userId: session.user.id })
    if (!result.success) {
      throw new Error('Failed to create course')
    }
    return result.data
  })

export const getUserCoursesServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await getCourses(session.user.id)
    if (!result.success) {
      throw new Error(`Failed to get courses for user: ${session.user.name}`)
    }
    return result.data
  },
)

export const getSingleCourseServer = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await getCourseById(session.user.id, data.id)
    if (!result.success) {
      throw new Error(`Failed to get single course for user: ${result.error}`)
    }
    return result.data
  })

type CourseUpdates = Partial<
  Omit<Courses, 'userId' | 'createdAt' | 'updatedAt'>
>

export const updateCoursesServer = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: CourseUpdates }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const currentCourse = await getCourseById(session.user.id, data.id)
    if (!currentCourse.success) {
      throw new Error("This course doesn't exist")
    }

    const isFinishing = !!data.updates.finishedAt

    const finalUpdates: CourseUpdates = { ...data.updates }
    if (isFinishing) {
      finalUpdates.priority = 'none'
      finalUpdates.finishedAt = new Date()
    }

    const result = await updateCourse(session.user.id, data.id, finalUpdates)
    if (!result.success) {
      throw new Error(`Error updating course: ${result.error}`)
    }
    return { success: true }
  })

export const deleteCourseServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const result = await deleteCourse(session.user.id, data)
    if (!result.success) {
      throw new Error(`Error deleting course ${result.error}`)
    }
    return { success: true }
  })
