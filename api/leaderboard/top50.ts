/**
 * GET /api/leaderboard/top50
 * Full public board: up to 50 rows with codename, score, playedAt (ISO), city (optional).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { LEADERBOARD_REDIS_KEY, parseStored, toFullLeaderboardRows } from './store.js'

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
        isMissingEnv ? { error: 'Missing KV env vars', entries: [] } : { error: r.error, entries: [] },
      )
    }

    const redis = r.client
    const raw = await redis.get(LEADERBOARD_REDIS_KEY)
    const entries = toFullLeaderboardRows(parseStored(raw))
    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60')
    return res.status(200).json({ entries })
  } catch (e) {
    try {
      applyLeaderboardCors(res)
    } catch {
      /* noop */
    }
    const message = e instanceof Error ? e.message : 'Internal server error'
    console.info('[leaderboard/top50]', { handlerFailed: true })
    return res.status(500).json({ error: message, entries: [] })
  }
}
