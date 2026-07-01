import { and, desc, eq, ne } from 'drizzle-orm'
import { user } from 'auth-schema'
import {
  household,
  householdInvite,
  householdMember,
} from '../schemas/household-schema'
import { userPlants } from '../schemas/plant-schema'
import { detachPlantsFromHousehold } from './plants'
import { db } from '@/db'

// Create a household
export async function createHousehold(input: { userId: string; name: string }) {
  try {
    // Check if household exists
    const existing = await getMembershipByUser(input.userId)
    if (existing.data) {
      return { success: false, message: 'User already belongs to a household' }
    }

    const [newHouse] = await db
      .insert(household)
      .values({ name: input.name, createdBy: input.userId })
      .returning()
    const [newMember] = await db
      .insert(householdMember)
      .values({
        householdId: newHouse.id,
        userId: input.userId,
        role: 'owner',
      })
      .returning()

    const result = { household: newHouse, member: newMember }

    return { success: true, data: result }
  } catch (error) {
    console.error(
      `Error creating household ${(error as Error).message} for ${input.userId}`,
    )
    return { success: false, error }
  }
}

export async function addHouseholdMember(userId: string, token: string) {
  // User can't be in household
  try {
    const existing = await getMembershipByUser(userId)
    if (existing.data) {
      return { success: false, message: 'user already in household' }
    }
    // Token can't be expired and must match
    const invites = await db
      .select()
      .from(householdInvite)
      .where(eq(householdInvite.token, token))

    if (invites.length === 0) {
      return { success: false, message: 'invalid token' }
    }
    const invite = invites[0]

    if (invite.status !== 'pending') {
      return { success: false, message: `Invite already ${invite.status}` }
    }

    if (invite.expiresAt < new Date()) {
      // invite has expired updaate the invite
      await db
        .update(householdInvite)
        .set({
          status: 'expired',
        })
        .where(eq(householdInvite.token, token))

      return { success: false, message: 'token expired' }
    }
    // If household exists an owner must exist too so new member role is member

    const [member] = await db
      .insert(householdMember)
      .values({
        userId,
        householdId: invite.householdId,
        role: 'member',
        updatedAt: new Date(),
      })
      .returning()
    await db
      .update(householdInvite)
      .set({ status: 'accepted', updatedAt: new Date() })
      .where(eq(householdInvite.token, token))

    await db
      .update(userPlants)
      .set({ householdId: invite.householdId, updatedAt: new Date() })
      .where(eq(userPlants.userId, userId))

    return {
      success: true,
      data: { member: member, invitedBy: invite.invitedBy },
    }
  } catch (error) {
    console.error(
      `Error adding member ${userId} to household ${(error as Error).message}`,
    )
    return { success: false, error }
  }
}

// get user membership:
export async function getMembershipByUser(userId: string) {
  try {
    const [member] = await db
      .select()
      .from(householdMember)
      .where(eq(householdMember.userId, userId))
    return { success: true, data: member }
  } catch (error) {
    console.error(`Failed to get householdmember ${(error as Error).message}`)
    return { success: false, error }
  }
}

// Get a household
export async function getHousehold(householdId: string) {
  try {
    const [householdData] = await db
      .select()
      .from(household)
      .where(eq(household.id, householdId))
    return { success: true, householdData }
  } catch (error) {
    console.error(
      `Error getting household ${(error as Error).message} for ${householdId}`,
    )
    return { success: false, error }
  }
}

// get householdMember
export async function getHouseholdMember(householdMemberId: string) {
  try {
    const [member] = await db
      .select()
      .from(householdMember)
      .where(eq(householdMember.id, householdMemberId))
    return { success: true, data: member }
  } catch (error) {
    console.error(
      `Error getting householdMember ${(error as Error).message} for ${householdMemberId}`,
    )
    return { success: false, error }
  }
}

