import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ThemeSwatches } from './ThemeSwatches'

function formatTorontoClock() {
  const d = new Date()
  const dateStr = d
    .toLocaleDateString('en-US', {
      timeZone: 'America/Toronto',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .replace(/,/g, '')
  const timeStr = d.toLocaleTimeString('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  return `Toronto • ${dateStr} • ${timeStr}`
}

export function SiteTopBar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [clock, setClock] = useState(formatTorontoClock)

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTorontoClock()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className={[
        'site-frosted-nav grid h-12 w-full shrink-0 items-center gap-3 border-b border-border px-3 sm:gap-4 sm:px-6',
        isHome
          ? 'max-lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'
          : 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
      ].join(' ')}
    >
      <p className="min-w-0 truncate text-[10px] tracking-tight text-fg">
        {isHome ? (
          <>
            <span className="max-lg:inline lg:hidden">DEZC</span>
            <span className="hidden lg:inline">Welcome to the DEZC universe</span>
          </>
        ) : (
          'Welcome to the DEZC universe'
        )}
      </p>

      <div className={isHome ? 'max-lg:justify-self-end' : undefined}>
        <ThemeSwatches />
      </div>

      <time
        className={[
          'justify-self-end text-[10px] tabular-nums text-fg-muted',
          isHome ? 'max-lg:hidden' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        dateTime={new Date().toISOString()}
        suppressHydrationWarning
      >
        {clock}
      </time>
    </div>
  )
}

// Re-export for consumers that only need the type / provider.
export type { SiteTheme } from '../contexts/siteThemeContext'
