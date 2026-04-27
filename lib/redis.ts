/**
 * Shared Upstash Redis client for Vercel serverless (Node).
 *
 * Env (Vercel → Storage → linked Redis, or manual):
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 *
 * Fallback for older / manual setups:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Do not import this file from the Vite browser bundle — serverless only.
 */

import { Redis } from '@upstash/redis'

let cached: Redis | null | undefined

/**
 * Lazy singleton. Returns `null` when credentials are missing (safe for health checks).
 */
export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  cached = url && token ? new Redis({ url, token }) : null
  return cached
}

/**
 * Same client as {@link getRedis}; use after verifying non-null in route handlers.
 * @throws If Redis env vars are not configured
 */
export function requireRedis(): Redis {
  const r = getRedis()
  if (!r) {
    throw new Error(
      'Redis not configured: set KV_REST_API_URL and KV_REST_API_TOKEN (or UPSTASH_* equivalents).',
    )
  }
  return r
}
