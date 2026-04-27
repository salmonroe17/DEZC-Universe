import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CaseStudiesCardModal } from '../CaseStudiesCardModal'
import { ShowTellQuadrantModal } from '../ShowTellQuadrantModal'
import { ThemeSwatches } from '../ThemeSwatches'
import { CaseStudyRailShell } from './CaseStudyRailShell'
import {
  CaseStudyMobileSectionsModal,
  CaseStudyMobileSectionsRow,
} from './CaseStudyMobileToc'
import { CaseStudyScrollProgressBar } from './CaseStudyScrollProgressBar'
import { useCaseStudyScrollspy, type NavSection } from './useCaseStudyScrollspy'
import { CASE_STUDY_SHOWCASE_NAV } from '../../data/caseStudyShowcaseNav'
import { CaseStudyPresentationModeContext } from './CaseStudyPresentationModeContext'
import { ChamferFrame } from '../system/ChamferFrame'
import {
  CaseStudyPresentationOverlay,
  type CaseStudyPresentationSlide,
} from './CaseStudyPresentationOverlay'
import { FigmaFrame } from '../system/FigmaGrid'
import { SidebarNav } from '../system/SidebarNav'

const caseStudiesNavButtonClass =
  'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-inherit underline decoration-cell-border underline-offset-[3px] hover:decoration-hud'

/** Ignore tiny scroll deltas / layout nudges; require this much net movement to change chrome mode. */
const CHROME_SCROLL_COMMIT_PX = 22

/** After a chrome expand/collapse, ignore scroll-driven mode toggles so layout settle doesn’t flip state. */
const CHROME_SCROLL_MODE_COOLDOWN_MS = 420

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
  /** When provided, chamfer presentation slots open this fullscreen deck (indexed by `presentationMediaIndex`). */
  presentationSlides?: CaseStudyPresentationSlide[]
  /** Map each `presentationMediaIndex` from the page to a horizontal deck slide index (e.g. image vs copy split). */
  presentationMediaToSlideIndex?: (mediaIndex: number) => number
  /** Optional strip previews; same length as `presentationSlides` when provided. */
  presentationThumbnailSrcs?: readonly string[]
  /**
   * When true (default), presentation opens with “Text slides” on so `slideKind: 'text'` slides are included.
   * Set false for an image-first deck (see {@link CaseStudyPresentationOverlayProps.initialTextSlidesVisible}).
   */
  presentationInitialTextSlidesVisible?: boolean
  children: ReactNode
}

export type { CaseStudyPresentationSlide }

/**
 * Shared chrome + rail for long-form case studies that mirror `/case-study/components`
 * (progress bar, top nav, modal case list, sidebar scrollspy).
 */
