import { and, eq } from 'drizzle-orm'
import {
  mealPlanEntries,
  mealPlans,
  recipeTags,
  recipes,
} from '../schemas/recipes-schema'
import type {
  MealPlan,
  MealPlanEntry,
  NewMealPlan,
  NewMealPlanEntry,
  NewRecipe,
  NewRecipeTag,
  Recipe,
  RecipeTag,
} from '../schemas/recipes-schema'
import { db } from '@/db'

export async function upsertRecipe(
  data: Omit<NewRecipe, 'createdAt' | 'updatedAt'>,
) {
  try {
    const result = await db
      .insert(recipes)
      .values(data)
      .onConflictDoUpdate({
        target: recipes.id,
        set: {
          name: data.name,
          description: data.description,
          ingredients: data.ingredients,
          cookingInstructions: data.cookingInstructions,
          source: data.source,
          externalLink: data.externalLink,
          estimatedTime: data.estimatedTime,
          typicalTime: data.typicalTime,
        },
      })
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error upserting recipe', error)
    return { success: false, error }
  }
}

export async function setRecipeTags(
  recipeId: string,
  tags: Array<NewRecipeTag['tag']>,
) {
  try {
    await db.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId))
    if (tags.length === 0) return { success: true, data: [] }
    const result = await db
      .insert(recipeTags)
      .values(tags.map((tag) => ({ recipeId, tag })))
      .returning()
    return { success: true, data: result }
  } catch (error) {
    console.error('Error setting recipe tags: ', error)
    return { success: false, error }
  }
}

export async function getRecipes(userId: string) {
  try {
    const userRecipes = await db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId))
    return { success: true, data: userRecipes }
  } catch (error) {
    console.error('Error getting recipes', error)
    return { success: false, error }
  }
}

export async function createMealPlan(
  data: Pick<NewMealPlan, 'userId' | 'weakStartDate' | 'name'>,
) {
  try {
    const result = await db.insert(mealPlans).values(data)
    return { success: false, data: result }
  } catch (error) {
    console.error('Error creating meal plan: ', error)
    return { success: false, error }
  }
}

export async function getUserMealPlans(userId: string) {
  try {
    const result = await db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, userId))
  } catch (error) {
    console.error('Error getting meal plans: ', error)
    return { success: false, error }
  }
}

export async function getMealPlansWithEntries(
  mealPlanId: string,
  userId: string,
) {
  try {
    const plan = await db
      .select()
      .from(mealPlans)
      .where(and(eq(mealPlans.id, mealPlanId), eq(mealPlans.userId, userId)))
  } catch (error) {
    console.error('Error getting meal plan with entries: ', error)
    return { success: false }
  }
}

export async function createMealPlanEntry(
  data: Pick<NewMealPlanEntry, 'mealPlanId' | 'recipeId' | 'day'>,
) {
  try {
    const result = await db.insert(mealPlanEntries).values(data)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating meal plan entry')
    return { success: false }
  }
}

export async function updateMealPlanEntry(
  id: string,
  updates: Partial<
    Pick<NewMealPlanEntry, 'cooked' | 'cookedAt' | 'day' | 'rating' | 'notes'>
  >,
) {
  try {
    const result = await db
      .update(mealPlanEntries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mealPlanEntries.id, id))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error updating mealPlanEntries: ', error)
    return { success: false }
  }
}

export async function deleteMealPlanEntry(id: string) {
  try {
    const result = await db
      .delete(mealPlanEntries)
      .where(eq(mealPlanEntries.id, id))
      .returning()
    return { success: true, data: result[0] }
  } catch (error) {
    console.error('Error deleting meal plan entry: ', error)
    return { success: false, error }
  }
}

export async function deleteMealPlan(id: string, userId: string) {
  try {
    const result = await db
      .delete(mealPlans)
      .where(and(eq(mealPlans.id, id), eq(mealPlans.userId, userId)))
    return { success: true, data: result }
  } catch (error) {
    console.error('Error deleting meal plan: ', error)
    return { success: false }
  }
}
