/**
 * Global leaderboard (GET/POST /api/high-scores on Vercel + Upstash Redis).
 * Optional VITE_LEADERBOARD_API: site origin or full path ending in /high-scores — otherwise same-origin /api/high-scores.
 * Falls back to localStorage when the API is missing or unreachable (e.g. local dev without Redis).
 */

export const LEADERBOARD_DISPLAY_LIMIT = 3

export type HighScoreEntry = {
  id: string
  codename: string
  score: number
  created_at: number
  device_type?: string
}

export type LeaderboardSubmitResult = {
  leaderboard: HighScoreEntry[]
  rank: number | null
}

const LOCAL_CACHE_KEY = 'dezc-hud-high-scores-v3'

function newLocalId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    /* ignore */
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function normalizeRawEntry(raw: unknown, index: number): HighScoreEntry | null {
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
      : `local-${created_at}-${index}-${Math.random().toString(36).slice(2, 9)}`

  const device_type =
    typeof o.device_type === 'string' && o.device_type.trim()
      ? o.device_type.trim().slice(0, 32)
      : undefined

  return { id, codename, score: Math.floor(score), created_at, device_type }
}

export function parseLeaderboardPayload(data: unknown): HighScoreEntry[] {
  if (!Array.isArray(data)) return []
  return data
    .map((e, i) => normalizeRawEntry(e, i))
    .filter((e): e is HighScoreEntry => e != null)
    .slice(0, 128)
}

export function topLeaderboardEntries(
  entries: HighScoreEntry[],
  limit = LEADERBOARD_DISPLAY_LIMIT,
): HighScoreEntry[] {
  const sorted = [...entries].sort(
    (a, b) => b.score - a.score || b.created_at - a.created_at,
  )
  return sorted.slice(0, limit)
}

/** Coarse device class for analytics (optional on each score row). */
export function getLeaderboardDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown'
  try {
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (narrow && coarse) return 'mobile'
    if (narrow) return 'mobile'
    if (coarse) return 'tablet'
    return 'desktop'
  } catch {
    return 'unknown'
  }
}

function leaderboardEndpoint(): string {
  const env = import.meta.env.VITE_LEADERBOARD_API as string | undefined
  if (env != null && env.trim() !== '') {
    const base = env.trim().replace(/\/$/, '')
    return base.endsWith('/high-scores') ? base : `${base}/api/high-scores`
  }
  return '/api/high-scores'
}

function leaderboardGetUrl(): string {
  const path = leaderboardEndpoint()
  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}limit=${LEADERBOARD_DISPLAY_LIMIT}`
}

function parseSubmitResponse(data: unknown): LeaderboardSubmitResult {
  if (data != null && typeof data === 'object' && !Array.isArray(data)) {
    const o = data as { leaderboard?: unknown; rank?: unknown }
    const leaderboard = topLeaderboardEntries(parseLeaderboardPayload(o.leaderboard))
    const rankRaw = o.rank
    const rank =
      typeof rankRaw === 'number' && Number.isFinite(rankRaw)
        ? Math.max(1, Math.floor(rankRaw))
        : null
    return { leaderboard, rank }
  }
  if (Array.isArray(data)) {
    return {
      leaderboard: topLeaderboardEntries(parseLeaderboardPayload(data)),
      rank: null,
    }
  }
  return { leaderboard: [], rank: null }
}

export function loadLocalLeaderboard(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY)
    if (!raw) return []
    return parseLeaderboardPayload(JSON.parse(raw) as unknown)
  } catch {
    return []
  }
}

export function saveLocalLeaderboard(top: HighScoreEntry[]) {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(top))
  } catch {
    /* ignore quota */
  }
}

export function mergeLocalLeaderboard(
  score: number,
  codename: string,
): LeaderboardSubmitResult {
  const prev = loadLocalLeaderboard()
  const trimmed = codename.trim().slice(0, 120)
  const newEntry: HighScoreEntry = {
    id: newLocalId(),
    codename: trimmed,
    score: Math.floor(score),
    created_at: Date.now(),
    device_type: getLeaderboardDeviceType(),
  }
  const merged = [...prev, newEntry]
  const sorted = [...merged].sort(
    (a, b) => b.score - a.score || b.created_at - a.created_at,
  )
  const rank = sorted.findIndex((e) => e.id === newEntry.id) + 1
  const leaderboard = topLeaderboardEntries(sorted, LEADERBOARD_DISPLAY_LIMIT)
  saveLocalLeaderboard(leaderboard)
  return { leaderboard, rank: rank > 0 ? rank : null }
}

export async function fetchLeaderboardTop(): Promise<HighScoreEntry[]> {
  const url = leaderboardGetUrl()
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const data: unknown = await res.json()
    const parsed = parseLeaderboardPayload(data)
    const top = topLeaderboardEntries(parsed, LEADERBOARD_DISPLAY_LIMIT)
    saveLocalLeaderboard(top)
    return top
  } catch {
    return topLeaderboardEntries(loadLocalLeaderboard(), LEADERBOARD_DISPLAY_LIMIT)
  }
}

export async function submitLeaderboardEntry(
  score: number,
  codename: string,
): Promise<LeaderboardSubmitResult> {
  const url = leaderboardEndpoint()
  const trimmed = codename.trim().slice(0, 120)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        score,
        codename: trimmed,
        device_type: getLeaderboardDeviceType(),
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
