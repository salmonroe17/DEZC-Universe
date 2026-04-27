/**
 * Shared Redis key + parsing for global top-3 leaderboard (Vercel + Upstash).
 * Use `getRedis()` from `lib/redis.ts` in route handlers.
 */

export const LEADERBOARD_REDIS_KEY = 'dezc:portfolio:global-top3-v2'
export const SESSION_LOCK_PREFIX = 'dezc:portfolio:lb-session:'
/** One submit attempt per game session (client-generated id). */
export const SESSION_LOCK_TTL_S = 600

export type StoredEntry = {
  codename: string
  score: number
  createdAt: number
}

export type TopRow = {
  rank: number
  codename: string
  score: number
}

export function parseStored(raw: unknown): StoredEntry[] {
  if (raw == null) return []
  if (typeof raw === 'string') {
    try {
      return parseStored(JSON.parse(raw) as unknown)
    } catch {
      return []
    }
  }
  if (!Array.isArray(raw)) return []
  const out: StoredEntry[] = []
  for (const item of raw) {
    if (item == null || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const c = typeof o.codename === 'string' ? o.codename.trim() : ''
    const s = o.score
    const score = typeof s === 'number' && Number.isFinite(s) ? Math.floor(s) : NaN
    const createdAt =
      typeof o.createdAt === 'number' && Number.isFinite(o.createdAt)
        ? o.createdAt
        : typeof o.created_at === 'number' && Number.isFinite(o.created_at)
          ? o.created_at
          : Date.now()
    if (!c || !Number.isFinite(score)) continue
    out.push({ codename: c.slice(0, 120), score, createdAt })
  }
  return out.slice(0, 8)
}

export function sortEntries(a: StoredEntry, b: StoredEntry): number {
  if (b.score !== a.score) return b.score - a.score
  return a.createdAt - b.createdAt
}

export function toTopRows(entries: StoredEntry[]): TopRow[] {
  const sorted = [...entries].sort(sortEntries).slice(0, 3)
  return sorted.map((e, i) => ({
    rank: i + 1,
    codename: e.codename,
    score: e.score,
  }))
}
