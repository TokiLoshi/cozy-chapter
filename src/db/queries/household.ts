import { and, desc, eq } from 'drizzle-orm'
import { user } from 'auth-schema'
import {
  household,
  householdInvite,
  householdMember,
} from '../schemas/household-schema'
import type {
  Household,
  NewHousehold,
  NewHouseholdMember,
  householdRoleEnum,
} from '../schemas/household-schema'
import { db } from '@/db'

// Create a household
export async function createHousehold(input: { userId: string; name: string }) {
  try {
    // Check if household exists
    const existing = await getMembershipByUser(input.userId)
    if (existing.data) {
      return { success: false, message: 'User already belongs to a household' }
    }
    const result = await db.transaction(async (tx) => {
      const [newHouse] = await tx
        .insert(household)
        .values({ name: input.name, createdBy: input.userId })
        .returning()
      const [newMember] = await tx
        .insert(householdMember)
        .values({
          householdId: newHouse.id,
          userId: input.userId,
          role: 'owner',
        })
        .returning()
      return { household: newHouse, member: newMember }
    })
    return { success: true, data: result }
  } catch (error) {
    console.error(
      `Error creating household ${(error as Error).message} for ${input.userId}`,
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

// Modify a household
export async function updateHousehold(
  householdId: string,
  updates: NewHouseholdMember,
) {
  // If the household exists and a new member joins they should be a member
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
