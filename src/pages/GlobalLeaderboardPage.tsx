import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import {
  fetchLeaderboardTop50,
  type LeaderboardFullRow,
} from '../lib/leaderboard'

const LEADERBOARD_ACCESS_PASSWORD = 'g'
const LEADERBOARD_UNLOCK_STORAGE_KEY = 'dezc-global-leaderboard-unlocked-v1'

type SortKey = 'rank' | 'codename' | 'score' | 'playedAt' | 'city'
type SortDir = 'asc' | 'desc'

function formatPlayedAt(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return iso
  }
}

/** Human-readable elapsed time since `iso` (UTC). */
function formatRelativeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return '—'
  let diffSec = Math.floor((Date.now() - t) / 1000)
  if (diffSec < 0) diffSec = 0
  if (diffSec < 60) return 'just now'
  const mins = Math.floor(diffSec / 60)
  if (mins < 60) return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return days === 1 ? '1 day ago' : `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(days / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

function sortRows(
  list: LeaderboardFullRow[],
  sort: { key: SortKey; dir: SortDir } | null,
): LeaderboardFullRow[] {
  if (!sort) return list
  const mul = sort.dir === 'asc' ? 1 : -1
  const out = [...list]
  out.sort((a, b) => {
    let cmp = 0
    switch (sort.key) {
      case 'rank':
        cmp = a.rank - b.rank
        break
      case 'score':
        cmp = a.score - b.score
        break
      case 'playedAt':
        cmp =
          new Date(a.playedAt).getTime() -
          new Date(b.playedAt).getTime()
        break
      case 'codename':
        cmp = a.codename.localeCompare(b.codename, undefined, {
          sensitivity: 'base',
        })
        break
      case 'city':
        cmp = String(a.city ?? '').localeCompare(String(b.city ?? ''), undefined, {
          sensitivity: 'base',
        })
        break
      default:
        break
    }
    if (cmp !== 0) return cmp * mul
    return a.rank - b.rank
  })
  return out
}

export default function GlobalLeaderboardPage() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(LEADERBOARD_UNLOCK_STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState(false)

  const [rows, setRows] = useState<LeaderboardFullRow[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir } | null>(null)

  useEffect(() => {
    if (!unlocked) return
    let cancelled = false
    ;(async () => {
      try {
        const entries = await fetchLeaderboardTop50()
        if (cancelled) return
        if (entries.length === 0) {
          setRows([])
          setStatus('empty')
          return
        }
        setRows(entries)
        setStatus('ok')
      } catch {
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [unlocked])

  const summary = useMemo(() => {
    if (rows.length === 0) return null
    let latest = rows[0]
    let latestTs = new Date(rows[0].playedAt).getTime()
    for (const r of rows) {
      const ts = new Date(r.playedAt).getTime()
      if (!Number.isNaN(ts) && ts >= latestTs) {
        latestTs = ts
        latest = r
      }
    }
    let topScore = rows[0].score
    let sumScore = 0
    const byCity = new Map<
      string,
      { rows: LeaderboardFullRow[] }
    >()
    for (const r of rows) {
      sumScore += r.score
      topScore = Math.max(topScore, r.score)
      const label =
        r.city != null && r.city.trim() !== '' ? r.city.trim() : 'Unknown location'
      if (!byCity.has(label)) byCity.set(label, { rows: [] })
      byCity.get(label)!.rows.push(r)
    }
    const UNKNOWN_CITY_CARD_LABEL = 'Unknown location'
    const cityCards = [...byCity.entries()]
      .map(([cityLabel, { rows: cityRows }]) => {
        let last = cityRows[0].playedAt
        let lastTs = new Date(cityRows[0].playedAt).getTime()
        let best = cityRows[0].score
        for (const r of cityRows) {
          best = Math.max(best, r.score)
          const ts = new Date(r.playedAt).getTime()
          if (!Number.isNaN(ts) && ts >= lastTs) {
            lastTs = ts
            last = r.playedAt
          }
        }
        return {
          cityLabel,
          players: cityRows.length,
          topScore: best,
          lastPlayedAgo: formatRelativeAgo(last),
        }
      })
      .sort(
        (a, b) =>
          b.players - a.players ||
          a.cityLabel.localeCompare(b.cityLabel, undefined, {
            sensitivity: 'base',
          }),
      )

    const unknownCityCard = cityCards.find((c) => c.cityLabel === UNKNOWN_CITY_CARD_LABEL)
    const knownCityCards = cityCards.filter((c) => c.cityLabel !== UNKNOWN_CITY_CARD_LABEL)
    const playersByCityCards = [
      ...knownCityCards.slice(0, 3),
      ...(unknownCityCard && unknownCityCard.players > 0 ? [unknownCityCard] : []),
    ]

    const citiesWithCoords = summaryCountKnownCities(rows)

    return {
      latest,
      topScore,
      avgScore: sumScore / rows.length,
      totalPlayers: rows.length,
      cityCards,
      playersByCityCards,
      knownCityCount: citiesWithCoords,
    }
  }, [rows])

  const displayRows = useMemo(() => sortRows(rows, sort), [rows, sort])

  function cycleSort(key: SortKey) {
    setSort((prev) => {
      if (prev?.key !== key) return { key, dir: 'desc' }
      if (prev.dir === 'desc') return { key, dir: 'asc' }
      return null
    })
  }

  function handleUnlock(e: FormEvent) {
    e.preventDefault()
    if (passwordInput === LEADERBOARD_ACCESS_PASSWORD) {
      try {
        sessionStorage.setItem(LEADERBOARD_UNLOCK_STORAGE_KEY, '1')
      } catch {
        /* ignore quota / private mode */
      }
      setAuthError(false)
      setUnlocked(true)
      setPasswordInput('')
      return
    }
    setAuthError(true)
  }

  function sortAriaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (!sort || sort.key !== key) return 'none'
    return sort.dir === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 font-mono text-fg sm:px-6 md:py-14">
      <p className="m-0 text-[10px] font-normal uppercase tracking-[0.14em] text-fg-subtle md:text-[11px]">
        Mini-game
      </p>
      <h1 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
        Global leaderboard
      </h1>

      {!unlocked ? (
        <>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
            This page is password protected. Enter the password to view the top 50.
          </p>
          <form
            onSubmit={handleUnlock}
            className="mt-8 max-w-sm rounded border border-cell-border/80 bg-elevated/30 p-4"
          >
            <label
              htmlFor="leaderboard-password"
              className="block text-[10px] uppercase tracking-[0.1em] text-fg-muted"
            >
              Password
            </label>
            <input
              id="leaderboard-password"
              type="password"
              autoComplete="off"
              value={passwordInput}
              onChange={(ev) => {
                setPasswordInput(ev.target.value)
                if (authError) setAuthError(false)
              }}
              className="mt-2 w-full rounded border border-cell-border/80 bg-bg px-3 py-2 text-sm text-fg outline-none ring-hud/40 transition-[box-shadow] focus:ring-2"
            />
            {authError && (
              <p className="mt-2 text-xs text-fg-muted" role="alert">
                Incorrect password.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 rounded border border-cell-border/80 bg-bg px-4 py-2 text-xs font-medium text-fg transition-colors hover:border-hud/60 hover:text-fg/90"
            >
              View leaderboard
            </button>
          </form>
          <p className="mt-6">
            <Link
              to="/"
              className="text-xs text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:decoration-hud"
            >
              ← Back to home
            </Link>
          </p>
        </>
      ) : (
        <div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
            Top 50 personal-best scores. Codenames are generated per run; times are stored in UTC and
            shown in your local timezone.
          </p>

          {status === 'ok' && summary && (
            <>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded border border-cell-border/80 bg-elevated/30 p-4">
                  <p className="m-0 text-[10px] uppercase tracking-[0.1em] text-fg-muted">
                    Last played
                  </p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-fg">
                    {formatRelativeAgo(summary.latest.playedAt)}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-fg-muted">
                    {summary.latest.city && summary.latest.city.trim() !== ''
                      ? `${summary.latest.city} · `
                      : ''}
                    {summary.latest.codename.toUpperCase()}
                  </p>
                  <p className="mt-2 text-[10px] text-fg-subtle">
                    {formatPlayedAt(summary.latest.playedAt)}
                  </p>
                </div>
                <div className="rounded border border-cell-border/80 bg-elevated/30 p-4">
                  <p className="m-0 text-[10px] uppercase tracking-[0.1em] text-fg-muted">
                    Players on board
                  </p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-fg">
                    {summary.totalPlayers}
                  </p>
                  <p className="mt-1 text-[11px] text-fg-muted">
                    {summary.knownCityCount} cities with a location
                  </p>
                </div>
                <div className="rounded border border-cell-border/80 bg-elevated/30 p-4">
                  <p className="m-0 text-[10px] uppercase tracking-[0.1em] text-fg-muted">
                    Top score
                  </p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-fg">
                    {summary.topScore}
                  </p>
                  <p className="mt-1 text-[11px] text-fg-muted">
                    Avg {summary.avgScore.toFixed(1)}
                  </p>
                </div>
                <div className="rounded border border-cell-border/80 bg-elevated/30 p-4">
                  <p className="m-0 text-[10px] uppercase tracking-[0.1em] text-fg-muted">
                    Cities
                  </p>
                  <p className="mt-2 text-lg font-semibold tabular-nums text-fg">
                    {summary.cityCards.length}
                  </p>
                  <p className="mt-1 text-[11px] text-fg-muted">
                    Unique location groups (incl. unknown)
                  </p>
                </div>
              </div>

              <h2 className="mt-10 text-[10px] font-medium uppercase tracking-[0.12em] text-fg-muted">
                Players by city
              </h2>
              <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-fg-subtle">
                Showing the top three locations by player count, plus unknown when relevant. Each
                row on the board is one codename mapped to its submit location (see privacy policy).
              </p>
              <div
                role="region"
                aria-label="Players by city, top locations"
                className="mt-4 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-3 sm:overflow-visible sm:px-0 lg:grid-cols-4"
              >
                {summary.playersByCityCards.map((c) => (
                  <div
                    key={c.cityLabel}
                    className="flex w-[min(16rem,calc(100vw-3.5rem))] shrink-0 snap-start flex-col rounded border border-cell-border/80 bg-elevated/20 p-3 sm:w-auto sm:min-w-0 sm:snap-none"
                  >
                    <p className="m-0 text-xs font-medium text-fg">{c.cityLabel}</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.08em] text-fg-muted">
                      Players
                    </p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums text-fg">
                      {c.players}
                    </p>
                    <p className="mt-2 text-[10px] text-fg-subtle">
                      Best {c.topScore} · Last {c.lastPlayedAgo}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-10 overflow-x-auto rounded border border-cell-border/80 bg-elevated/30">
            <table className="w-full min-w-[32rem] border-collapse text-left text-[11px] md:text-xs">
              <thead>
                <tr className="border-b border-cell-border/80 bg-bg/80 text-[10px] uppercase tracking-[0.08em] text-fg-muted">
                  <SortTh
                    label="#"
                    sortKey="rank"
                    sort={sort}
                    onSort={cycleSort}
                    ariaSort={sortAriaSort('rank')}
                    className="px-3 py-2.5 font-medium tabular-nums md:px-4"
                  />
                  <SortTh
                    label="Codename"
                    sortKey="codename"
                    sort={sort}
                    onSort={cycleSort}
                    ariaSort={sortAriaSort('codename')}
                    className="px-3 py-2.5 font-medium md:px-4"
                  />
                  <SortTh
                    label="Score"
                    sortKey="score"
                    sort={sort}
                    onSort={cycleSort}
                    ariaSort={sortAriaSort('score')}
                    className="px-3 py-2.5 font-medium tabular-nums md:px-4"
                  />
                  <SortTh
                    label="Played"
                    sortKey="playedAt"
                    sort={sort}
                    onSort={cycleSort}
                    ariaSort={sortAriaSort('playedAt')}
                    className="px-3 py-2.5 font-medium md:px-4"
                  />
                  <SortTh
                    label="City"
                    sortKey="city"
                    sort={sort}
                    onSort={cycleSort}
                    ariaSort={sortAriaSort('city')}
                    className="px-3 py-2.5 font-medium md:px-4"
                  />
                </tr>
              </thead>
              <tbody>
                {status === 'loading' ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-fg-muted">
                      Loading…
                    </td>
                  </tr>
                ) : status === 'error' ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-fg-muted">
                      Could not load the leaderboard. Try again later.
                    </td>
                  </tr>
                ) : status === 'empty' ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-fg-muted">
                      No scores yet. Play the mini-game on the home page to get on the board.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((r) => (
                    <tr
                      key={`${r.rank}-${r.codename}-${r.score}-${r.playedAt}`}
                      className="border-b border-cell-border/40 last:border-b-0"
                    >
                      <td className="px-3 py-2 tabular-nums text-fg/80 md:px-4">{r.rank}</td>
                      <td className="px-3 py-2 font-medium text-fg md:px-4">
                        {r.codename.toUpperCase()}
                      </td>
                      <td className="px-3 py-2 tabular-nums font-semibold text-fg md:px-4">
                        {r.score}
                      </td>
                      <td className="px-3 py-2 text-fg-muted md:px-4">{formatPlayedAt(r.playedAt)}</td>
                      <td className="px-3 py-2 text-fg-muted md:px-4">
                        {r.city ?? '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-2xl text-[10px] leading-relaxed text-fg-subtle md:text-[11px]">
            <strong className="font-medium text-fg-muted">City column:</strong> When you submit a
            score on Vercel, we may store an approximate city from your connection (IP-based, same
            as many analytics CDNs)—not GPS-level location. It can be blank for privacy, VPNs, or
            local dev.{' '}
            <Link
              to="/privacy"
              className="text-fg-muted underline decoration-cell-border/80 underline-offset-[3px] transition-colors hover:text-fg/80 hover:decoration-hud"
            >
              Privacy policy
            </Link>
          </p>
          <p className="mt-1 max-w-2xl text-[10px] text-fg-subtle md:text-[11px]">
            Column headers: click to sort high→low, then low→high, then restore default order.
          </p>

          <p className="mt-6">
            <Link
              to="/"
              className="text-xs text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:decoration-hud"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      )}
    </main>
  )
}

function summaryCountKnownCities(rows: LeaderboardFullRow[]): number {
  const set = new Set<string>()
  for (const r of rows) {
    if (r.city != null && r.city.trim() !== '') set.add(r.city.trim())
  }
  return set.size
}

function SortTh({
  label,
  sortKey,
  sort,
  onSort,
  ariaSort,
  className,
}: {
  label: string
  sortKey: SortKey
  sort: { key: SortKey; dir: SortDir } | null
  onSort: (k: SortKey) => void
  ariaSort: 'ascending' | 'descending' | 'none'
  className: string
}) {
  const active = sort?.key === sortKey
  const dir = active ? sort!.dir : null

  return (
    <th scope="col" aria-sort={ariaSort} className={className}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="group inline-flex w-full min-w-0 items-center justify-start gap-1 text-left font-medium text-fg-muted transition-colors hover:text-fg/80"
      >
        <span>{label}</span>
        <span className="flex shrink-0 flex-col items-center justify-center leading-none opacity-40 group-hover:opacity-70">
          {dir === 'asc' ? (
            <CaretUp className="h-3.5 w-3.5 text-fg" weight="bold" aria-hidden />
          ) : dir === 'desc' ? (
            <CaretDown className="h-3.5 w-3.5 text-fg" weight="bold" aria-hidden />
          ) : (
            <span className="flex flex-col -space-y-1" aria-hidden>
              <CaretUp className="h-2.5 w-2.5" />
              <CaretDown className="h-2.5 w-2.5" />
            </span>
          )}
        </span>
      </button>
    </th>
  )
}
