import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as authSchema from './db/schemas/auth-schema'
// TODO: import the rest of the schemas and add them to the combined schema

export const schema = {
  ...authSchema,
}

const sql = neon(process.env.VITE_DATABASE_URL!)

export const db = drizzle(sql, { schema })

export type Database = typeof db

let client: ReturnType<typeof neon>

export async function getClient() {
  if (!process.env.VITE_DATABASE_URL) {
    console.log('ERROR: DB missing')
    return undefined
  }
  // eslint-disable-next-line
  if (!client) {
    client = await neon(process.env.VITE_DATABASE_URL)
  }
}
