/**
 * POST /api/leaderboard/clear
 *
 * Deletes the global leaderboard key in Redis. Disabled unless LEADERBOARD_CLEAR_SECRET is set.
 * Call from a trusted context only:
 *
 *   curl -sS -X POST "https://<host>/api/leaderboard/clear" \
 *     -H "Authorization: Bearer <LEADERBOARD_CLEAR_SECRET>"
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { LEADERBOARD_REDIS_KEY } from './store.js'

function bearerToken(req: VercelRequest): string {
  const h = req.headers.authorization
  if (typeof h !== 'string' || !h.startsWith('Bearer ')) return ''
  return h.slice(7).trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    applyLeaderboardCors(res)
    res.setHeader('Cache-Control', 'no-store')

    if (req.method === 'OPTIONS') {
      return preflightLeaderboard(res)
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const expected = (process.env.LEADERBOARD_CLEAR_SECRET ?? '').trim()
    if (!expected) {
      return res.status(503).json({ error: 'Leaderboard clear is not configured' })
    }

    if (bearerToken(req) !== expected) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { resolveRedis } = await import('../../lib/redis.js')
    const redisResult = await resolveRedis()
    if (!redisResult.ok) {
      return res.status(503).json({ error: redisResult.error })
    }

    const removed = await redisResult.client.del(LEADERBOARD_REDIS_KEY)
    console.info('[leaderboard/clear]', { removed })
    return res.status(200).json({ ok: true, removed })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.info('[leaderboard/clear]', { failed: true })
    return res.status(500).json({ error: message })
  }
}
