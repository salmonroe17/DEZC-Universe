import { useEffect, useState } from 'react'
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
  const [clock, setClock] = useState(formatTorontoClock)

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTorontoClock()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="site-frosted-nav grid h-12 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-border px-3 sm:gap-4 sm:px-6">
      <p className="min-w-0 truncate text-[10px] tracking-tight text-fg">
        Welcome to the DEZC universe
      </p>

      <ThemeSwatches />

      <time
        className="justify-self-end text-[10px] tabular-nums text-fg-muted"
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
