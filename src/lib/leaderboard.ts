/**
 * Global leaderboard (GET /api/leaderboard/top = HUD top 3, GET /api/leaderboard/top50 = full board,
 * POST /api/leaderboard/submit on Vercel + Upstash).
 *
 * Optional VITE_LEADERBOARD_API: site origin (no path) — defaults to same-origin /api/leaderboard/*.
 * Falls back to localStorage when the API is missing or unreachable (e.g. Vite dev without vercel dev).
 */

export const LEADERBOARD_DISPLAY_LIMIT = 3

export type LeaderboardTopRow = {
  rank: number
  codename: string
  score: number
}

/** Full board row (GET /api/leaderboard/top50). */
export type LeaderboardFullRow = {
  rank: number
  codename: string
  score: number
  playedAt: string
  city: string | null
}

/** Row with stable `id` for React keys (derived from rank + codename + score). */
export type HighScoreEntry = LeaderboardTopRow & { id: string }

export type LeaderboardSubmitResult = {
  leaderboard: HighScoreEntry[]
  rank: number | null
  accepted: boolean
  duplicateSession?: boolean
}

const LOCAL_CACHE_KEY = 'dezc-hud-leaderboard-top3-v1'

function apiOrigin(): string {
  const env = import.meta.env.VITE_LEADERBOARD_API as string | undefined
  if (env == null || env.trim() === '') return ''
  return env.trim().replace(/\/$/, '')
}

function url(
  path: '/api/leaderboard/top' | '/api/leaderboard/submit' | '/api/leaderboard/top50',
): string {
  const o = apiOrigin()
  return o ? `${o}${path}` : path
}

function rowId(r: LeaderboardTopRow): string {
  return `${r.rank}-${r.codename}-${r.score}`
}

function withIds(rows: LeaderboardTopRow[]): HighScoreEntry[] {
  return rows.map((r) => ({ ...r, id: rowId(r) }))
}

function normalizeTopRow(raw: unknown, index: number): LeaderboardTopRow | null {
  if (raw == null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const rankRaw = o.rank
  const rank =
    typeof rankRaw === 'number' && Number.isFinite(rankRaw)
      ? Math.max(1, Math.floor(rankRaw))
      : index + 1
  const codename =
    typeof o.codename === 'string'
      ? o.codename.trim().slice(0, 120)
      : typeof o.nickname === 'string'
        ? o.nickname.trim().slice(0, 120)
        : ''
  const score = o.score
  if (!codename || typeof score !== 'number' || !Number.isFinite(score)) return null
  return { rank, codename, score: Math.floor(score) }
}

export function parseTopPayload(data: unknown): LeaderboardTopRow[] {
  if (!Array.isArray(data)) return []
  const rows = data
    .map((e, i) => normalizeTopRow(e, i))
    .filter((e): e is LeaderboardTopRow => e != null)
  const sorted = [...rows].sort(
    (a, b) => b.score - a.score || a.rank - b.rank || a.codename.localeCompare(b.codename),
  )
  return sorted.slice(0, LEADERBOARD_DISPLAY_LIMIT).map((r, i) => ({
    ...r,
    rank: i + 1,
  }))
}

export function topLeaderboardEntries(
  entries: HighScoreEntry[],
  limit = LEADERBOARD_DISPLAY_LIMIT,
): HighScoreEntry[] {
  const sorted = [...entries].sort(
    (a, b) => b.score - a.score || a.rank - b.rank,
  )
  return sorted.slice(0, limit).map((e, i) => ({
    ...e,
    rank: i + 1,
    id: rowId({ rank: i + 1, codename: e.codename, score: e.score }),
  }))
}

function parseSubmitResponse(data: unknown): LeaderboardSubmitResult {
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    const o = data as {
      top?: unknown
      rank?: unknown
      accepted?: unknown
      duplicateSession?: unknown
    }
    const top = withIds(parseTopPayload(o.top))
    const rankRaw = o.rank
    const rank =
      typeof rankRaw === 'number' && Number.isFinite(rankRaw)
        ? Math.max(1, Math.floor(rankRaw))
        : null
    const accepted = o.accepted === true
    const duplicateSession = o.duplicateSession === true
    return { leaderboard: top, rank, accepted, duplicateSession }
  }
  return {
    leaderboard: [],
    rank: null,
    accepted: false,
  }
}

