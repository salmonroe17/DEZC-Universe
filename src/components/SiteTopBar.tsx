import { useEffect, useLayoutEffect, useState } from 'react'

export type SiteTheme = 'grey' | 'cyan' | 'magenta' | 'blue'

const THEMES: { id: SiteTheme; label: string }[] = [
  { id: 'grey', label: 'Grey' },
  { id: 'cyan', label: 'Turquoise' },
  { id: 'magenta', label: 'Magenta' },
  { id: 'blue', label: 'Blue' },
]

/** Inactive = outline only; active = solid fill (no selection ring). */
const SWATCH: Record<
  SiteTheme,
  { selected: string; idle: string }
> = {
  grey: {
    selected: 'bg-zinc-500',
    idle: 'border border-zinc-400 bg-transparent',
  },
  cyan: {
    selected: 'bg-teal-400',
    idle: 'border-2 border-teal-400 bg-transparent',
  },
  magenta: {
    selected: 'bg-fuchsia-400',
    idle: 'border-2 border-fuchsia-400 bg-transparent',
  },
  blue: {
    selected: 'bg-blue-400',
    idle: 'border-2 border-blue-400 bg-transparent',
  },
}

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
  const [theme, setTheme] = useState<SiteTheme>('grey')
  const [clock, setClock] = useState(formatTorontoClock)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTorontoClock()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <header className="relative z-0 grid h-12 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-border bg-bg/95 px-3 backdrop-blur-sm sm:gap-4 sm:px-6">
      <p className="min-w-0 truncate text-[10px] text-fg tracking-tight">
        Welcome to the DEZC universe
      </p>

      <div
        className="flex shrink-0 items-center gap-1.5"
        role="group"
        aria-label="Theme color"
      >
        {THEMES.map(({ id, label }) => {
          const sw = SWATCH[id]
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
              className={`size-[18px] shrink-0 rounded-sm transition-[transform,background-color,border-color] hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg ${
                theme === id ? `${sw.selected} border-0` : sw.idle
              }`}
            />
          )
        })}
      </div>

      <time
        className="justify-self-end text-[10px] tabular-nums text-fg-muted"
        dateTime={new Date().toISOString()}
        suppressHydrationWarning
      >
        {clock}
      </time>
    </header>
  )
}
