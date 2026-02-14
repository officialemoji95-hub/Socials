import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  INSTAGRAM_GRAPH_BASE_URL: z.string().url().default('https://graph.instagram.com'),
  TIKTOK_API_BASE_URL: z.string().url().default('https://open.tiktokapis.com'),
  INVITE_MESSAGE_TEMPLATE: z.string().default('Hey! Join our channel for updates.')
});

export const env = envSchema.parse(process.env);
