import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CaseStudiesCardModal } from '../CaseStudiesCardModal'
import { ThemeSwatches } from '../ThemeSwatches'
import { CaseStudyRailShell } from './CaseStudyRailShell'
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
  children,
}: CaseStudyShowcaseScaffoldProps) {
  const { activeId, onNavigate, navSections: sidebarSections } = useCaseStudyScrollspy(navSections)
  const chromeRef = useRef<HTMLElement | null>(null)
  const caseStudiesNavRef = useRef<HTMLButtonElement>(null)
  const showSidebarBtnRef = useRef<HTMLButtonElement>(null)
  const hideSidebarBtnRef = useRef<HTMLButtonElement>(null)
  const sidebarWasHiddenRef = useRef(false)
  /** Until ResizeObserver measures the portaled header, avoid under-counting (nav + progress rail). */
  const [chromeHeight, setChromeHeight] = useState(92)
  const [caseStudiesModalOpen, setCaseStudiesModalOpen] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [presentationActiveIndex, setPresentationActiveIndex] = useState(0)

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
            Side quests
          </Link>
        </nav>
        <ThemeSwatches />
      </FigmaFrame>
      <CaseStudyScrollProgressBar />
    </header>
  )

  return (
    <CaseStudyPresentationModeContext.Provider value={openPresentationMode}>
      <div
        className="min-h-0 flex-1 font-mono text-fg antialiased"
        style={
          {
            '--cs-components-header-h': `${chromeHeight}px`,
          } as CSSProperties
        }
      >
        {typeof document !== 'undefined' ? createPortal(chromeHeader, document.body) : null}
        <CaseStudyPresentationOverlay
          open={presentationMode}
          activeIndex={presentationActiveIndex}
          slides={presentationSlides ?? []}
          thumbnailSrcs={presentationThumbnailSrcs}
          onClose={closePresentationMode}
          onActiveIndexChange={setPresentationActiveIndex}
        />
        <CaseStudiesCardModal open={caseStudiesModalOpen} onClose={closeCaseStudiesModal} />
        <div className="shrink-0" style={{ height: chromeHeight }} aria-hidden />

        <CaseStudyRailShell
          frameClassName="pb-32 pt-8 md:pt-10 lg:pt-12"
          gridClassName="items-start"
          asideClassName="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--cs-components-header-h)+24px)] lg:self-start"
          mainClassName="flex flex-col gap-10 lg:gap-14"
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
                  className="w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-mono text-[10px] font-normal leading-snug tracking-[0.02em] text-fg-muted underline decoration-cell-border/70 underline-offset-[3px] transition-colors hover:text-fg hover:decoration-hud md:text-[11px]"
                >
                  Hide sidebar
                </button>
              </div>
            </>
          }
        >
          {sidebarHidden ? (
            <div className="sticky top-[calc(var(--cs-components-header-h)+12px)] z-[70] inline-flex max-w-full shrink-0 self-start">
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
                  className="m-0 block cursor-pointer border-0 bg-transparent p-0 text-left font-mono text-[10px] font-medium leading-snug tracking-[0.02em] text-black underline decoration-black/35 underline-offset-[3px] transition-colors hover:decoration-black md:text-[11px]"
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
