/**
 * Shared Redis key + parsing for global leaderboard (Vercel + Upstash).
 * Stores up to {@link LEADERBOARD_MAX_ENTRIES} personal-best rows (one per codename).
 */

/** Single global leaderboard key (JSON array of entries, sorted desc by score). */
export const LEADERBOARD_REDIS_KEY = 'leaderboard:scores'
export const SESSION_LOCK_PREFIX = 'dezc:portfolio:lb-session:'
/** One submit attempt per game session (client-generated id). */
export const SESSION_LOCK_TTL_S = 600

/** Max rows persisted (personal best per codename). */
export const LEADERBOARD_MAX_ENTRIES = 50

/** Rows returned to the HUD after submit / duplicate responses. */
export const LEADERBOARD_HUD_RESPONSE_LIMIT = 3

export type StoredEntry = {
  codename: string
  score: number
  createdAt: number
  /** Approximate city from Vercel `x-vercel-ip-city` on submit; omitted for legacy rows. */
  city?: string
}

export type TopRow = {
  rank: number
  codename: string
  score: number
}

export type FullLeaderboardRow = {
  rank: number
  codename: string
  score: number
  playedAt: string
  city: string | null
}

export function sortEntries(a: StoredEntry, b: StoredEntry): number {
  if (b.score !== a.score) return b.score - a.score
  return a.createdAt - b.createdAt
}

function sanitizeCity(raw: unknown): string | undefined {
  if (raw == null) return undefined
  const s = typeof raw === 'string' ? raw.trim() : String(raw).trim()
  if (!s) return undefined
  return s.slice(0, 80)
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
    const score =
      typeof s === 'number' && Number.isFinite(s)
        ? Math.floor(s)
        : typeof s === 'string' && s.trim() !== ''
          ? Math.floor(Number(s))
          : NaN
    const createdAt =
      typeof o.createdAt === 'number' && Number.isFinite(o.createdAt)
        ? o.createdAt
        : typeof o.created_at === 'number' && Number.isFinite(o.created_at)
          ? o.created_at
          : Date.now()
    if (!c || !Number.isFinite(score)) continue
    const city = sanitizeCity(o.city)
    const entry: StoredEntry = { codename: c.slice(0, 120), score, createdAt }
    if (city) entry.city = city
    out.push(entry)
  }
  out.sort(sortEntries)
  return out.slice(0, LEADERBOARD_MAX_ENTRIES)
}

export function toTopRows(entries: StoredEntry[], limit = LEADERBOARD_HUD_RESPONSE_LIMIT): TopRow[] {
  const sorted = [...entries].sort(sortEntries).slice(0, Math.max(1, limit))
  return sorted.map((e, i) => ({
    rank: i + 1,
    codename: e.codename,
    score: e.score,
  }))
}

export function toFullLeaderboardRows(entries: StoredEntry[]): FullLeaderboardRow[] {
  const sorted = [...entries].sort(sortEntries).slice(0, LEADERBOARD_MAX_ENTRIES)
  return sorted.map((e, i) => ({
    rank: i + 1,
    codename: e.codename,
    score: e.score,
    playedAt: new Date(e.createdAt).toISOString(),
    city: e.city && e.city.trim() ? e.city.trim() : null,
  }))
}
