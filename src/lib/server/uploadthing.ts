import { UploadThingError, createUploadthing } from 'uploadthing/server'
import { getSessionServer } from '../utils'
import type { FileRouter } from 'uploadthing/server'

const f = createUploadthing()

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
      const session = await getSessionServer()
      console.log('REQ: ', req)
      // Throwing an error means user cannot upload
      if (!session) throw new UploadThingError('Unauthorized')
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Runs on console after upload
      console.log('Upload complete for userId: ', metadata.userId)
      console.log('file url: ', file.ufsUrl)
      // Whatever is returned is sent to clientSide `onClientUploadComplete`

      return { uploadedBy: metadata.userId, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
