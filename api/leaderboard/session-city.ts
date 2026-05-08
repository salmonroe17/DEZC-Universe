/**
 * GET /api/leaderboard/session-city
 * Returns approximate viewer city from Vercel request headers (same source as score submit).
 * Used only to choose password re-prompt policy for the global leaderboard page.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { inferCityFromVercelRequest } from './geo.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    applyLeaderboardCors(res)
    res.setHeader('Cache-Control', 'no-store')

    if (req.method === 'OPTIONS') {
      return preflightLeaderboard(res)
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS')
      return res.status(405).json({ city: null, error: 'Method not allowed' })
    }

    const raw = inferCityFromVercelRequest(req)
    const city =
      typeof raw === 'string' && raw.trim() !== ''
        ? raw.trim().slice(0, 80)
        : null

    return res.status(200).json({ city })
  } catch (e) {
    try {
      applyLeaderboardCors(res)
    } catch {
      /* noop */
    }
    console.info('[leaderboard/session-city]', { handlerFailed: true })
    return res.status(200).json({ city: null })
  }
}
