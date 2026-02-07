import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'

export const Route = createFileRoute('/testupload')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h2>Upload a Photo</h2>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          toast.success('upload to uploadthing complete')
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`)
        }}
      />
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          toast.success('upload to uploadthing complete')
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`)
        }}
      />
    </div>
  )
}
