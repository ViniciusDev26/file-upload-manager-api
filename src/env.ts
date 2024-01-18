import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number(),
  CLOUDFLARE_R2_HOST: z.string().url(),
  CLOUDFLARE_R2_BUCKET: z.string(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
})

export const env = envSchema.parse(process.env);