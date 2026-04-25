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
import {
  CaseStudyPresentationModeContext,
  ChamferFrame,
} from '../system/ChamferFrame'
import {
  CaseStudyPresentationOverlay,
  type CaseStudyPresentationSlide,
} from './CaseStudyPresentationOverlay'
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
  /** When provided, chamfer presentation slots open this fullscreen deck (indexed by `presentationMediaIndex`). */
  presentationSlides?: CaseStudyPresentationSlide[]
  /** Map each `presentationMediaIndex` from the page to a horizontal deck slide index (e.g. image vs copy split). */
  presentationMediaToSlideIndex?: (mediaIndex: number) => number
  /** Optional strip previews; same length as `presentationSlides` when provided. */
  presentationThumbnailSrcs?: readonly string[]
  /**
   * When true, presentation opens with “Text slides” on so `slideKind: 'text'` slides are included
   * (see {@link CaseStudyPresentationOverlayProps.initialTextSlidesVisible}).
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
  /** Until ResizeObserver measures the portaled header, avoid under-counting (nav + sections row + progress rail). */
  const [chromeHeight, setChromeHeight] = useState(92)
  const { activeId, onNavigate, navSections: sidebarSections } = useCaseStudyScrollspy(
    navSections,
    { stickyOffsetPx: chromeHeight },
  )
  const chromeRef = useRef<HTMLElement | null>(null)
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
  const lastScrollYRef = useRef(0)

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

  useLayoutEffect(() => {
    if (sidebarWasHiddenRef.current && !sidebarHidden) {
      queueMicrotask(() => hideSidebarBtnRef.current?.focus({ preventScroll: true }))
    }
    sidebarWasHiddenRef.current = sidebarHidden
  }, [sidebarHidden])

  useEffect(() => {
    if (presentationMode) {
      setShowTopChromeRow(true)
    }
  }, [presentationMode])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mqlNarrow = window.matchMedia('(max-width: 1023px)')

    const isNarrowTwoRow = () => mqlNarrow.matches

    const onScroll = () => {
      if (presentationMode) return
      if (!isNarrowTwoRow()) {
        setShowTopChromeRow(true)
        return
      }
      const y = window.scrollY
      if (y < 20) {
        setShowTopChromeRow(true)
        lastScrollYRef.current = y
        return
      }
      const prev = lastScrollYRef.current
      lastScrollYRef.current = y
      if (y < prev - 2) {
        setShowTopChromeRow(true)
      } else if (y > prev + 2) {
        setShowTopChromeRow(false)
      }
    }

    const onLayoutChange = () => {
      if (!isNarrowTwoRow()) {
        setShowTopChromeRow(true)
      }
    }

    lastScrollYRef.current = window.scrollY
    window.addEventListener('scroll', onScroll, { passive: true })
    mqlNarrow.addEventListener('change', onLayoutChange)
    return () => {
      window.removeEventListener('scroll', onScroll)
      mqlNarrow.removeEventListener('change', onLayoutChange)
    }
  }, [presentationMode])

  const collapseTopRowOnNarrow = !showTopChromeRow
  const topChromeRowGridClass = [
    'grid transition-[grid-template-rows] ease-out motion-reduce:transition-none',
    'lg:grid-rows-[1fr]',
    collapseTopRowOnNarrow ? 'max-lg:grid-rows-[0fr] max-lg:duration-200' : 'max-lg:grid-rows-[1fr] max-lg:duration-200',
  ].join(' ')

  const chromeHeader = (
    <header
      ref={chromeRef}
      className="site-frosted-nav fixed inset-x-0 top-0 z-[80] flex flex-col"
    >
      <div
        className={topChromeRowGridClass}
        aria-hidden={collapseTopRowOnNarrow ? true : undefined}
      >
        <div className="min-h-0 overflow-hidden [contain:content]">
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
