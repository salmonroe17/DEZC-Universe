import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CaseStudiesCardModal } from './CaseStudiesCardModal'
import { ShowTellQuadrantModal } from './ShowTellQuadrantModal'
import { ThemeSwatches } from './ThemeSwatches'

const caseStudiesNavButtonClass =
  'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline decoration-cell-border underline-offset-[3px] hover:decoration-hud'

/** Modifier+click target — same as production case study showcase chrome. */
const CASE_STUDIES_MODIFIER_TO = '/case-study/components'
const SIDE_QUESTS_MODIFIER_TO = '/#show-tell'

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
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)
  const [sideQuestsModalOpen, setSideQuestsModalOpen] = useState(false)
  const caseStudiesNavRef = useRef<HTMLButtonElement>(null)
  const sideQuestsNavRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const id = window.setInterval(() => setClock(formatTorontoClock()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const closeCaseStudiesModal = () => {
    setCaseStudiesModalOpen(false)
    queueMicrotask(() => caseStudiesNavRef.current?.focus({ preventScroll: true }))
  }

  const closeSideQuestsModal = () => {
    setSideQuestsModalOpen(false)
    queueMicrotask(() => sideQuestsNavRef.current?.focus({ preventScroll: true }))
  }

  const onCaseStudiesNavClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      window.open(CASE_STUDIES_MODIFIER_TO, '_blank', 'noopener,noreferrer')
      return
    }
    setCaseStudiesModalOpen(true)
  }

  const onSideQuestsNavClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      window.open(SIDE_QUESTS_MODIFIER_TO, '_blank', 'noopener,noreferrer')
      return
    }
    setSideQuestsModalOpen(true)
  }

  return (
    <>
      <div
        className={[
          'site-frosted-nav grid h-12 w-full shrink-0 items-center gap-3 border-b border-border px-3 sm:gap-4 sm:px-6',
          isHome
            ? 'max-lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'
            : 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
        ].join(' ')}
      >
        <nav
          className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-normal leading-none text-fg md:gap-x-2 md:text-[11px]"
          aria-label="Site"
        >
          <Link
            to="/"
            className="underline decoration-cell-border underline-offset-[3px] hover:decoration-hud"
          >
            Home
          </Link>
          <span className="text-fg-muted">•</span>
          <button
            ref={caseStudiesNavRef}
            type="button"
            className={caseStudiesNavButtonClass}
            onClick={onCaseStudiesNavClick}
          >
            Case studies
          </button>
          <span className="text-fg-muted">•</span>
          <button
            ref={sideQuestsNavRef}
            type="button"
            className={caseStudiesNavButtonClass}
            onClick={onSideQuestsNavClick}
          >
            Side quests
          </button>
        </nav>

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
      <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
      <ShowTellQuadrantModal open={sideQuestsModalOpen} onClose={closeSideQuestsModal} />
    </>
  )
}

// Re-export for consumers that only need the type / provider.
export type { SiteTheme } from '../contexts/siteThemeContext'
