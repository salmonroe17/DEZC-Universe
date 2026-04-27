/**
 * Shared Upstash Redis client for Vercel serverless (Node).
 *
 * Env:
 *   KV_REST_API_URL + KV_REST_API_TOKEN
 *   or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *
 * `@upstash/redis` is loaded only via dynamic `import()` inside `instantiateRedis`
 * so nothing from that package runs at this file's first evaluation.
 *
 * Do not import this file from the Vite browser bundle — serverless only.
 */

import type { Redis } from '@upstash/redis'

/** Returned in JSON as `{ error: "Missing KV env vars" }` when URL/token pair is incomplete. */
export const REDIS_MISSING_ENV_MESSAGE = 'Missing KV env vars' as const

let clientPromise: Promise<Redis | null> | null = null

export function getRedisEnvPresence(): { hasUrl: boolean; hasToken: boolean } {
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '').trim()
  const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '').trim()
  return { hasUrl: url.length > 0, hasToken: token.length > 0 }
}

function logEnv(hasUrl: boolean, hasToken: boolean) {
  console.info('[leaderboard/redis]', { hasUrl, hasToken })
}

async function instantiateRedis(): Promise<Redis | null> {
  const { hasUrl, hasToken } = getRedisEnvPresence()
  logEnv(hasUrl, hasToken)
  if (!hasUrl || !hasToken) {
    return null
  }

  try {
    const { Redis: RedisCtor } = await import('@upstash/redis')
    const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? '').trim()
    const token = (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? '').trim()
    return new RedisCtor({ url, token })
  } catch {
    console.info('[leaderboard/redis]', { initFailed: true })
    return null
  }
}

/**
 * Lazy singleton. Safe to call from any route; never throws.
 */
export async function getRedis(): Promise<Redis | null> {
  try {
    clientPromise ??= instantiateRedis()
    return await clientPromise
  } catch {
    console.info('[leaderboard/redis]', { getRedisFailed: true })
    return null
  }
}

/**
 * Preferred entry for HTTP handlers. Never throws.
 */
export async function resolveRedis(): Promise<
  { ok: true; client: Redis } | { ok: false; error: string }
> {
  try {
    const { hasUrl, hasToken } = getRedisEnvPresence()
    if (!hasUrl || !hasToken) {
      logEnv(hasUrl, hasToken)
      return { ok: false, error: REDIS_MISSING_ENV_MESSAGE }
    }

    const client = await getRedis()
    if (!client) {
      return { ok: false, error: 'Redis initialization failed' }
    }
    return { ok: true, client }
  } catch {
    console.info('[leaderboard/redis]', { resolveRedisFailed: true })
    return { ok: false, error: 'Redis initialization failed' }
  }
}
