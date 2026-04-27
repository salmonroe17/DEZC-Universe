/**
 * GET /api/leaderboard/top
 * Returns: [{ rank, codename, score }, ...] (up to 3 rows)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { LEADERBOARD_REDIS_KEY, parseStored, toTopRows } from './store.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    applyLeaderboardCors(res)

    if (req.method === 'OPTIONS') {
      return preflightLeaderboard(res)
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const { resolveRedis, REDIS_MISSING_ENV_MESSAGE } = await import('../../lib/redis.js')
    const r = await resolveRedis()
    if (!r.ok) {
      const isMissingEnv = r.error === REDIS_MISSING_ENV_MESSAGE
      return res.status(503).json(
        isMissingEnv ? { error: 'Missing KV env vars' } : { error: r.error },
      )
    }

    const redis = r.client
    const raw = await redis.get(LEADERBOARD_REDIS_KEY)
    const top = toTopRows(parseStored(raw))
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
    return res.status(200).json(top)
  } catch (e) {
    try {
      applyLeaderboardCors(res)
    } catch {
      /* noop */
    }
    const message = e instanceof Error ? e.message : 'Internal server error'
    console.info('[leaderboard/top]', { handlerFailed: true })
    return res.status(500).json({ error: message })
  }
}
