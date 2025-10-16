// Add type safety
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-side environment variables
  readonly VITE_APP_NAME: string
  readonly VITE_API_URL: string
  readonly VIT_ENABLE_NEW_DASHBOARD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Server-side environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DATABASE_URL: string
      readonly JWT_SECRET: string
      readonly BETTER_AUTH_SECRET: string
      readonly BETTER_AUTH_URL: string
      readonly NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export {}
