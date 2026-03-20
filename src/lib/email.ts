import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return resend.emails.send({
    from: 'Cozy Chapter <noreply@resend.com>',
    to,
    subject,
    html,
  })
}
