import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../auth'
import type { Books, UserBooks } from '@/db/schemas/book-schema'
import {
  createUserBook,
  deleteUserBook,
  getUserBooks,
  updateUserBook,
  upsertBook,
} from '@/db/queries/books'

// Session to ensure user is authenticated
const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

// CRUD server actions
export const addBook = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      book: Omit<Books, 'createdAt' | 'updatedAt'>
      status?: 'toRead' | 'reading' | 'read'
    }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const bookResult = await upsertBook(data.book)

    if (!bookResult.success) {
      throw new Error(`Failed to save book`)
    }

    const userBookResult = await createUserBook({
      userId: session.user.id,
      bookId: data.book.id,
      status: data.status ?? 'toRead',
      pageCount: data.book.pageCount,
    })
    if (!userBookResult.success) {
      throw new Error(`Faailed to save user book`)
    }
    return userBookResult.data
  })

export const deleteUserBookServer = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const deletedBook = await deleteUserBook(session.user.id, data)
    if (!deletedBook.success) {
      throw new Error(`Error deleting user book`)
    }
    return { success: true, id: data }
  })

export const getUserBookServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const userBookResult = await getUserBooks(session.user.id)
    if (!userBookResult.success) {
      throw new Error(`Failed to find users's books`)
    }

    return userBookResult.data
  },
)

export const searchBooks = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error('Failed to search google books')
    }

    const data = await response.json()

    if (!data.items) {
      return []
    }
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo?.title ?? 'Unknown title',
      subtitle: item.volumeInfo?.subtitle,
      description: item.volumeInfo?.description,
      authors: item.volumeInfo?.authors ?? [],
      publisher: item.volumeInfo?.publisher,
      publishedDate: item.volumeInfo?.publishedDate,
      pageCount: item.volumeInfo?.pageCount,
      categories: item.volumeInfo?.categories ?? [],
      coverImageUrl: item.volumeInfo?.imageLinks?.thumbnail?.replace(
        'http:',
        'https:',
      ),
      previewLink: item.volumeInfo?.previewLink,
    }))
  })

export const updateUserBookServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      id: string
      updates: Partial<UserBooks>
      bookPageCount?: number | null
    }) => data,
  )
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    const updatedBook = await updateUserBook(
      data.id,
      session.user.id,
      data.updates,
      data.bookPageCount,
    )
    if (!updatedBook.success) {
      throw new Error(`Error updating users books`)
    }

    return updatedBook.data
  })
