/**
 * POST /api/leaderboard/submit
 * Body: { codename, score, sessionId? }
 *
 * Top {@link LEADERBOARD_MAX_ENTRIES} globally (one row per codename, personal best);
 * optional sessionId: one POST per id (anti double-submit).
 * Approximate city from Vercel `x-vercel-ip-city` when deployed.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import { inferCityFromVercelRequest } from './geo.js'
import {
  LEADERBOARD_HUD_RESPONSE_LIMIT,
  LEADERBOARD_MAX_ENTRIES,
  LEADERBOARD_REDIS_KEY,
  SESSION_LOCK_PREFIX,
  SESSION_LOCK_TTL_S,
  parseStored,
  sortEntries,
  toTopRows,
  type StoredEntry,
} from './store.js'

function readJsonBody(req: VercelRequest): Record<string, unknown> | undefined {
  const body = req.body
  if (body == null) return undefined
  if (typeof body === 'object' && !Buffer.isBuffer(body)) {
    return body as Record<string, unknown>
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>
    } catch {
      return undefined
    }
  }
  if (Buffer.isBuffer(body)) {
    try {
      return JSON.parse(body.toString('utf8')) as Record<string, unknown>
    } catch {
      return undefined
    }
  }
  return undefined
}

function sessionLockAcquired(lockResult: unknown): boolean {
  return lockResult === 'OK' || lockResult === true
}

function newEntry(codename: string, scoreInt: number, req: VercelRequest): StoredEntry {
  const city = inferCityFromVercelRequest(req)
  const entry: StoredEntry = { codename, score: scoreInt, createdAt: Date.now() }
  if (city) entry.city = city
  return entry
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

    const { resolveRedis } = await import('../../lib/redis.js')
    const redisResult = await resolveRedis()
    if (!redisResult.ok) {
      return res.status(503).json({
        error: redisResult.error,
        accepted: false,
        rank: null,
        top: [],
      })
    }
    const redis = redisResult.client

    const body = readJsonBody(req) ?? {}
    const codenameRaw = String(body.codename ?? '')
      .trim()
      .slice(0, 120)
    const scoreRaw = body.score
    const score = Number(scoreRaw)
    const sessionId = String(body.sessionId ?? '')
      .trim()
      .slice(0, 128)

    if (!codenameRaw) {
      console.info('[leaderboard/submit] reject: missing codename')
      return res.status(400).json({ error: 'Invalid codename' })
    }
    if (!Number.isFinite(score) || score < 0 || score > 1_000_000) {
      console.info('[leaderboard/submit] reject: bad score', { scoreRaw })
      return res.status(400).json({ error: 'Invalid score' })
    }

    const scoreInt = Math.floor(score)
    let lockKeyHeld: string | null = null

    try {
      if (sessionId) {
        const lockKey = `${SESSION_LOCK_PREFIX}${sessionId}`
        const lockOk = await redis.set(lockKey, '1', { nx: true, ex: SESSION_LOCK_TTL_S })
        if (!sessionLockAcquired(lockOk)) {
          const rawDup = await redis.get(LEADERBOARD_REDIS_KEY)
          return res.status(200).json({
            accepted: false,
            duplicateSession: true,
            rank: null,
            top: toTopRows(parseStored(rawDup), LEADERBOARD_HUD_RESPONSE_LIMIT),
          })
        }
        lockKeyHeld = lockKey
      }

      const raw = await redis.get(LEADERBOARD_REDIS_KEY)
      const entries = parseStored(raw)

      const bestForName = entries
        .filter((e) => e.codename === codenameRaw)
        .reduce((m, e) => Math.max(m, e.score), Number.NEGATIVE_INFINITY)

      if (bestForName !== Number.NEGATIVE_INFINITY && scoreInt <= bestForName) {
        return res.status(200).json({
          accepted: false,
          duplicateSession: false,
          reason: 'not_higher_than_personal_best',
          rank: null,
          top: toTopRows(entries, LEADERBOARD_HUD_RESPONSE_LIMIT),
        })
      }

      const without: StoredEntry[] = entries.filter((e) => e.codename !== codenameRaw)
      const candidate: StoredEntry[] = [...without, newEntry(codenameRaw, scoreInt, req)]
      candidate.sort(sortEntries)
      const topN = candidate.slice(0, LEADERBOARD_MAX_ENTRIES)
      const inTop = topN.some((e) => e.codename === codenameRaw && e.score === scoreInt)

      if (!inTop) {
        return res.status(200).json({
          accepted: false,
          duplicateSession: false,
          reason: 'below_leaderboard_cutoff',
          rank: null,
          top: toTopRows(entries, LEADERBOARD_HUD_RESPONSE_LIMIT),
        })
      }

      await redis.set(LEADERBOARD_REDIS_KEY, JSON.stringify(topN))
      const top = toTopRows(topN, LEADERBOARD_HUD_RESPONSE_LIMIT)
      const rank =
        top.find((r) => r.codename === codenameRaw && r.score === scoreInt)?.rank ?? null

      console.info('[leaderboard/submit] accepted', {
        codename: codenameRaw,
        score: scoreInt,
        rank,
      })

      return res.status(200).json({
        accepted: true,
        duplicateSession: false,
        rank,
        top,
      })
    } catch (e) {
      if (lockKeyHeld) {
        try {
          await redis.del(lockKeyHeld)
        } catch {
          /* best-effort */
        }
      }
      console.info('[leaderboard/submit]', { businessLogicFailed: true })
      return res.status(500).json({
        error: 'Leaderboard submit failed',
        accepted: false,
        rank: null,
        top: [],
      })
    }
  } catch (e) {
    try {
      applyLeaderboardCors(res)
    } catch {
      /* noop */
    }
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.info('[leaderboard/submit]', { handlerFailed: true })
    return res.status(500).json({
      error: message,
      accepted: false,
      rank: null,
      top: [],
    })
  }
}
