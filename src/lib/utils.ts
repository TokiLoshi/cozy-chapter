// eslint-disable-next-line
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { auth } from '../lib/auth'

// eslint-disable-next-line
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSessionServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await auth.api.getSession({ headers: getRequest().headers })
    return session
  },
)
