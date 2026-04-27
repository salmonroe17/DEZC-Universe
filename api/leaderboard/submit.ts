/**
 * POST /api/leaderboard/submit
 * Body: { codename, score, sessionId? }
 *
 * Top 3 globally; same codename only improves if new score is strictly higher;
 * scores not in top 3 are not stored. Optional sessionId: when set, one POST per id (anti double-submit).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getRedis } from '../../lib/redis.js'
import { applyLeaderboardCors, preflightLeaderboard } from './cors.js'
import {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyLeaderboardCors(res)
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    return preflightLeaderboard(res)
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const redis = getRedis()
  if (!redis) {
    console.warn('[leaderboard/submit] Redis unavailable (missing env)')
    return res.status(503).json({
      error: 'Leaderboard not configured',
      accepted: false,
      rank: null,
      top: [],
    })
  }

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
          top: toTopRows(parseStored(rawDup)),
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
        top: toTopRows(entries),
      })
    }

    const without: StoredEntry[] = entries.filter((e) => e.codename !== codenameRaw)
    const candidate: StoredEntry[] = [
      ...without,
      { codename: codenameRaw, score: scoreInt, createdAt: Date.now() },
    ]
    candidate.sort(sortEntries)
    const top3 = candidate.slice(0, 3)
    const inTop = top3.some((e) => e.codename === codenameRaw && e.score === scoreInt)

    if (!inTop) {
      return res.status(200).json({
        accepted: false,
        duplicateSession: false,
        reason: 'below_top_three',
        rank: null,
        top: toTopRows(entries),
      })
    }

    await redis.set(LEADERBOARD_REDIS_KEY, JSON.stringify(top3))
    const top = toTopRows(top3)
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
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.error('[leaderboard/submit] error', message)
    return res.status(500).json({
      error: 'Leaderboard submit failed',
      accepted: false,
      rank: null,
      top: [],
    })
  }
}