export function loadLocalLeaderboard(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY)
    if (!raw) return []
    const parsed = parseTopPayload(JSON.parse(raw) as unknown)
    return withIds(parsed)
  } catch {
    return []
  }
}

export function saveLocalLeaderboard(top: HighScoreEntry[]) {
  try {
    const minimal: LeaderboardTopRow[] = top.map(({ rank, codename, score }) => ({
      rank,
      codename,
      score,
    }))
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(minimal))
  } catch {
    /* quota */
  }
}

/** Offline merge: same top-3 rules as the server (tie-break: stable pseudo-time from rank). */
export function mergeLocalLeaderboard(
  score: number,
  codename: string,
): LeaderboardSubmitResult {
  const trimmed = codename.trim().slice(0, 120)
  const scoreInt = Math.floor(score)
  const prev = loadLocalLeaderboard()

  const bestForName = prev
    .filter((e) => e.codename === trimmed)
    .reduce((m, e) => Math.max(m, e.score), Number.NEGATIVE_INFINITY)

  if (bestForName !== Number.NEGATIVE_INFINITY && scoreInt <= bestForName) {
    return {
      leaderboard: topLeaderboardEntries(prev),
      rank: null,
      accepted: false,
    }
  }

  const without = prev
    .filter((e) => e.codename !== trimmed)
    .map((e) => ({
      codename: e.codename,
      score: e.score,
      createdAt: e.rank * 1_000_000,
    }))
  const candidate = [
    ...without,
    { codename: trimmed, score: scoreInt, createdAt: Date.now() },
  ]
  candidate.sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
  const top3 = candidate.slice(0, LEADERBOARD_DISPLAY_LIMIT)
  const inTop = top3.some((e) => e.codename === trimmed && e.score === scoreInt)

  if (!inTop) {
    return {
      leaderboard: topLeaderboardEntries(prev),
      rank: null,
      accepted: false,
    }
  }

  const leaderboard = withIds(
    top3.map((e, i) => ({ rank: i + 1, codename: e.codename, score: e.score })),
  )
  saveLocalLeaderboard(leaderboard)
  const rank =
    top3.findIndex((e) => e.codename === trimmed && e.score === scoreInt) + 1
  return {
    leaderboard,
    rank: rank > 0 ? rank : null,
    accepted: true,
  }
}

