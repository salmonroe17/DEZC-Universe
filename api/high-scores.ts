/**
 * Vercel Serverless: shared global leaderboard (Upstash Redis).
 *
 * Env (Vercel → Project → Settings → Environment Variables):
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 *
 * @see https://upstash.com — create a Redis database → REST tab → copy URL + token.
 */

import { randomUUID } from 'node:crypto'
import { Redis } from '@upstash/redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/** Bump when stored entry shape changes (older Redis keys are unused). */
const KEY = 'dezc:portfolio:hud-leaderboard-v3'
const MAX_STORED = 50_000
const DEFAULT_TOP_LIMIT = 3
const MAX_TOP_LIMIT = 50

export type StoredLeaderboardEntry = {
  id: string
  codename: string
  score: number
  created_at: number
  device_type?: string
}

function parseLimit(req: VercelRequest): number {
  const q = req.query?.limit
  const raw = Array.isArray(q) ? q[0] : q
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) return DEFAULT_TOP_LIMIT
  return Math.min(MAX_TOP_LIMIT, Math.floor(n))
}

function normalizeOne(raw: unknown, index: number): StoredLeaderboardEntry | null {
  if (raw == null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const score = o.score
  if (typeof score !== 'number' || !Number.isFinite(score)) return null

  const codenameRaw =
    typeof o.codename === 'string'
      ? o.codename
      : typeof o.nickname === 'string'
        ? o.nickname
        : ''
  const codename = codenameRaw.trim().slice(0, 120)
  if (!codename) return null

  const created_at =
    typeof o.created_at === 'number' && Number.isFinite(o.created_at)
      ? o.created_at
      : typeof o.at === 'number' && Number.isFinite(o.at)
        ? o.at
        : Date.now()

  const id =
    typeof o.id === 'string' && o.id.trim()
      ? o.id.trim().slice(0, 64)
      : `mig-${created_at}-${index}-${Math.random().toString(36).slice(2, 9)}`

  const device_type =
    typeof o.device_type === 'string' && o.device_type.trim()
      ? o.device_type.trim().slice(0, 32)
      : undefined

  return { id, codename, score: Math.floor(score), created_at, device_type }
}

function parseStored(raw: unknown): StoredLeaderboardEntry[] {
  if (raw == null) return []

  let arr: unknown[] = []
  if (Array.isArray(raw)) arr = raw
  else if (typeof raw === 'string') {
    try {
      const a = JSON.parse(raw) as unknown
      if (Array.isArray(a)) arr = a
    } catch {
      return []
    }
  } else return []

  return arr
    .map((e, i) => normalizeOne(e, i))
    .filter((e): e is StoredLeaderboardEntry => e != null)
    .slice(0, 60_000)
}

function sortEntries(list: StoredLeaderboardEntry[]): StoredLeaderboardEntry[] {
  return [...list].sort((a, b) => b.score - a.score || b.created_at - a.created_at)
}

function readJsonBody(req: VercelRequest):
  | {
      score?: unknown
      codename?: unknown
      nickname?: unknown
      device_type?: unknown
    }
  | undefined {
  const body = req.body
  if (body == null) return undefined
  if (typeof body === 'object' && !Buffer.isBuffer(body)) {
    return body as {
      score?: unknown
      codename?: unknown
      nickname?: unknown
      device_type?: unknown
    }
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as {
        score?: unknown
        codename?: unknown
        nickname?: unknown
        device_type?: unknown
      }
    } catch {
      return undefined
    }
  }
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8')) as {
        score?: unknown
        codename?: unknown
        nickname?: unknown
        device_type?: unknown
      }
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
  const topLimit = parseLimit(req)

  if (req.method === 'GET') {
    const raw = await redis.get(KEY)
    const list = sortEntries(parseStored(raw))
    res.setHeader('Cache-Control', 'public, s-maxage=5, stale-while-revalidate=30')
    return res.status(200).json(list.slice(0, topLimit))
  }

  if (req.method === 'POST') {
    const body = readJsonBody(req)
    const score = Number(body?.score)
    const codenameRaw =
      String(body?.codename ?? body?.nickname ?? '')
        .trim()
        .slice(0, 120)
    const device_type = String(body?.device_type ?? '')
      .trim()
      .slice(0, 32)

    if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
      return res.status(400).json({ error: 'Invalid score' })
    }
    if (!codenameRaw) {
      return res.status(400).json({ error: 'Invalid codename' })
    }

    const newEntry: StoredLeaderboardEntry = {
      id: randomUUID(),
      codename: codenameRaw,
      score: Math.floor(score),
      created_at: Date.now(),
      ...(device_type ? { device_type } : {}),
    }

    const raw = await redis.get(KEY)
    let list = parseStored(raw)
    list.push(newEntry)
    const sorted = sortEntries(list).slice(0, MAX_STORED)
    await redis.set(KEY, JSON.stringify(sorted))

    const rank = sorted.findIndex((e) => e.id === newEntry.id) + 1
    const leaderboard = sorted.slice(0, topLimit)

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({
      leaderboard,
      rank,
      entry: newEntry,
    })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method not allowed' })
}
