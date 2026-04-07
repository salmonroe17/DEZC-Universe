import type { SiteTheme } from '../contexts/siteThemeContext'
import { useSiteTheme } from '../contexts/useSiteTheme'

const THEMES: { id: SiteTheme; label: string }[] = [
  { id: 'grey', label: 'Grey' },
  { id: 'cyan', label: 'Turquoise' },
  { id: 'magenta', label: 'Magenta' },
  { id: 'blue', label: 'Blue' },
]

const SWATCH: Record<SiteTheme, { selected: string; idle: string }> = {
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

type ThemeSwatchesProps = {
  className?: string
}

/** Same controls as {@link SiteTopBar} — uses global theme from {@link SiteThemeProvider}. */
export function ThemeSwatches({ className = '' }: ThemeSwatchesProps) {
  const { theme, setTheme } = useSiteTheme()

  return (
    <div
      className={`flex shrink-0 items-center gap-1.5 ${className}`}
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
  )
}
