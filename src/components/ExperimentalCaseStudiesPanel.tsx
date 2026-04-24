import { useCallback, useState, type ReactNode } from 'react'
import { CaseStudyList } from './CaseStudyList'
import { Fake3DCube } from './Fake3DCube'

/** Chamfered border + fill via ::before/::after (see index.css). */
const quadrantCell = 'quadrant-cell min-h-0 min-w-0'

/** Matches quadrant section titles (e.g. Case Studies) on the home grid. */
const quadrantHeadingClass =
  'shrink-0 px-4 pt-3 text-left text-[11px] font-semibold tracking-[0.06em] text-fg/90 md:pt-4 md:text-xs md:tracking-[0.05em]'

/**
 * Home grid stacks quadrants full-width below `lg`; the 1/3 `max-w` is only for the split 2+1
 * column. Shared by case-study footers and {@link CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS} so they
 * match the Case Studies column on `/` (not the old 36–48rem reading-width cap).
 */
const caseStudiesHomeColumnWidthClass =
  'w-full min-w-0 max-w-full lg:max-w-[calc((100vw-2.5rem-1rem)/3)]'

const footerHomeGridWidthClass = caseStudiesHomeColumnWidthClass

/**
 * Case studies quick-nav modal: same max width as the home Case Studies quadrant (see
 * `caseStudiesHomeColumnWidthClass`). `shrink-0` keeps the flex-centred dialog from shrinking.
 * Pair with `footerColumn="modal-wide"` on the panel (`w-full` fill).
 */
export const CASE_STUDIES_MODAL_SHELL_WIDTH_CLASS =
  `${caseStudiesHomeColumnWidthClass} shrink-0`

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
    footerColumn === 'modal-wide' ? 'w-full min-w-0 max-w-full' : footerHomeGridWidthClass

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
