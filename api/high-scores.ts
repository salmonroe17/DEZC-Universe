/**
 * Vercel Serverless: shared all-time leaderboard (Upstash Redis — persists until you delete the DB).
 *
 * Env (set on Vercel → Project → Settings → Environment Variables):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * @see https://upstash.com — create a Redis database → REST tab → copy URL + token.
 */

import { Redis } from '@upstash/redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/** Bump version to start a fresh global leaderboard (old Redis key is orphaned). */
const KEY = 'dezc:portfolio:hud-leaderboard-v2'
/** Keep the top N scores forever (trim lowest when full). */
const MAX_STORED = 50_000

type Entry = { score: number; nickname: string; at: number }

function parseStored(raw: unknown): Entry[] {
  if (raw == null) return []

  if (Array.isArray(raw)) {
    return raw
      .filter(
        (e): e is Entry =>
          e != null &&
          typeof e === 'object' &&
          typeof (e as Entry).score === 'number' &&
          typeof (e as Entry).nickname === 'string' &&
          typeof (e as Entry).at === 'number',
      )
      .slice(0, 60_000)
  }

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
      .slice(0, 60_000)
  } catch {
    return []
  }
}

function readJsonBody(req: VercelRequest): { score?: unknown; nickname?: unknown } | undefined {
  const body = req.body
  if (body == null) return undefined
  if (typeof body === 'object' && !Buffer.isBuffer(body)) {
    return body as { score?: unknown; nickname?: unknown }
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as { score?: unknown; nickname?: unknown }
    } catch {
      return undefined
    }
  }
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8')) as { score?: unknown; nickname?: unknown }
    } catch {
      return undefined
    }
  }
  return undefined
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
    return res.status(200).json(list.slice(0, 3))
  }

  if (req.method === 'POST') {
    const body = readJsonBody(req)
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
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(list.slice(0, 3))
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
