import { and, eq } from 'drizzle-orm'
import { courses } from '../schemas/course-schema'
import type { NewCourse } from '../schemas/course-schema'
import { db } from '@/db'

// create user course insert
export async function createCourse(
  course: Omit<NewCourse, 'id' | 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db.insert(courses).values(course).returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error saving course to db ${(error as Error).message}`)
    return { success: false, error }
  }
}

// get user course
export async function getCourses(userId: string) {
  try {
    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.userId, userId))
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error getting user courses: ${error as Error}`)
    return { success: false, error }
  }
}

export async function getCourseById(userId: string, id: string) {
  try {
    const result = await db
      .select()
      .from(courses)
      .where(and(eq(courses.userId, userId), eq(courses.id, id)))
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(`Error getting course by id ${(error as Error).message}`)
    return { success: false, error }
  }
}

type CourseUpdates = Partial<
  Omit<NewCourse, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
>

// update user course
export async function updateCourse(
  userId: string,
  courseId: string,
  updates: CourseUpdates,
) {
  try {
    const result = await db
      .update(courses)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error(
      `Error updating course with ${courseId} ${(error as Error).message}`,
    )
    return { success: false, error }
  }
}

// delete user course
export async function deleteCourse(userId: string, courseId: string) {
  try {
    const result = await db
      .delete(courses)
      .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    return { success: true, result }
  } catch (error) {
    console.error(
      `Error deleting course with id: ${courseId} ${(error as Error).message}`,
    )
    return { success: false, error }
  }
}
