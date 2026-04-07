import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CaseStudiesCardModal } from '../CaseStudiesCardModal'
import { ThemeSwatches } from '../ThemeSwatches'
import { CaseStudyRailShell } from './CaseStudyRailShell'
import { CaseStudyScrollProgressBar } from './CaseStudyScrollProgressBar'
import { useCaseStudyScrollspy, type NavSection } from './useCaseStudyScrollspy'
import { CASE_STUDY_SHOWCASE_NAV } from '../../data/caseStudyShowcaseNav'
import { FigmaFrame } from '../system/FigmaGrid'
import { SidebarNav } from '../system/SidebarNav'

const caseStudiesNavButtonClass =
  'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline decoration-cell-border underline-offset-[3px] hover:decoration-hud'

export type CaseStudyShowcaseScaffoldProps = {
  /** Short label above the TOC (case study name). */
  sidebarKicker: string
  /**
   * Modifier-click (⌘/Ctrl/Shift/Alt) on “Case studies” opens this path in a new tab
   * — e.g. production page when on `/case-study/components`, reference page when on Carbon.
   */
  caseStudiesModifierTo: string
  /** Sidebar scroll targets; defaults to full components-reference TOC. */
  navSections?: NavSection[]
  children: ReactNode
}

/**
 * Shared chrome + rail for long-form case studies that mirror `/case-study/components`
 * (progress bar, top nav, modal case list, sidebar scrollspy).
 */
export function CaseStudyShowcaseScaffold({
  sidebarKicker,
  caseStudiesModifierTo,
  navSections = CASE_STUDY_SHOWCASE_NAV,
  children,
}: CaseStudyShowcaseScaffoldProps) {
  const { activeId, onNavigate } = useCaseStudyScrollspy(navSections)
  const chromeRef = useRef<HTMLElement | null>(null)
  const caseStudiesNavRef = useRef<HTMLButtonElement>(null)
  const [chromeHeight, setChromeHeight] = useState(52)
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)

  const openCaseStudiesModal = () => setCaseStudiesModalOpen(true)
  const closeCaseStudiesModal = () => {
    setCaseStudiesModalOpen(false)
    queueMicrotask(() => caseStudiesNavRef.current?.focus({ preventScroll: true }))
  }

  const onCaseStudiesNavClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      window.open(caseStudiesModifierTo, '_blank', 'noopener,noreferrer')
      return
    }
    openCaseStudiesModal()
  }

  useLayoutEffect(() => {
    const el = chromeRef.current
    if (!el) return undefined

    const sync = () => {
      setChromeHeight(Math.ceil(el.getBoundingClientRect().height))
    }
    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
    }
  }, [])

  const chromeHeader = (
    <header
      ref={chromeRef}
      className="site-frosted-nav fixed inset-x-0 top-0 z-[80] flex flex-col"
    >
      <FigmaFrame className="flex w-full flex-wrap items-center justify-between gap-2 py-2.5 sm:gap-3 sm:py-3 lg:min-h-12 lg:flex-nowrap lg:items-center lg:py-0">
        <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] font-normal leading-none text-fg md:gap-x-2 md:text-[11px]">
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
          <Link
            to="/#show-tell"
            className="underline decoration-cell-border underline-offset-[3px] hover:decoration-hud"
          >
            Show &amp; tell
          </Link>
        </nav>
        <ThemeSwatches />
      </FigmaFrame>
      <CaseStudyScrollProgressBar />
    </header>
  )

  return (
    <div
      className="min-h-0 flex-1 font-mono text-fg antialiased"
      style={
        {
          '--cs-components-header-h': `${chromeHeight}px`,
        } as CSSProperties
      }
    >
      {typeof document !== 'undefined' ? createPortal(chromeHeader, document.body) : null}
      <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
      <div className="shrink-0" style={{ height: chromeHeight }} aria-hidden />

      <CaseStudyRailShell
        frameClassName="pb-32 pt-[24px]"
        gridClassName="items-start"
        asideClassName="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--cs-components-header-h)+24px)] lg:self-start"
        mainClassName="flex flex-col gap-10 lg:gap-14"
        sidebar={
          <>
            <p className="text-[11px] font-normal leading-snug text-fg md:text-[12px] md:leading-relaxed">
              {sidebarKicker}
            </p>
            <SidebarNav
              embedded
              sections={navSections}
              activeId={activeId}
              onNavigate={onNavigate}
            />
          </>
        }
      >
        {children}
      </CaseStudyRailShell>
    </div>
  )
}
