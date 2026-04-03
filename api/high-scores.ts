/**
 * Vercel Serverless: shared all-time leaderboard.
 *
 * Env (Upstash Redis — free tier):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * Create a Redis database at https://upstash.com → copy REST URL + token into
 * Vercel Project → Settings → Environment Variables, then redeploy.
 */

import { Redis } from '@upstash/redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/** Bump version to start a fresh global leaderboard (old Redis key is orphaned). */
const KEY = 'dezc:portfolio:hud-leaderboard-v2'
const MAX_STORED = 500

type Entry = { score: number; nickname: string; at: number }

function parseStored(raw: unknown): Entry[] {
  if (raw == null) return []
  if (typeof raw !== 'string') return []
  try {
    const a = JSON.parse(raw) as unknown
    if (!Array.isArray(a)) return []
    return a
      .filter(
        (e): e is Entry =>
          e != null &&
          typeof e === 'object' &&
          typeof (e as Entry).score === 'number' &&
          typeof (e as Entry).nickname === 'string' &&
          typeof (e as Entry).at === 'number',
      )
      .slice(0, 4000)
  } catch {
    return []
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    return res.status(503).json({
      error:
        'Leaderboard not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN on Vercel.',
    })
  }

  const redis = new Redis({ url, token })

  if (req.method === 'GET') {
    const raw = await redis.get(KEY)
    const list = parseStored(raw)
    list.sort((a, b) => b.score - a.score || b.at - a.at)
    return res.status(200).json(list.slice(0, 3))
  }

  if (req.method === 'POST') {
    const body = req.body as { score?: unknown; nickname?: unknown } | undefined
    const score = Number(body?.score)
    const nickname = String(body?.nickname ?? '')
      .trim()
      .slice(0, 120)
    if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
      return res.status(400).json({ error: 'Invalid score' })
    }
    if (!nickname) {
      return res.status(400).json({ error: 'Invalid nickname' })
    }

    const raw = await redis.get(KEY)
    let list = parseStored(raw)
    list.push({ score: Math.floor(score), nickname, at: Date.now() })
    list.sort((a, b) => b.score - a.score || b.at - a.at)
    list = list.slice(0, MAX_STORED)
    await redis.set(KEY, JSON.stringify(list))
    return res.status(200).json(list.slice(0, 3))
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
