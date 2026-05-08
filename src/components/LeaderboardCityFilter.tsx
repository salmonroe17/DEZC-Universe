import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CaretDown, MagnifyingGlass, XCircle } from '@phosphor-icons/react'
import type { LeaderboardFullRow } from '../lib/leaderboard'
import {
  getDefaultExcludedCities,
  parseExcludedCityNames,
} from '../lib/leaderboardExcludeCities'

/** Shown on hover (native tooltip) — keeps the UI quiet. */
const FILTER_TOOLTIP = [
  `Checked cities hide every board row that matches that approximate city (case-insensitive).`,
  `Selections are saved only in this browser. Reset clears every choice so all cities from the downloaded board are shown.`,
  `Rows with a blank or unknown city never match (they always stay visible).`,
].join(' ')

function mergeCityOptions(rows: LeaderboardFullRow[], excluded: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  function add(label: string) {
    const t = label.trim()
    if (!t) return
    const k = t.toLowerCase()
    if (seen.has(k)) return
    seen.add(k)
    out.push(t)
  }
  for (const c of excluded) add(c)
  for (const r of rows) {
    if (r.city?.trim()) add(r.city.trim())
  }
  return out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

type Props = {
  boardRows: LeaderboardFullRow[]
  excludedCities: string[]
  onExcludedCitiesChange: (next: string[]) => void
}

export function LeaderboardCityFilter({
  boardRows,
  excludedCities,
  onExcludedCitiesChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [customDraft, setCustomDraft] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const options = useMemo(
    () => mergeCityOptions(boardRows, excludedCities),
    [boardRows, excludedCities],
  )

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [options, search])

  const excludedLower = useMemo(
    () => new Set(excludedCities.map((c) => c.trim().toLowerCase()).filter(Boolean)),
    [excludedCities],
  )

  const closePanel = useCallback(() => {
    setOpen(false)
    setSearch('')
    setCustomDraft('')
  }, [])

  const openPanel = useCallback(() => {
    setSearch('')
    setCustomDraft('')
    setOpen(true)
    queueMicrotask(() => searchInputRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!open) return
    function onDocMouse(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) closePanel()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closePanel()
    }
    document.addEventListener('mousedown', onDocMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, closePanel])

  function togglePanel() {
    if (open) closePanel()
    else openPanel()
  }

  function toggleCity(cityLabel: string) {
    const k = cityLabel.trim().toLowerCase()
    const has = excludedLower.has(k)
    if (has) {
      onExcludedCitiesChange(
        excludedCities.filter((x) => x.trim().toLowerCase() !== k),
      )
      return
    }
    onExcludedCitiesChange(parseExcludedCityNames([...excludedCities, cityLabel].join(',')))
  }

  function removeCity(cityLabel: string) {
    const k = cityLabel.trim().toLowerCase()
    onExcludedCitiesChange(
      excludedCities.filter((x) => x.trim().toLowerCase() !== k),
    )
  }

  function addCustomCity() {
    const added = parseExcludedCityNames(customDraft)
    if (added.length === 0) return
    onExcludedCitiesChange(
      parseExcludedCityNames([...excludedCities, ...added].join(',')),
    )
    setCustomDraft('')
  }

  const isExcluded = (label: string) =>
    excludedLower.has(label.trim().toLowerCase())

  const triggerSummary =
    excludedCities.length === 0
      ? 'Showing all cities'
      : excludedCities.length === 1
        ? `Hiding · ${excludedCities[0]}`
        : `Hiding · ${excludedCities.length} cities`

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-fg-muted">
          Hide cities
        </span>
        <button
          type="button"
          onClick={() => onExcludedCitiesChange(getDefaultExcludedCities())}
          className="text-[11px] text-fg-muted underline decoration-cell-border/70 underline-offset-[3px] transition-colors hover:text-fg/85 hover:decoration-hud"
        >
          Reset
        </button>
      </div>
      <button
        type="button"
        id={`${listboxId}-trigger`}
        title={FILTER_TOOLTIP}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={`${listboxId}-panel`}
        onClick={togglePanel}
        className="mt-2 inline-flex min-h-9 w-full min-w-0 items-center justify-between gap-2 rounded border border-cell-border/80 bg-bg px-3 py-2 text-left text-xs text-fg outline-none ring-hud/40 transition-[box-shadow,border-color] hover:border-cell-border focus-visible:ring-2"
      >
        <span className="min-w-0 truncate font-medium tabular-nums">{triggerSummary}</span>
        <CaretDown
          className={`h-4 w-4 shrink-0 text-fg-muted transition-transform ${open ? 'rotate-180' : ''}`}
          weight="bold"
          aria-hidden
        />
      </button>

      {excludedCities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {excludedCities.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => removeCity(c)}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-cell-border/70 bg-elevated/25 py-0.5 pl-2 pr-1.5 text-[10px] font-medium text-fg/90 transition-colors hover:border-hud/35 hover:bg-elevated/40"
              aria-label={`Stop hiding ${c}`}
              title={`Remove ${c} from hidden list`}
            >
              <span className="truncate">{c}</span>
              <XCircle className="h-3.5 w-3.5 shrink-0 opacity-70" weight="bold" aria-hidden />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          id={`${listboxId}-panel`}
          aria-label="City filter"
          className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-[min(22rem,70vh)] overflow-hidden rounded border border-cell-border/90 bg-bg shadow-lg ring-1 ring-black/5 sm:right-auto sm:w-[min(22rem,calc(100vw-2rem))]"
        >
          <div className="border-b border-cell-border/70 p-2">
            <div className="relative">
              <MagnifyingGlass
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle"
                aria-hidden
              />
              <input
                ref={searchInputRef}
                type="search"
                autoComplete="off"
                placeholder="Search cities…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded border border-cell-border/80 bg-bg py-2 pl-8 pr-2 text-[11px] text-fg outline-none ring-hud/30 placeholder:text-fg-subtle focus:ring-2"
              />
            </div>
          </div>
          <div className="hide-scrollbar-thumb max-h-[min(13rem,40vh)] overflow-y-auto px-1 py-1">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-fg-muted">
                No city names match search. Use “Add city” below.
              </p>
            ) : (
              <ul className="m-0 list-none space-y-0.5 p-0">
                {filteredOptions.map((city) => {
                  const checked = isExcluded(city)
                  return (
                    <li key={city.toLowerCase()}>
                      <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-[11px] text-fg transition-colors hover:bg-elevated/40">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCity(city)}
                          className="h-3.5 w-3.5 shrink-0 accent-hud"
                        />
                        <span className="min-w-0 flex-1 truncate">{city}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div className="border-t border-cell-border/70 p-2">
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.1em] text-fg-muted">
              Add city
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                autoComplete="off"
                placeholder="City not on board yet…"
                value={customDraft}
                onChange={(e) => setCustomDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomCity()
                  }
                }}
                className="min-w-0 flex-1 rounded border border-cell-border/80 bg-bg px-2 py-1.5 text-[11px] text-fg outline-none ring-hud/30 placeholder:text-fg-subtle focus:ring-2"
              />
              <button
                type="button"
                onClick={addCustomCity}
                className="shrink-0 rounded border border-cell-border/80 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-fg transition-colors hover:border-hud/50 hover:bg-fg/[0.04]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
