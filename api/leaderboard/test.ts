/**
 * GET /api/leaderboard/test
 * Connectivity check: SET debug:test → GET debug:test (TTL 60s).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../../lib/redis.js'

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

  const DEBUG_KEY = 'debug:test'
  const payload = 'ok'

  try {
    await redis.set(DEBUG_KEY, payload, { ex: TEST_TTL_S })
    const read = await redis.get<string>(DEBUG_KEY)

    if (read !== payload) {
      return res.status(500).json({
        ok: false,
        error: 'Round-trip mismatch',
        key: DEBUG_KEY,
        expected: payload,
        got: read ?? null,
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Redis set(debug:test)/get(debug:test) verified',
      key: DEBUG_KEY,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return res.status(500).json({ ok: false, error: message })
  }
}