export async function getHouseholdMembers(householdId: string) {
  try {
    const members = await db
      .select({
        userId: householdMember.userId,
        role: householdMember.role,
        joinedAt: householdMember.joinedAt,
        name: user.name,
        image: user.image,
      })
      .from(householdMember)
      .innerJoin(user, eq(householdMember.userId, user.id))
      .where(eq(householdMember.householdId, householdId))
    return { success: true, members }
  } catch (error) {
    console.error(
      `Error getting household memebers ${(error as Error).message}`,
    )
    return { success: false, error }
  }
}

export async function getUserEmail(userId: string) {
  try {
    const [userDetails] = await db
      .select({ email: user.email, name: user.name })
      .from(user)
      .where(eq(user.id, userId))
    return { success: true, data: userDetails }
  } catch (error) {
    console.error(`Error getting user's email: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function renameHousehold(householdId: string, name: string) {
  try {
    const householdName = name.trim()
    if (householdName.length === 0) {
      return { success: false, message: "name can't be empty" }
    }
    const [result] = await db
      .update(household)
      .set({
        name: householdName,
        updatedAt: new Date(),
      })
      .where(eq(household.id, householdId))
      .returning()
    return { success: true, data: result }
  } catch (error) {
    console.error(`Error renaming household ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function leaveHouseholdById(householdId: string, userId: string) {
  try {
    const memberships = await db
      .select({ role: householdMember.role })
      .from(householdMember)
      .where(eq(householdMember.userId, userId))
    // detatch user's plants setting their householdId to null
    if (memberships.length === 0) {
      return { success: false, message: 'not a member of this household' }
    }
    const membership = memberships[0]

    // If role is owner promote other person to owner

    if (membership.role === 'owner') {
      const houseMate = await db
        .select({ userId: householdMember.userId })
        .from(householdMember)
        .where(
          and(
            eq(householdMember.householdId, householdId),
            ne(householdMember.userId, userId),
          ),
        )
      if (houseMate.length > 0) {
        await db
          .update(householdMember)
          .set({
            role: 'owner',
            updatedAt: new Date(),
          })
          .where(eq(householdMember.userId, houseMate[0].userId))
      }
    }
    await db.delete(householdMember).where(eq(householdMember.userId, userId))
    const resetPlants = await detachPlantsFromHousehold(householdId, userId)
    if (!resetPlants.success) {
      console.error('Left household but failed to detach plants')
    }

    return { success: true }
  } catch (error) {
    console.error(`Error leaving household ${(error as Error).message}`)
    return { success: false, error }
  }
}

// updateHousehold member

// Delete a household
export async function deleteHousehold(householdId: string) {
  try {
    const [result] = await db
      .delete(household)
      .where(eq(household.id, householdId))
      .returning()
    return { success: true, data: result }
  } catch (error) {
    console.error(
      `Error deleting household: ${(error as Error).message} for ${householdId}`,
    )
    return { success: false, error }
  }
}

// Check the invite status
export async function getInviteStatus(householdId: string) {
  try {
    const [invite] = await db
      .select()
      .from(householdInvite)
      .where(eq(householdInvite.householdId, householdId))
      .orderBy(desc(householdInvite.createdAt))
      .limit(1)
    return { success: true, data: invite }
  } catch (error) {
    console.error(
      `Error fetching invite status ${(error as Error).message} for ${householdId}`,
    )
    return { success: false, error }
  }
}

export async function createInvite(
  householdId: string,
  invitedBy: string,
  email: string,
  token: string,
) {
  try {
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)
    const [invite] = await db
      .insert(householdInvite)
      .values({
        householdId,
        invitedBy,
        email,
        token,
        expiresAt,
      })
      .returning()
    return { success: true, data: invite }
  } catch (error) {
    console.error(`Error adding invite: ${(error as Error).message}`)
    return { success: false, error }
  }
}

export async function declineInviteByToken(token: string) {
  try {
    const [updatedInvite] = await db
      .update(householdInvite)
      .set({
        status: 'declined',
        updatedAt: new Date(),
      })
      .where(eq(householdInvite.token, token))
      .returning()
    return { success: true, data: updatedInvite }
  } catch (error) {
    console.error(`Error updating invite: ${(error as Error).message}`)
    return { success: false, error }
  }
}
