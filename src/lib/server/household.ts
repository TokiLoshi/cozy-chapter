// invite user to join household
import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getRequest } from '@tanstack/react-start/server'
import sendEmail from '../email'
import { auth } from '@/lib/auth'
import {
  addHouseholdMember,
  createHousehold,
  createInvite,
  declineInviteByToken,
  getHouseholdMembers,
  getInviteStatus,
  getMembershipByUser,
  getUserEmail,
  leaveHouseholdById,
} from '@/db/queries/household'

const getSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequest().headers })
  return session
})

export const getHouseholdState = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const membership = await getMembershipByUser(userId)
    if (!membership.data) {
      return { status: 'solo' as const }
    }
    const householdId = membership.data.householdId
    const members = await getHouseholdMembers(householdId)
    const memberCount = members.members?.length ?? 0
    if (memberCount === 2) {
      const housemate = members.members?.find((user) => user.userId !== userId)
      return {
        status: 'shared' as const,
        householdId,
        role: membership.data.role,
        housemate: housemate ? { name: housemate.name } : null,
      }
    }
    const invite = await getInviteStatus(householdId)
    if (invite.data && invite.data.status === 'pending') {
      return {
        status: 'pending' as const,
        householdId,
        invitedEmail: invite.data.email,
      }
    }
    return { status: 'solo' as const, householdId }
  },
)

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
    <p><a href="https://cozy-chapter.netlify.app/household/${randomCode}">Accept invite</a></p>
    <p>This invite will expire in 48 hours</p>`,
    })
  })

// Accept invite
export const acceptInvite = createServerFn({ method: 'POST' })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    // look up user by username and id
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const userId = session.user.id
    const token = data.code
    const result = await addHouseholdMember(userId, token)
    if (!result.success || !result.data) {
      throw new Error(
        `Couldn't add user to houehold: ${result.error ?? result.message}`,
      )
    }
    const owner = await getUserEmail(result.data.invitedBy)

    // send email notification to owner (user inviting) that username has joined their household
    if (owner.success && owner.data) {
      await sendEmail({
        to: owner.data.email,
        subject: `Cozy Chapter - ${session.user.name} has joined your cozy space`,
        html: `
    <p>Hi ${owner.data.name} congrats on your new housemate! Now you can water your plants together</p>
    <p>Take a look at your extra cozy space with your household</p>
   
    <p><a href="https://cozy-chapter.netlify.app/readingroom">Get Cozy</a></p>`,
      })
    }

    // show success message to user that they have joined the household
    return {
      success: true,
      message: "You've successfully joined your household",
    }
  })

// invalidate
export const declineInvite = createServerFn({ method: 'POST' })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }) => {
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })

    // invalidate token and update status
    const declined = await declineInviteByToken(data.code)
    if (!declined.success || !declined.data) {
      throw new Error(`Couldn't decline invite: ${declined.error}`)
    }

    // send notification to owner / inviting user that user declined to join household
    const owner = await getUserEmail(declined.data.invitedBy)
    if (owner.success && owner.data) {
      await sendEmail({
        to: owner.data.email,
        subject: `Cozy Chapter - ${session.user.name} has declined your invite`,
        html: `
    <p>Hi ${owner.data.name}</p>
    <p>Your invite was declined but you can always invite someone else. Your cozy household remains intact.</p>
   
    <p><a href="https://cozy-chapter.netlify.app/readingroom">Get Cozy</a></p>`,
      })
    }
    // show success message to user the invite has been decline
    return {
      success: true,
      message: 'You have successfully declined this invite',
    }
  })

// leave household
export const leaveHousehold = createServerFn({ method: 'POST' }).handler(
  async () => {
    // user and get householdId
    const session = await getSessionServer()
    if (!session) throw redirect({ to: '/login' })
    const household = await getMembershipByUser(session.user.id)
    if (!household.success || !household.data) {
      throw new Error(`Failed to get household: ${household.error}`)
    }
    const successfullyLeft = await leaveHouseholdById(
      household.data.householdId,
      session.user.id,
    )
    if (!successfullyLeft.success) {
      throw new Error('Something went wrong trying to leave household')
    }
    // leave household
    return { success: true, message: 'Successfully left the household' }
  },
)
