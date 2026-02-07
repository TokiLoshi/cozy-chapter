import { UTApi, UploadThingError, createUploadthing } from 'uploadthing/server'
import { getSessionServer } from '../utils'
import type { FileRouter } from 'uploadthing/server'

const f = createUploadthing()
const utapi = new UTApi()

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await getSessionServer()

      // If you throw, the user will not be able to upload
      if (!user) {
        throw new UploadThingError('Unauthorized')
      }
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.session.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log('Upload complete for userId:', metadata.userId)

      // console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, url: file.ufsUrl, key: file.key }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter

export async function deleteUploadedImage(fileKey: string) {
  try {
    await utapi.deleteFiles(fileKey)
    return { success: true }
  } catch (error) {
    console.error('Error deleting image: ', error)
    return { success: false }
  }
}
