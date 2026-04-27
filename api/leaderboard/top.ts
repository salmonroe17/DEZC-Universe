/**
 * GET /api/leaderboard/top
 * Returns: [{ rank, codename, score }, ...] (up to 3 rows)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../../lib/redis.js'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { LEADERBOARD_REDIS_KEY, parseStored, toTopRows } from './store.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyLeaderboardCors(res)

  if (req.method === 'OPTIONS') {
    return preflightLeaderboard(res)
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const redis = getRedis()
  if (!redis) {
    console.warn('[leaderboard/top] Redis unavailable (missing env)')
    return res.status(503).json([])
  }

  try {
    const raw = await redis.get(LEADERBOARD_REDIS_KEY)
    const top = toTopRows(parseStored(raw))
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
    return res.status(200).json(top)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[leaderboard/top] error', message)
    return res.status(500).json([])
  }
}
