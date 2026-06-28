import { createServerFn } from '@tanstack/react-start'
import sendEmail from '../email'

export const sendContactEmail = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { email: string; message: string; company: string | null }) => data,
  )
  .handler(async ({ data }) => {
    if (data.company) return { ok: true }
    const to = process.env.DEVELOPER_CONTACT
    if (!to) throw new Error('Contact address not configured')
    await sendEmail({
      to,
      subject: 'Cozy Capter - a 🐞 or 👋',
      html: `<p>From: ${data.email}</p>
<p>Message: ${data.message}</p>
`,
    })
    return { ok: true }
  })