export function CaseStudyShowcaseScaffold({
  sidebarKicker,
  caseStudiesModifierTo,
  navSections = CASE_STUDY_SHOWCASE_NAV,
  presentationSlides,
  presentationMediaToSlideIndex,
  presentationThumbnailSrcs,
  presentationInitialTextSlidesVisible,
  children,
}: CaseStudyShowcaseScaffoldProps) {
  const sectionsNavDialogTitleId = useId()
  const sectionsNavBtnRef = useRef<HTMLButtonElement>(null)
  /** Row 1 content box; measured while expanded so spacer/chrome height stays stable while row 1 is clipped. */
  const topRowContentRef = useRef<HTMLDivElement | null>(null)
  /** Sections row + progress bar (everything below row 1). */
  const tailChromeRef = useRef<HTMLDivElement | null>(null)
  const [topRowExpandedPx, setTopRowExpandedPx] = useState(56)
  const [tailChromePx, setTailChromePx] = useState(80)
  const caseStudiesNavRef = useRef<HTMLButtonElement>(null)
  const sideQuestsNavRef = useRef<HTMLButtonElement>(null)
  const showSidebarBtnRef = useRef<HTMLButtonElement>(null)
  const hideSidebarBtnRef = useRef<HTMLButtonElement>(null)
  const sidebarWasHiddenRef = useRef(false)
  const [sectionsNavOpen, setSectionsNavOpen] = useState(false)
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)
  const [sideQuestsModalOpen, setSideQuestsModalOpen] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [presentationActiveIndex, setPresentationActiveIndex] = useState(0)
  /** max-lg only: first chrome row (Home / Case studies / Swatches) hides on scroll down; shows again on scroll up. */
  const [showTopChromeRow, setShowTopChromeRow] = useState(true)

  const chromeHeight = tailChromePx + (showTopChromeRow ? topRowExpandedPx : 0)
  const { activeId, onNavigate, navSections: sidebarSections } = useCaseStudyScrollspy(
    navSections,
    { stickyOffsetPx: chromeHeight },
  )

  const closePresentationMode = useCallback(() => {
    setPresentationMode(false)
  }, [])

  const openPresentationMode = useCallback(
    (index: number) => {
      const slides = presentationSlides
      if (!slides?.length) return
      const mapped = presentationMediaToSlideIndex?.(index) ?? index
      const clamped = Math.max(0, Math.min(mapped, slides.length - 1))
      setPresentationActiveIndex(clamped)
      setPresentationMode(true)
    },
    [presentationMediaToSlideIndex, presentationSlides],
  )

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

  const sideQuestsModifierTo = '/#show-tell'

  const openSideQuestsModal = () => setSideQuestsModalOpen(true)
  const closeSideQuestsModal = () => {
    setSideQuestsModalOpen(false)
    queueMicrotask(() => sideQuestsNavRef.current?.focus({ preventScroll: true }))
  }

  const onSideQuestsNavClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      window.open(sideQuestsModifierTo, '_blank', 'noopener,noreferrer')
      return
    }
    openSideQuestsModal()
  }

  const closeSectionsNav = useCallback(() => {
    setSectionsNavOpen(false)
    queueMicrotask(() => sectionsNavBtnRef.current?.focus({ preventScroll: true }))
  }, [])

  useLayoutEffect(() => {
    const top = topRowContentRef.current
    const tail = tailChromeRef.current
    if (!tail) return undefined

    const sync = () => {
      setTailChromePx(Math.ceil(tail.getBoundingClientRect().height))
      if (showTopChromeRow && top) {
        const h = Math.ceil(top.getBoundingClientRect().height)
        if (h > 0) setTopRowExpandedPx(h)
      }
    }

    sync()
    const roTail = new ResizeObserver(sync)
    roTail.observe(tail)
    let roTop: ResizeObserver | undefined
    if (top) {
      roTop = new ResizeObserver(sync)
      roTop.observe(top)
    }
    const onWin = () => sync()
    window.addEventListener('resize', onWin)
    return () => {
      roTail.disconnect()
      roTop?.disconnect()
      window.removeEventListener('resize', onWin)
    }
  }, [showTopChromeRow])

  useLayoutEffect(() => {
    if (sidebarWasHiddenRef.current && !sidebarHidden) {
      queueMicrotask(() => hideSidebarBtnRef.current?.focus({ preventScroll: true }))
    }
    sidebarWasHiddenRef.current = sidebarHidden
  }, [sidebarHidden])

  const presentationModeRef = useRef(presentationMode)
  useLayoutEffect(() => {
    presentationModeRef.current = presentationMode
  }, [presentationMode])

  const scrollAccRef = useRef({ lastY: 0, down: 0, up: 0 })
  const chromeScrollLockUntilRef = useRef(0)

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    scrollAccRef.current.lastY = window.scrollY
    scrollAccRef.current.down = 0
    scrollAccRef.current.up = 0
  }, [presentationMode])

  /** Spacer/header height jump resets scroll subtly — realign baseline so we don’t treat it as user direction. */
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    scrollAccRef.current.lastY = window.scrollY
    scrollAccRef.current.down = 0
    scrollAccRef.current.up = 0
  }, [showTopChromeRow])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mqlNarrow = window.matchMedia('(max-width: 1023px)')
    let rafId = 0

    const flush = () => {
      rafId = 0
      const y = window.scrollY
      if (presentationModeRef.current) {
        scrollAccRef.current.lastY = y
        return
      }

      if (!mqlNarrow.matches) {
        chromeScrollLockUntilRef.current = 0
        scrollAccRef.current.lastY = y
        scrollAccRef.current.down = 0
        scrollAccRef.current.up = 0
        setShowTopChromeRow(true)
        return
      }

      const acc = scrollAccRef.current
      const now = Date.now()
      if (now < chromeScrollLockUntilRef.current) {
        acc.lastY = y
        return
      }

      const dy = y - acc.lastY
      acc.lastY = y

      if (y < 20) {
        chromeScrollLockUntilRef.current = 0
        acc.down = 0
        acc.up = 0
        setShowTopChromeRow(true)
        return
      }

      if (Math.abs(dy) < 0.75) return

      if (dy > 0) {
        acc.down += dy
        acc.up = 0
        if (acc.down >= CHROME_SCROLL_COMMIT_PX) {
          acc.down = 0
          chromeScrollLockUntilRef.current = now + CHROME_SCROLL_MODE_COOLDOWN_MS
          setShowTopChromeRow((prev) => (prev ? false : prev))
        }
      } else {
        acc.up += -dy
        acc.down = 0
        if (acc.up >= CHROME_SCROLL_COMMIT_PX) {
          acc.up = 0
          chromeScrollLockUntilRef.current = now + CHROME_SCROLL_MODE_COOLDOWN_MS
          setShowTopChromeRow((prev) => (prev ? prev : true))
        }
      }
    }

    const onScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(flush)
    }

    const onLayoutChange = () => {
      chromeScrollLockUntilRef.current = 0
      scrollAccRef.current.lastY = window.scrollY
      scrollAccRef.current.down = 0
      scrollAccRef.current.up = 0
      if (!mqlNarrow.matches) {
        setShowTopChromeRow(true)
      }
    }

    scrollAccRef.current.lastY = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    mqlNarrow.addEventListener('change', onLayoutChange)
    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      mqlNarrow.removeEventListener('change', onLayoutChange)
    }
  }, [])

  const collapseTopRowOnNarrow = !presentationMode && !showTopChromeRow

  const chromeHeader = (
    <header className="site-frosted-nav fixed inset-x-0 top-0 z-[80] flex flex-col">
      <div
        className={[
          /* No height/transform transition on narrow: animated clip fights scroll anchoring and causes mode flutter. */
          'max-lg:min-h-0 max-lg:overflow-hidden max-lg:transition-none',
          'max-lg:h-[var(--cs-top-row-clip)]',
          'lg:h-auto lg:overflow-visible',
        ].join(' ')}
        style={
          {
            ['--cs-top-row-clip' as string]: collapseTopRowOnNarrow
              ? '0px'
              : `${Math.max(1, topRowExpandedPx)}px`,
          } as CSSProperties
        }
        aria-hidden={collapseTopRowOnNarrow ? true : undefined}
      >
        <div
          className={[
            'min-h-0 overflow-hidden [contain:content] lg:overflow-visible',
            'max-lg:transition-none',
            collapseTopRowOnNarrow ? 'max-lg:-translate-y-full' : 'max-lg:translate-y-0',
            'lg:translate-y-0',
          ].join(' ')}
        >
          <div ref={topRowContentRef} className="min-h-0">
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
                <button
                  ref={sideQuestsNavRef}
                  type="button"
                  className={caseStudiesNavButtonClass}
                  onClick={onSideQuestsNavClick}
                >
                  Side quests
                </button>
              </nav>
              <ThemeSwatches />
            </FigmaFrame>
          </div>
        </div>
      </div>
      <div ref={tailChromeRef} className="flex w-full flex-col">
        <div className="w-full max-w-none px-0 lg:hidden">
          <CaseStudyMobileSectionsRow
            ref={sectionsNavBtnRef}
            dialogTitleId={sectionsNavDialogTitleId}
            sections={sidebarSections}
            activeId={activeId}
            open={sectionsNavOpen}
            onOpenChange={setSectionsNavOpen}
          />
        </div>
        <CaseStudyScrollProgressBar />
      </div>
    </header>
  )

  return (
    <CaseStudyPresentationModeContext.Provider value={openPresentationMode}>
      <div
        className="cs-showcase-body min-h-0 min-w-0 max-w-full flex-1 overflow-x-clip font-mono text-fg antialiased"
        style={
          {
            '--cs-components-header-h': `${chromeHeight}px`,
          } as CSSProperties
        }
      >
        {typeof document !== 'undefined' ? createPortal(chromeHeader, document.body) : null}
        <CaseStudyMobileSectionsModal
          titleId={sectionsNavDialogTitleId}
          sections={sidebarSections}
          activeId={activeId}
          onNavigate={onNavigate}
          open={sectionsNavOpen}
          onClose={closeSectionsNav}
        />
        <CaseStudyPresentationOverlay
          open={presentationMode}
          activeIndex={presentationActiveIndex}
          slides={presentationSlides ?? []}
          thumbnailSrcs={presentationThumbnailSrcs}
          onClose={closePresentationMode}
          onActiveIndexChange={setPresentationActiveIndex}
          initialTextSlidesVisible={presentationInitialTextSlidesVisible}
        />
        <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
        <ShowTellQuadrantModal open={sideQuestsModalOpen} onClose={closeSideQuestsModal} />
        <div className="shrink-0" style={{ height: chromeHeight }} aria-hidden />

        <CaseStudyRailShell
          frameClassName="cs-showcase-frame pb-24 pt-4 max-lg:pt-2 md:pb-28 md:pt-10 lg:pb-32 lg:pt-12"
          gridClassName="items-start"
          asideClassName="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--cs-components-header-h)+24px)] lg:self-start"
          mainClassName="flex min-w-0 max-w-full flex-col gap-8 md:gap-10 port-md:gap-10 lg:gap-14"
          sidebarHidden={sidebarHidden}
          sidebar={
            <>
              <p className="text-[11px] font-normal leading-snug text-fg md:text-[12px] md:leading-relaxed">
                {sidebarKicker}
              </p>
              <div className="flex min-w-0 flex-col gap-3">
                <SidebarNav
                  embedded
                  sections={sidebarSections}
                  activeId={activeId}
                  onNavigate={onNavigate}
                />
                <button
                  ref={hideSidebarBtnRef}
                  type="button"
                  aria-controls="case-study-sidebar"
                  aria-expanded={!sidebarHidden}
                  onClick={() => {
                    setSidebarHidden(true)
                    queueMicrotask(() => showSidebarBtnRef.current?.focus({ preventScroll: true }))
                  }}
                  className="hidden w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-mono text-[11px] font-normal leading-snug tracking-[0.02em] text-fg-muted underline decoration-cell-border/70 underline-offset-[3px] transition-colors hover:text-fg hover:decoration-hud lg:inline"
                >
                  Hide sidebar
                </button>
              </div>
            </>
          }
        >
          {sidebarHidden ? (
            <div className="sticky top-[calc(var(--cs-components-header-h)+12px)] z-[70] hidden max-w-full shrink-0 self-start lg:inline-flex">
              <ChamferFrame
                fitContentHeight
                staticVisual
                className="inline-flex max-w-none min-w-0 shadow-[0_2px_12px_color-mix(in_srgb,var(--color-hud)_20%,transparent)] [--quadrant-chamfer:clamp(4px,0.65vmin,8px)]"
                innerClassName="w-max max-w-full bg-white px-3 py-2"
              >
                <button
                  ref={showSidebarBtnRef}
                  type="button"
                  aria-controls="case-study-sidebar"
                  aria-expanded={false}
                  onClick={() => setSidebarHidden(false)}
                  className="m-0 block cursor-pointer border-0 bg-transparent p-0 text-left font-mono text-[10px] font-medium leading-snug tracking-[0.02em] text-black underline decoration-black/35 underline-offset-[3px] transition-colors hover:decoration-black md:text-[11px] lg:text-[11px]"
                >
                  Show sidebar
                </button>
              </ChamferFrame>
            </div>
          ) : null}
          {children}
        </CaseStudyRailShell>
      </div>
    </CaseStudyPresentationModeContext.Provider>
  )
}
