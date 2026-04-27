/**
 * GET /api/leaderboard/test
 * Connectivity check: SET debug:test → GET debug:test (TTL 60s).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const TEST_TTL_S = 60

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    res.setHeader('Cache-Control', 'no-store')

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      return res.status(405).json({ ok: false, error: 'Method not allowed' })
    }

    const { resolveRedis, REDIS_MISSING_ENV_MESSAGE } = await import('../../lib/redis.js')
    const r = await resolveRedis()
    if (!r.ok) {
      const isMissingEnv = r.error === REDIS_MISSING_ENV_MESSAGE
      return res.status(503).json(
        isMissingEnv
          ? { ok: false, error: 'Missing KV env vars' }
          : { ok: false, error: r.error },
      )
    }

    const redis = r.client
    const DEBUG_KEY = 'debug:test'
    const payload = 'ok'

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

    return res.status(200).json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return res.status(500).json({ ok: false, error: message })
  }
}
