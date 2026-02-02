import { UploadThingError, createUploadthing } from 'uploadthing/server'
import { getSessionServer } from '../utils'
import type { FileRouter } from 'uploadthing/server'

const f = createUploadthing()

const auth = (req: Request) => ({ id: 'fakeId' })

// FileRouter for app
export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // permissions fand file types for this FileRoute
    .middleware(async ({ req }) => {
      console.log('REQ: ', req)
      console.log('==== MIDDLEWARE STARTED ++++')
      try {
        const session = auth(req)
        console.log('Session from middleware: ', session)

        // Throwing an error means user cannot upload
        if (!session) throw new UploadThingError('Unauthorized')
        console.log('User stuff: ', session)
        return { userId: session }
      } catch (error) {
        console.warn('WE GOT AN ERROR: ', error)
        throw new Error('Error with session')
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Runs on console after upload
      console.log('Meta data: ', metadata)
      console.log('Upload complete for userId: ', metadata.userId)
      console.log('file url: ', file.ufsUrl)
      // Whatever is returned is sent to clientSide `onClientUploadComplete`

      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
