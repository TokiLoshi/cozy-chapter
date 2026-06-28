// invite user to join household
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import sendEmail from '../email'
import { auth } from '@/lib/auth'
import {
  createHousehold,
  createInvite,
  getHouseholdMembers,
  getInviteStatus,
  getMembershipByUser,
} from '@/db/queries/household'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const inviteHousehold = createServerFn({ method: 'POST' })
  .inputValidator((data: { emailTo: string; householdName: string }) => data)
  .handler(async ({ data }) => {
    // get current user from session
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id

    const hasHousehold = await getMembershipByUser(userId)

    // if they're not in a household they can join one
    let householdId
    if (!hasHousehold.data) {
      // they should join one
      const newHousehold = await createHousehold({
        userId: userId,
        name: data.householdName,
      })
      if (!newHousehold.success || !newHousehold.data) {
        throw new Error('could not create new household')
      }
      householdId = newHousehold.data.household.id
    } else {
      householdId = hasHousehold.data.householdId
      // Check if someone else is already in the household
      const existingHousehold = await getHouseholdMembers(householdId)
      // If there is already someone in the household return error to client
      if (existingHousehold.members && existingHousehold.members.length > 1) {
        throw new Error('Household is full')
      }
      // If invite is pending can't send new invite
      const inviteStatus = await getInviteStatus(householdId)
      if (inviteStatus.data && inviteStatus.data.status === 'pending') {
        throw new Error('Invite is pending')
      }
    }

    // Sender details
    const senderEmail = session.user.email
    const senderUsername = session.user.name
    const randomCode = crypto.randomUUID()

    const invited = await createInvite(
      householdId,
      userId,
      data.emailTo,
      randomCode,
    )
    if (!invited.success) {
      throw new Error(`User could not be invited: ${invited.error}`)
    }

    await sendEmail({
      to: data.emailTo,
      subject: `Cozy Chapter - ${senderUsername} has invited you to their cozy space`,
      html: `<p>From: ${senderEmail}<p>
    <p>${senderUsername} is inviting you to join their household so you can look after your plants together</p>
    <p>Copy and paste this code to accept:  </p>
    <p>${randomCode}</p>
    <p><a>https://cozy-chapter.netlify.app/household/${randomCode}</a></p>
    <p>This invite will expire in 48 hours</p>`,
    })
  })

// Accept invite
export const acceptInvite = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { username: string; code: string; userId: string }) => data,
  )
  .handler(async ({ data }) => {
    console.log('DATA placeholder: ', data)
    // look up user by username and id
    // validate token exists
    // validate token is still valid
    // if enough time has passed that token should not be valid invalidate
    // return message to user
    // if token is still valid add user to household
    // update the invite status
    // show success message to user that they have joined the household
    // send email notification to owner (user inviting) that username has joined their household
  })

// invalidate
export const declineInvite = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { username: string; userId: string; code: string }) => data,
  )
  .handler(async ({ data }) => {
    // look up user by username and id
    // validate token exists and is valid
    // invalidate token and update status
    // show success message to user the invite has been decline
    // send notification to owner / inviting user that user declined to join household
  })

// leave household
export const leaveHousehold = createServerFn({ method: 'POST' })
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    // get householdId
    // leave household
  })
