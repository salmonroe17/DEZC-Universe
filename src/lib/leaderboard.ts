/**
 * Global leaderboard (GET/POST /api/high-scores on Vercel + Upstash Redis).
 * Optional VITE_LEADERBOARD_API: site origin (e.g. https://my-app.vercel.app) or
 * full path ending in /high-scores — otherwise /api/high-scores is used.
 * Falls back to localStorage when the API is missing or unreachable (local dev).
 */

export type HighScoreEntry = {
  score: number
  nickname: string
  at: number
}

const LOCAL_CACHE_KEY = 'dezc-hud-high-scores-v2'

export function parseLeaderboardPayload(data: unknown): HighScoreEntry[] {
  if (!Array.isArray(data)) return []
  return data
    .filter(
      (e): e is HighScoreEntry =>
        e != null &&
        typeof e === 'object' &&
        typeof (e as HighScoreEntry).score === 'number' &&
        typeof (e as HighScoreEntry).nickname === 'string' &&
        typeof (e as HighScoreEntry).at === 'number',
    )
    .slice(0, 64)
}

export function topThree(entries: HighScoreEntry[]): HighScoreEntry[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score || b.at - a.at)
  return sorted.slice(0, 3)
}

function leaderboardEndpoint(): string {
  const env = import.meta.env.VITE_LEADERBOARD_API as string | undefined
  if (env != null && env.trim() !== '') {
    const base = env.trim().replace(/\/$/, '')
    return base.endsWith('/high-scores') ? base : `${base}/api/high-scores`
  }
  return '/api/high-scores'
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
  nickname: string,
): HighScoreEntry[] {
  const prev = loadLocalLeaderboard()
  const next = [...prev, { score, nickname, at: Date.now() }]
  const top = topThree(next)
  saveLocalLeaderboard(top)
  return top
}

export async function fetchLeaderboardTop(): Promise<HighScoreEntry[]> {
  const url = leaderboardEndpoint()
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const data: unknown = await res.json()
    const parsed = parseLeaderboardPayload(data)
    const top = topThree(parsed)
    saveLocalLeaderboard(top)
    return top
  } catch {
    return topThree(loadLocalLeaderboard())
  }
}

export async function submitLeaderboardEntry(
  score: number,
  nickname: string,
): Promise<HighScoreEntry[]> {
  const url = leaderboardEndpoint()
  const trimmed = nickname.trim().slice(0, 120)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ score, nickname: trimmed }),
    })
    if (!res.ok) throw new Error(`POST ${res.status}`)
    const data: unknown = await res.json()
    const top = topThree(parseLeaderboardPayload(data))
    saveLocalLeaderboard(top)
    return top
  } catch {
    return mergeLocalLeaderboard(score, trimmed)
  }
}
