import { UploadThingError, createUploadthing } from 'uploadthing/server'
import type { FileRouter } from 'uploadthing/server'

const f = createUploadthing()

// TODO wire up correct authentication
const auth = (req: Request) => ({ id: 'fakeId' }) // Fake auth function
console.log('Ran auth with: ', auth)

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
      console.log('Hit middleware')
      // This code runs on your server before upload
      const user = await auth(req)
      console.log('User: ', user)

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line
      if (!user) throw new UploadThingError('Unauthorized')
      console.log('User id: ', user.id)
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.ufsUrl)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
