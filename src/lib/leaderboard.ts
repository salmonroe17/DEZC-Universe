/**
 * Global top-3 leaderboard (GET /api/leaderboard/top, POST /api/leaderboard/submit on Vercel + Upstash).
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

function url(path: '/api/leaderboard/top' | '/api/leaderboard/submit'): string {
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

export async function fetchLeaderboardTop(): Promise<HighScoreEntry[]> {
  const u = url('/api/leaderboard/top')
  try {
    const res = await fetch(u, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const data: unknown = await res.json()
    const parsed = parseTopPayload(data)
    const top = withIds(parsed)
    saveLocalLeaderboard(top)
    return top
  } catch {
    return topLeaderboardEntries(loadLocalLeaderboard(), LEADERBOARD_DISPLAY_LIMIT)
  }
}

export async function submitLeaderboardEntry(
  score: number,
  codename: string,
  sessionId: string,
): Promise<LeaderboardSubmitResult> {
  const u = url('/api/leaderboard/submit')
  const trimmed = codename.trim().slice(0, 120)
  const sid = sessionId.trim().slice(0, 128)
  try {
    const res = await fetch(u, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        score,
        codename: trimmed,
        sessionId: sid,
      }),
    })
    if (!res.ok) throw new Error(`POST ${res.status}`)
    const data: unknown = await res.json()
    const result = parseSubmitResponse(data)
    saveLocalLeaderboard(result.leaderboard)
    return result
  } catch {
    return mergeLocalLeaderboard(score, trimmed)
  }
}
