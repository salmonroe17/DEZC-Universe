/**
 * Client-side gate for `/leaderboard`: password + sessionStorage, with optional 6h re-auth
 * when Vercel does not classify the viewer in Stouffville or Markham.
 */

export const GLOBAL_LEADERBOARD_UNLOCK_KEY = 'dezc-global-leaderboard-unlocked-v1'
/** Millis epoch when password was last accepted (needed for regions outside trusted cities). */
export const GLOBAL_LEADERBOARD_AUTH_AT_KEY = 'dezc-global-leaderboard-auth-at-v1'

const SIX_HOURS_MS = 6 * 60 * 60 * 1000

function normalizeCityName(city: string): string {
  return city
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** IP-derived cities that only need password once per browser tab (sessionStorage lifetime). */
export function isTrustedHomeCityRegion(city: string | null): boolean {
  if (city == null || city.trim() === '') return false
  const n = normalizeCityName(city)
  return n === 'stouffville' || n === 'markham'
}

export function readLeaderboardUnlockSnapshot(): {
  unlocked: boolean
  authAtMs: number | null
} {
  try {
    const unlocked = sessionStorage.getItem(GLOBAL_LEADERBOARD_UNLOCK_KEY) === '1'
    const raw = sessionStorage.getItem(GLOBAL_LEADERBOARD_AUTH_AT_KEY)
    const ms = raw != null ? Number(raw) : NaN
    return {
      unlocked,
      authAtMs: Number.isFinite(ms) ? ms : null,
    }
  } catch {
    return { unlocked: false, authAtMs: null }
  }
}

/** Whether the stored credentials still allow viewing the leaderboard for this inferred city. */
export function sessionAuthAllowsLeaderboardAccess(inferredCity: string | null): boolean {
  const { unlocked, authAtMs } = readLeaderboardUnlockSnapshot()
  if (!unlocked) return false

  if (isTrustedHomeCityRegion(inferredCity)) {
    return true
  }

  if (authAtMs == null) return false
  return Date.now() - authAtMs <= SIX_HOURS_MS
}

export function persistLeaderboardPasswordUnlock() {
  try {
    const now = Date.now()
    sessionStorage.setItem(GLOBAL_LEADERBOARD_UNLOCK_KEY, '1')
    sessionStorage.setItem(GLOBAL_LEADERBOARD_AUTH_AT_KEY, String(now))
  } catch {
    /* private mode */
  }
}
