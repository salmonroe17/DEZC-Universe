/**
 * GET /api/leaderboard/top
 * Returns: [{ rank, codename, score }, ...] (up to 3 rows)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../../lib/redis'
import { LEADERBOARD_REDIS_KEY, parseStored, toTopRows } from './store'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const redis = getRedis()
  if (!redis) {
    return res.status(503).json([])
  }

  const raw = await redis.get(LEADERBOARD_REDIS_KEY)
  const top = toTopRows(parseStored(raw))
  res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
  return res.status(200).json(top)
}
