import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useMajorityInView } from '../hooks/useMajorityInView'
import { CaseStudyList } from './CaseStudyList'
import { Fake3DCube } from './Fake3DCube'
import { quadrantHeadingClass } from './showTellQuadrantTypography'

/** Aligns with Tailwind `lg` (1024px): effects apply on smaller widths only. */
const MAX_LG_MEDIA = '(max-width: 1023px)'

/** Chamfered border + fill via ::before/::after (see index.css). */
const quadrantCell = 'quadrant-cell min-h-0 min-w-0'

/**
 * Home grid stacks quadrants full-width below `lg`; the 1/3 `max-w` is only for the split 2+1
 * column. Used for the home Case Studies tile and footer layout; the quick-nav modal adds 48px
 * (see {@link CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS}).
 */
const caseStudiesHomeColumnWidthClass =
  'w-full min-w-0 max-w-full lg:max-w-[calc((100vw-2.5rem-1rem)/3)]'

const footerHomeGridWidthClass = caseStudiesHomeColumnWidthClass

/**
 * Case studies quick-nav modal: home Case Studies column width + 48px so the dialog is a bit less
 * narrow on large viewports (see `caseStudiesHomeColumnWidthClass`). `shrink-0` keeps the
 * flex-centred dialog from shrinking. Pair with `footerColumn="modal-wide"` on the panel.
 */
export const CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS =
  'w-full min-w-0 max-w-full lg:max-w-[calc((100vw-2.5rem-1rem)/3+48px)] shrink-0'

/**
 * Footer layout: taller than the home grid estimate, capped by viewport so it feels like a hero
 * module; cube is vertically centered in the flex-1 band above the list.
 */
const footerPanelHeightClass =
  'min-h-[max(30rem,min(72svh,44rem))] md:min-h-[max(38rem,min(78svh,52rem))]'

export type ExperimentalCaseStudiesPanelProps = {
  /** When false, list progress / cube auto-advance stay paused (e.g. end of a case study). */
  autoRotate?: boolean
  /** `quadrant`: fill grid cell on the home page. `footer`: home-matched width + top-row height. */
  layout?: 'quadrant' | 'footer'
  /** Pinned to the chamfered card’s top-right (`footer` layout only), e.g. modal dismiss. */
  topRightSlot?: ReactNode
  /**
   * Max width for `footer` layout only. `home-grid` matches the home Case Studies column (~⅓ viewport);
   * `modal-wide` uses a comfortable reading width up to 48rem.
   */
  footerColumn?: 'home-grid' | 'modal-wide'
  /**
   * `footer` only: min visible fraction of the chamfered shell for `data-quadrant-in-view` on narrow
   * viewports (see {@link MAX_LG_MEDIA}). Modal uses a lower ratio so the glow appears while the
   * panel is still partly scroll-clipped.
   */
  footerInViewMinRatio?: number
}

export function ExperimentalCaseStudiesPanel({
  autoRotate = true,
  layout = 'quadrant',
  topRightSlot,
  footerColumn = 'home-grid',
  footerInViewMinRatio = 0.5,
}: ExperimentalCaseStudiesPanelProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [caseListPointerInside, setCaseListPointerInside] = useState(false)
  const [footerShellEl, setFooterShellEl] = useState<HTMLDivElement | null>(null)
  const [footerNarrowWidth, setFooterNarrowWidth] = useState(false)

  useEffect(() => {
    if (layout !== 'footer') return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(MAX_LG_MEDIA)
    const sync = () => setFooterNarrowWidth(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [layout])

  const footerNarrowMajorityInView = useMajorityInView(
    layout === 'footer' ? footerShellEl : null,
    layout === 'footer' && footerNarrowWidth,
    footerInViewMinRatio,
  )

  const onCaseAdvance = useCallback(() => {
    setActiveCaseIndex((i) => (i + 1) % 4)
  }, [])

  const onCaseListPointerInsideChange = useCallback((inside: boolean) => {
    setCaseListPointerInside(inside)
  }, [])

  const autoRotatePaused = !autoRotate || caseListPointerInside

  const body = (
    <>
      <h2 className={quadrantHeadingClass}>Case Studies</h2>
      <Fake3DCube activeCaseIndex={activeCaseIndex} />
      <CaseStudyList
        activeCaseIndex={activeCaseIndex}
        onActiveCaseChange={setActiveCaseIndex}
        autoRotatePaused={autoRotatePaused}
        onAutoAdvance={onCaseAdvance}
        onCaseListPointerInsideChange={onCaseListPointerInsideChange}
      />
    </>
  )

  if (layout === 'quadrant') {
    return <div className="flex h-full min-h-0 flex-col">{body}</div>
  }

  const footerWidthClass =
    footerColumn === 'modal-wide' ? 'w-full min-w-0 max-w-full' : footerHomeGridWidthClass

  return (
    <div
      ref={setFooterShellEl}
      className={`${quadrantCell} group/right-quadrant relative mx-auto flex ${footerWidthClass} ${footerPanelHeightClass} flex-col`}
      data-quadrant-in-view={footerNarrowMajorityInView ? true : undefined}
    >
      {topRightSlot ? (
        <div className="pointer-events-auto absolute right-2 top-2 z-[15] md:right-3 md:top-3">
          {topRightSlot}
        </div>
      ) : null}
      <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{body}</div>
    </div>
  )
}