function normalizeFullRow(raw: unknown, index: number): LeaderboardFullRow | null {
  if (raw == null || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const rankRaw = o.rank
  const rank =
    typeof rankRaw === 'number' && Number.isFinite(rankRaw)
      ? Math.max(1, Math.floor(rankRaw))
      : index + 1
  const codename =
    typeof o.codename === 'string' ? o.codename.trim().slice(0, 120) : ''
  const score = o.score
  const playedAt = typeof o.playedAt === 'string' ? o.playedAt : ''
  if (!codename || typeof score !== 'number' || !Number.isFinite(score) || !playedAt) return null
  const city =
    o.city === null || o.city === undefined
      ? null
      : typeof o.city === 'string'
        ? o.city.trim().slice(0, 80) || null
        : null
  return { rank, codename, score: Math.floor(score), playedAt, city }
}

const PREVIEW_MINUTE_MS = 60_000
const PREVIEW_YEAR_MS = 365 * 86_400_000

/** Dummy Top 50 for local UI preview only — never hits the backend when mock is disabled for prod. */
function previewMockLeaderboardTop50(): LeaderboardFullRow[] {
  const now = Date.now()
  const hr = 3_600_000
  const day = 86_400_000
  const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString()

  // Realistic mini-game range: double digits, top below ~50 (rare in actual play).
  const raw: Omit<LeaderboardFullRow, 'rank'>[] = [
    { codename: 'nebula drift', score: 47, playedAt: iso(-4 * day - 2 * hr), city: 'Austin' },
    { codename: 'signal nine', score: 44, playedAt: iso(-1 * day - 11 * hr), city: 'Oslo' },
    { codename: 'ghost ledger', score: 42, playedAt: iso(-18 * hr), city: 'Lisbon' },
    { codename: 'tidal arc', score: 39, playedAt: iso(-52 * day), city: 'Tokyo' },
    { codename: 'rust choir', score: 37, playedAt: iso(-6 * hr), city: null },
    { codename: 'volt lane', score: 35, playedAt: iso(-90 * day - 5 * hr), city: 'Austin' },
    { codename: 'quiet forge', score: 33, playedAt: iso(-3 * day), city: 'Berlin' },
    { codename: 'paper moth', score: 31, playedAt: iso(-220 * day), city: null },
    { codename: 'silver static', score: 30, playedAt: iso(-34 * hr), city: 'Lisbon' },
    { codename: 'pixel hymn', score: 28, playedAt: iso(-14 * day), city: 'São Paulo' },
    { codename: 'ocean grid', score: 26, playedAt: iso(-50 * hr), city: 'Oslo' },
    { codename: 'calm flare', score: 25, playedAt: iso(-730 * day), city: 'Austin' },
    { codename: 'echo strata', score: 24, playedAt: iso(-25 * PREVIEW_MINUTE_MS), city: 'Tokyo' },
    { codename: 'thin mercury', score: 22, playedAt: iso(-401 * day), city: null },
    { codename: 'soft comet', score: 21, playedAt: iso(-11 * hr), city: 'Berlin' },
    { codename: 'winter cache', score: 19, playedAt: iso(-92 * PREVIEW_MINUTE_MS), city: 'Chicago' },
    { codename: 'amber knot', score: 18, playedAt: iso(-7 * day - 40 * PREVIEW_MINUTE_MS), city: 'Chicago' },
    { codename: 'lucky vector', score: 16, playedAt: iso(-410 * hr), city: 'Austin' },
    { codename: 'cold bloom', score: 14, playedAt: iso(-2 * PREVIEW_YEAR_MS), city: null },
    { codename: 'minor orbit', score: 12, playedAt: iso(-19 * day), city: 'Lisbon' },
  ]

  return raw
    .sort((a, b) => b.score - a.score || a.codename.localeCompare(b.codename))
    .map((r, i) => ({ ...r, rank: i + 1 }))
}

function usePreviewMockLeaderboardTop50(): boolean {
  const v = import.meta.env.VITE_LEADERBOARD_PREVIEW_MOCK as string | undefined
  if (v === '1' || v === 'true') return true
  if (v === '0' || v === 'false') return false
  return import.meta.env.DEV
}

export async function fetchLeaderboardTop50(): Promise<LeaderboardFullRow[]> {
  if (usePreviewMockLeaderboardTop50()) {
    if (import.meta.env.DEV) {
      console.info(
        '[leaderboard] Top 50: using preview mock data (set VITE_LEADERBOARD_PREVIEW_MOCK=0 to call the real API in dev)',
      )
    }
    return previewMockLeaderboardTop50()
  }

  const u = url('/api/leaderboard/top50')
  try {
    const res = await fetch(u, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const data: unknown = await res.json()
    if (data == null || typeof data !== 'object' || !('entries' in data)) return []
    const entries = (data as { entries: unknown }).entries
    if (!Array.isArray(entries)) return []
    return entries
      .map((e, i) => normalizeFullRow(e, i))
      .filter((e): e is LeaderboardFullRow => e != null)
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[leaderboard] GET /api/leaderboard/top50 failed', err)
    }
    return []
  }
}

export async function fetchLeaderboardTop(): Promise<HighScoreEntry[]> {
  const u = url('/api/leaderboard/top')
  try {
    const res = await fetch(u, {
      method: 'GET',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const data: unknown = await res.json()
    const parsed = parseTopPayload(data)
    const top = withIds(parsed)
    saveLocalLeaderboard(top)
    return top
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[leaderboard] GET /api/leaderboard/top failed, using local cache', err)
    }
    return topLeaderboardEntries(loadLocalLeaderboard(), LEADERBOARD_DISPLAY_LIMIT)
  }
}

export async function submitLeaderboardEntry(
  score: number,
  codename: string,
  /** When set, server enforces one submit per game session (recommended). */
  sessionId?: string,
): Promise<LeaderboardSubmitResult> {
  const u = url('/api/leaderboard/submit')
  const trimmed = codename.trim().slice(0, 120)
  const sid = (sessionId ?? '').trim().slice(0, 128)
  try {
    const body: { score: number; codename: string; sessionId?: string } = {
      score,
      codename: trimmed,
    }
    if (sid) body.sessionId = sid
    const res = await fetch(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`POST ${res.status}`)
    const data: unknown = await res.json()
    const result = parseSubmitResponse(data)
    saveLocalLeaderboard(result.leaderboard)
    return result
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[leaderboard] POST /api/leaderboard/submit failed, using offline merge', err)
    }
    return mergeLocalLeaderboard(score, trimmed)
  }
}
