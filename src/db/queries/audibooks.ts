import { and, eq } from 'drizzle-orm'
import { audioBooks, userAudioBooks } from '../audiobook-schema'
import type { AudioBooks, UserAudioBooks } from '../audiobook-schema'
import { db } from '@/db'

export async function upsertAudiobook()
