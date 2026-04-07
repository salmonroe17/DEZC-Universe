import { useCallback, useState, type ReactNode } from 'react'
import { CaseStudyList } from './CaseStudyList'
import { Fake3DCube } from './Fake3DCube'

/** Chamfered border + fill via ::before/::after (see index.css). */
const quadrantCell = 'quadrant-cell min-h-0 min-w-0'

/** Matches quadrant section titles (e.g. Case Studies) on the home grid. */
const quadrantHeadingClass =
  'shrink-0 px-4 pt-3 text-left text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:pt-4 md:text-xs md:tracking-[0.05em]'

/**
 * Width of the home page’s 1fr column: `grid-cols-[2fr_1fr]` with `gap-3 md:gap-4` inside
 * `p-4 md:p-5` (ExperimentalGrid). Matches the physical width of the Case Studies column on `/`.
 */
const homeQuadrantColumnWidthClass =
  'w-full max-w-[calc((100vw-2rem-0.75rem)/3)] md:max-w-[calc((100vw-2.5rem-1rem)/3)]'

/**
 * Fixed modal shell width (not max-content) so list row / title length doesn’t resize the overlay.
 * Pair with {@link ExperimentalCaseStudiesPanel} `footerColumn="modal-wide"` (`w-full` fill).
 */
export const CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS =
  'w-[min(calc(100vw-2rem),36rem)] shrink-0 sm:w-[min(calc(100vw-2.5rem),42rem)] md:w-[min(calc(100vw-3rem),48rem)] max-w-full'

/**
 * Footer layout: taller than the home grid estimate, capped by viewport so it feels like a hero
 * module; cube stays vertically centered in the flex-1 band above the list.
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
}

export function ExperimentalCaseStudiesPanel({
  autoRotate = true,
  layout = 'quadrant',
  topRightSlot,
  footerColumn = 'home-grid',
}: ExperimentalCaseStudiesPanelProps) {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const [caseListPointerInside, setCaseListPointerInside] = useState(false)

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
    return body
  }

  const footerWidthClass =
    footerColumn === 'modal-wide' ? 'w-full min-w-0 max-w-full' : homeQuadrantColumnWidthClass

  return (
    <div
      className={`${quadrantCell} group/right-quadrant relative mx-auto flex ${footerWidthClass} ${footerPanelHeightClass} flex-col`}
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
