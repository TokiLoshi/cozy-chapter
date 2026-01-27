import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schemas/*-schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL!,
  },
})
