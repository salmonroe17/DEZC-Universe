import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchLeaderboardTop50,
  type LeaderboardFullRow,
} from '../lib/leaderboard'

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
    })
  } catch {
    return iso
  }
}

export default function GlobalLeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardFullRow[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')

  useEffect(() => {
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
  }, [])

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 font-mono text-fg sm:px-6 md:py-14">
      <p className="m-0 text-[10px] font-normal uppercase tracking-[0.14em] text-fg-subtle md:text-[11px]">
        Mini-game
      </p>
      <h1 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
        Global leaderboard
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        Top 50 personal-best scores. Codenames are generated per run; times are stored in UTC and
        shown in your local timezone.
      </p>

      <div className="mt-8 overflow-x-auto rounded border border-cell-border/80 bg-elevated/30">
        <table className="w-full min-w-[32rem] border-collapse text-left text-[11px] md:text-xs">
          <thead>
            <tr className="border-b border-cell-border/80 bg-bg/80 text-[10px] uppercase tracking-[0.08em] text-fg-muted">
              <th className="px-3 py-2.5 font-medium tabular-nums md:px-4">#</th>
              <th className="px-3 py-2.5 font-medium md:px-4">Codename</th>
              <th className="px-3 py-2.5 font-medium tabular-nums md:px-4">Score</th>
              <th className="px-3 py-2.5 font-medium md:px-4">Played</th>
              <th className="px-3 py-2.5 font-medium md:px-4">City</th>
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
              rows.map((r) => (
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
        <strong className="font-medium text-fg-muted">City column:</strong> When you submit a score
        on Vercel, we may store an approximate city from your connection (IP-based, same as many
        analytics CDNs)—not GPS-level location. It can be blank for privacy, VPNs, or local dev.{' '}
        <Link
          to="/privacy"
          className="text-fg-muted underline decoration-cell-border/80 underline-offset-[3px] transition-colors hover:text-fg/80 hover:decoration-hud"
        >
          Privacy policy
        </Link>
      </p>

      <p className="mt-6">
        <Link
          to="/"
          className="text-xs text-fg underline decoration-cell-border underline-offset-[3px] transition-colors hover:decoration-hud"
        >
          ← Back to home
        </Link>
      </p>
    </main>
  )
}
