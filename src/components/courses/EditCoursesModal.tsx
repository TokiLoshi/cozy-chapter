import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { NewCourse } from '@/db/schemas/course-schema'
import { useAppForm } from '@/hooks/form'
import { updateCoursesServer } from '@/lib/server/courses'

export default function EditCoursesModal({
  course,
  refreshPath,
  onClose,
}: {
  course: NewCourse
  refreshPath: string
  onClose: () => void
}) {
  console.log('Edit courses modal')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const form = useAppForm({
    defaultValues: {
      title: course.title,
    },
  })
  return (
    <>
      <div>
        <h1>Edit course modal will go here</h1>
      </div>
    </>
  )
}
