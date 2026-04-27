/**
 * GET /api/leaderboard/test
 * Connectivity check: SET → GET → DEL a short-lived key (production-safe).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../../lib/redis'

const TEST_PREFIX = 'dezc:portfolio:lb-ping:'
const TEST_TTL_S = 60

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const redis = getRedis()
  if (!redis) {
    return res.status(503).json({
      ok: false,
      error: 'Redis not configured (missing KV_REST_API_URL / KV_REST_API_TOKEN)',
    })
  }

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const key = `${TEST_PREFIX}${suffix}`
  const payload = `ok-${suffix}`

  try {
    await redis.set(key, payload, { ex: TEST_TTL_S })
    const read = await redis.get<string>(key)
    await redis.del(key)

    if (read !== payload) {
      return res.status(500).json({
        ok: false,
        error: 'Round-trip mismatch',
        expected: payload,
        got: read ?? null,
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Redis connection and read/write verified',
      key: TEST_PREFIX + '*',
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return res.status(500).json({ ok: false, error: message })
  }
}
