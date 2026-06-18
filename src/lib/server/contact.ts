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

export const inviteHousehold = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      emailTo: string
      username: string
      code: string
      messageFrom: string
    }) => data,
  )
  .handler(async ({ data }) => {
    await sendEmail({
      to: data.emailTo,
      subject: `Cozy Chapter - ${data.username} has invited you to their cozy space`,
      html: `<p>From: ${data.messageFrom}<p>
    <p>${data.username} is inviting you to join their household so you can look after your plants together</p>
    <p>Copy and paste this code to accept:  </p>
    <p>${data.code}</p>
    <button><a>https://https://cozy-chapter.netlify.app/household/${data.code}</a></button>
    <p>This invite will expire in 48 hours</p>`,
    })
  })
